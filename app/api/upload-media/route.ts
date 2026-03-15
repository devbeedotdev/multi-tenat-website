import { NextRequest, NextResponse } from "next/server";
import { uploadTenantMediaFromBuffer } from "@/lib/cloudinary";
import { getTenantConfig } from "@/lib/dal";

type UploadResult = {
  ok: boolean;
  urls?: string[];
  error?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<UploadResult>> {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    const tenantIdRaw = formData.get("tenantId");
    const tenantId =
      typeof tenantIdRaw === "string" ? tenantIdRaw.trim() : "";

    if (!tenantId) {
      return NextResponse.json(
        { ok: false, error: "Missing tenantId for media upload." },
        { status: 400 },
      );
    }

    // Resolve Cloudinary credentials for this tenant from the database.
    const tenantResult = await getTenantConfig(tenantId);
    if (!tenantResult.ok || !tenantResult.data) {
      return NextResponse.json(
        { ok: false, error: tenantResult.ok ? "Tenant not found." : tenantResult.error },
        { status: 400 },
      );
    }

    const cloudinaryName = tenantResult.data.cloudinaryName;
    const cloudinaryKey = tenantResult.data.cloudinaryKey;
    const cloudinarySecret = tenantResult.data.cloudinarySecret;

    if (!cloudinaryName || !cloudinaryKey || !cloudinarySecret) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Cloudinary is not configured for this tenant. Please ask the super admin to set Cloudinary details in the store settings.",
        },
        { status: 400 },
      );
    }

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

    // Enforce at most one video per upload batch.
    let videoCount = 0;
    for (const file of files) {
      if (file.type.startsWith("video/")) {
        videoCount += 1;
      }
    }
    if (videoCount > 1) {
      return NextResponse.json(
        {
          ok: false,
          error: "Only one video is allowed among the media items.",
        },
        { status: 400 },
      );
    }

    // NOTE: We allow "video-only" uploads; the requirement for at least
    // one image is enforced at the product save layer, not the media API.

    const uploadSingle = async (file: File): Promise<string> => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const resourceType = file.type.startsWith("video/")
        ? "video"
        : "image";

      return uploadTenantMediaFromBuffer(buffer, {
        tenantId,
        resourceType,
        cloudinaryName,
        cloudinaryKey,
        cloudinarySecret,
      });
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

