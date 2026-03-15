import { v2 as cloudinary } from "cloudinary";

type TenantUploadOptions = {
  tenantId: string;
  resourceType: "image" | "video";
  cloudinaryName?: string | null;
  cloudinaryKey?: string | null;
  cloudinarySecret?: string | null;
};

function getCloudinaryClient(opts: {
  cloudinaryName?: string | null;
  cloudinaryKey?: string | null;
  cloudinarySecret?: string | null;
}) {
  const { cloudinaryName, cloudinaryKey, cloudinarySecret } = opts;

  if (!cloudinaryName || !cloudinaryKey || !cloudinarySecret) {
    throw new Error(
      "Cloudinary credentials are required (cloudinaryName, cloudinaryKey, cloudinarySecret).",
    );
  }

  // Create an isolated Cloudinary client for this tenant.
  const CloudinaryCtor = (cloudinary as any).Cloudinary;
  if (typeof CloudinaryCtor !== "function") {
    throw new Error("Cloudinary client is not properly configured.");
  }

  const tenantClient = new CloudinaryCtor({
    cloud_name: cloudinaryName,
    api_key: cloudinaryKey,
    api_secret: cloudinarySecret,
    secure: true,
  });

  return tenantClient;
}

export async function uploadTenantMediaFromBuffer(
  buffer: Buffer,
  {
    tenantId,
    resourceType,
    cloudinaryName,
    cloudinaryKey,
    cloudinarySecret,
  }: TenantUploadOptions,
): Promise<string> {
  const folder = `getcheapecommerce/tenants/${tenantId}/products`;
  const tags = [tenantId, "product-media"];

  const client = getCloudinaryClient({
    cloudinaryName,
    cloudinaryKey,
    cloudinarySecret,
  });

  const result = await new Promise<any>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        tags,
      },
      (error: any, uploadResult: any) => {
        if (error || !uploadResult) {
          reject(
            error ?? new Error("Upload failed without an error message"),
          );
        } else {
          resolve(uploadResult);
        }
      },
    );

    stream.end(buffer);
  });

  return result.secure_url as string;
}

export { cloudinary };

