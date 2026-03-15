import type { Result } from "@/types/result";

const MAX_OUTPUT_BYTES = 5 * 1024 * 1024;
const MAX_INPUT_BYTES = 50 * 1024 * 1024;
const TARGET_SIZE_KB = 5000;
const SAFETY_FACTOR = 0.9;
const AUDIO_BITRATE_KBPS = 64;

type ProgressCallback = (percent: number) => void;

let ffmpegModulePromise: Promise<any> | null = null;

function loadModules(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("VideoService can only run in the browser.");
  }
  if (!ffmpegModulePromise) {
    ffmpegModulePromise = Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]).then(([ff, util]) => ({ ...ff, ...util }));
  }
  return ffmpegModulePromise;
}

class VideoService {
  private static instance: VideoService;
  private ffmpeg: any = null;
  private fetchFile: ((f: File) => Promise<Uint8Array>) | null = null;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): VideoService {
    if (!VideoService.instance) {
      VideoService.instance = new VideoService();
    }
    return VideoService.instance;
  }

  async ensureLoaded(): Promise<void> {
    if (this.ffmpeg?.loaded) return;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      const { FFmpeg, fetchFile, toBlobURL } = await loadModules();
      const ffmpeg = new FFmpeg();

      const baseURL =
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript",
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm",
        ),
      });

      this.ffmpeg = ffmpeg;
      this.fetchFile = fetchFile;
    })();

    return this.loadPromise;
  }

  async compress(
    file: File,
    onProgress?: ProgressCallback,
  ): Promise<Result<Blob>> {
    if (file.size <= MAX_OUTPUT_BYTES) {
      return { ok: true, data: file };
    }

    if (file.size > MAX_INPUT_BYTES) {
      return {
        ok: false,
        error:
          "The video is larger than 50 MB. Please choose a shorter or smaller clip.",
      };
    }

    try {
      const duration = await this.getVideoDuration(file);
      if (!duration || duration <= 0) {
        return {
          ok: false,
          error:
            "Unable to read the video duration. Please try a different file.",
        };
      }

      await this.ensureLoaded();
      const ffmpeg = this.ffmpeg!;
      const fetchFileFn = this.fetchFile!;

      await this.safeDelete("input.mp4");
      await this.safeDelete("output.mp4");

      // Bitrate = (targetKB × 8) / duration, with 90% safety buffer.
      const totalBitrateKbps = (TARGET_SIZE_KB * 8) / duration;
      const safeBitrate = totalBitrateKbps * SAFETY_FACTOR;
      const videoBitrateKbps = Math.max(
        64,
        Math.floor(safeBitrate - AUDIO_BITRATE_KBPS),
      );
      const videoBitrate = `${videoBitrateKbps}k`;

      await ffmpeg.writeFile("input.mp4", await fetchFileFn(file));

      const progressHandler = ({ progress }: { progress: number }) => {
        const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));
        onProgress?.(pct);
      };
      ffmpeg.on("progress", progressHandler);

      try {
        await ffmpeg.exec([
          "-i",
          "input.mp4",
          "-b:v",
          videoBitrate,
          "-maxrate",
          videoBitrate,
          "-bufsize",
          `${videoBitrateKbps * 2}k`,
          "-vf",
          "scale=-2:480",
          "-c:a",
          "aac",
          "-b:a",
          `${AUDIO_BITRATE_KBPS}k`,
          "-preset",
          "fast",
          "-movflags",
          "+faststart",
          "output.mp4",
        ]);
      } finally {
        ffmpeg.off("progress", progressHandler);
      }

      const data = await ffmpeg.readFile("output.mp4");

      await this.safeDelete("input.mp4");
      await this.safeDelete("output.mp4");

      const blob = new Blob(
        [data instanceof Uint8Array ? data.buffer : data],
        { type: "video/mp4" },
      );

      if (blob.size > MAX_OUTPUT_BYTES) {
        return {
          ok: false,
          error:
            "The compressed video is still larger than 5 MB. Please try a shorter clip.",
        };
      }

      onProgress?.(100);
      return { ok: true, data: blob };
    } catch (error) {
      console.error("VideoService.compress failed:", error);
      const msg = error instanceof Error ? error.message : String(error);

      if (/out of memory|cannot enlarge|oom/i.test(msg)) {
        return {
          ok: false,
          error:
            "Device ran out of memory while compressing. Close other tabs and try again.",
        };
      }

      return { ok: false, error: `Video compression failed: ${msg}` };
    }
  }

  private getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const d = Number.isFinite(video.duration) ? video.duration : 0;
        URL.revokeObjectURL(url);
        resolve(d);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(0);
      };
      video.src = url;
    });
  }

  private async safeDelete(name: string) {
    try {
      await this.ffmpeg?.deleteFile(name);
    } catch {
      // ignore – file may not exist
    }
  }
}

export const videoService = VideoService.getInstance();
