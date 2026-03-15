import imageCompression from "browser-image-compression";
import { videoService } from "@/lib/video-service";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB

export type MediaUploadProgress = {
  phase: "compressing" | "uploading";
  percent: number;
};

export async function uploadProductMedia(
  files: File[],
  tenantId: string,
  onProgress?: (progress: MediaUploadProgress) => void,
): Promise<string[]> {
  const safeFiles: File[] = [];
  let videoPicked = false;
  let imageCount = 0;

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "1a2a77",
    },
    body: JSON.stringify({
      sessionId: "1a2a77",
      runId: "run1",
      hypothesisId: "H1",
      location: "lib/services/media.ts:uploadProductMedia:entry",
      message: "uploadProductMedia called",
      data: {
        fileCount: files.length,
        types: files.map((f) => f.type),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  for (const original of files) {
    if (safeFiles.length >= 4) break;

    const isVideo = original.type.startsWith("video/");
    const isImage = original.type.startsWith("image/");

    if (!isVideo && !isImage) continue;

    if (isVideo) {
      if (videoPicked) {
        // eslint-disable-next-line no-alert
        alert(
          "Only one video is allowed per upload batch. Extra videos will be ignored.",
        );
        continue;
      }

      const result = await videoService.compress(original, (pct) =>
        onProgress?.({ phase: "compressing", percent: pct }),
      );

      if (!result.ok) {
        // eslint-disable-next-line no-alert
        alert(result.error);
        continue;
      }

      const compressedFile = new File([result.data], original.name, {
        type: "video/mp4",
      });
      videoPicked = true;
      safeFiles.push(compressedFile);
      continue;
    }

    // Images: compress if larger than the 3MB threshold.
    let fileToUse = original;
    if (original.size > MAX_IMAGE_BYTES) {
      try {
        fileToUse = await imageCompression(original, {
          maxSizeMB: 3,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
      } catch (error) {
        console.error("Image compression failed:", error);
        // eslint-disable-next-line no-alert
        alert(
          "Failed to compress an image. Please try again with a smaller file.",
        );
        continue;
      }
    }

    safeFiles.push(fileToUse);
    imageCount += 1;
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "1a2a77",
    },
    body: JSON.stringify({
      sessionId: "1a2a77",
      runId: "run1",
      hypothesisId: "H2",
      location: "lib/services/media.ts:uploadProductMedia:afterLoop",
      message: "Counts after processing selected files",
      data: {
        imageCount,
        safeFilesCount: safeFiles.length,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  if (!safeFiles.length) {
    return [];
  }

  const formData = new FormData();
  formData.append("tenantId", tenantId);
  for (const file of safeFiles) {
    formData.append("files", file);
  }

  const { ok, body, status } = await uploadWithProgress(formData, (pct) =>
    onProgress?.({ phase: "uploading", percent: pct }),
  );

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/95122c88-1964-458a-a916-5e32205c060c", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "1a2a77",
    },
    body: JSON.stringify({
      sessionId: "1a2a77",
      runId: "run2",
      hypothesisId: "H3",
      location: "lib/services/media.ts:uploadProductMedia:afterUpload",
      message: "Upload response from /api/upload-media",
      data: {
        status,
        ok,
        body,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  if (!ok) {
    const data = body as { ok: boolean; error?: string } | null;
    const message =
      data?.error || "Failed to upload media. Please try again later.";
    // eslint-disable-next-line no-alert
    alert(message);
    throw new Error(message);
  }

  const json = body as { ok: boolean; urls?: string[]; error?: string };
  if (!json.ok || !json.urls) {
    const message =
      json.error || "Upload did not return any URLs. Please try again.";
    // eslint-disable-next-line no-alert
    alert(message);
    throw new Error(message);
  }

  return json.urls.slice(0, 4);
}

function uploadWithProgress(
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<{ ok: boolean; status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload-media");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      let body = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // ignore
      }
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        body,
      });
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}
