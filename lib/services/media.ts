export async function uploadProductMedia(files: File[]): Promise<string[]> {
  // Simulation layer for product media uploads.
  // Currently uses temporary object URLs; in production, swap this
  // implementation to call a real uploader (e.g. Cloudinary) and
  // return persistent CDN URLs.

  const urls: string[] = [];
  let videoPicked = false;

  for (const file of files) {
    const objectUrl = URL.createObjectURL(file);

    if (file.type.startsWith("video/")) {
      if (videoPicked) continue;
      videoPicked = true;
      urls.push(objectUrl);
    } else {
      urls.push(objectUrl);
    }

    if (urls.length >= 4) break;
  }

  return urls.slice(0, 4);
}

