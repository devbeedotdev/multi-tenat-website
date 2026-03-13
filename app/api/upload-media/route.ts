import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

type UploadResult = {
  ok: boolean;
  urls?: string[];
  error?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<UploadResult>> {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (!files.length) {
      return NextResponse.json(
        { ok: false, error: "No files provided for upload." },
        { status: 400 },
      );
    }

    if (files.length > 4) {
      return NextResponse.json(
        { ok: false, error: "Maximum of 4 media items is allowed." },
        { status: 400 },
      );
    }

    let videoCount = 0;
    let imageCount = 0;

    for (const file of files) {
      if (file.type.startsWith("video/")) {
        videoCount += 1;
      } else if (file.type.startsWith("image/")) {
        imageCount += 1;
      }
    }

    if (imageCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Please upload at least one image." },
        { status: 400 },
      );
    }

    if (videoCount > 1) {
      return NextResponse.json(
        { ok: false, error: "Only one video is allowed among the media items." },
        { status: 400 },
      );
    }

    const uploadSingle = async (file: File): Promise<string> => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const resourceType = file.type.startsWith("video/") ? "video" : "image";

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: resourceType,
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error ?? new Error("Upload failed without an error message"));
            } else {
              resolve(uploadResult);
            }
          },
        );

        stream.end(buffer);
      });

      return result.secure_url as string;
    };

    const urls: string[] = [];

    for (const file of files) {
      const url = await uploadSingle(file);
      urls.push(url);
    }

    return NextResponse.json({ ok: true, urls }, { status: 200 });
  } catch (error) {
    console.error("upload-media route failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to upload media. Please try again.",
      },
      { status: 500 },
    );
  }
}

