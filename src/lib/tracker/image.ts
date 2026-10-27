// Client-side photo shrinking: phone photos are 3–8 MB; scalp comparisons
// look identical at 1600px, and smaller files keep storage costs near zero.

const MAX_EDGE = 1600;

export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    return await toJpeg(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

/** One frame of a live camera <video>, as a JPEG. */
export function captureVideoFrame(video: HTMLVideoElement): Promise<Blob> {
  return toJpeg(video, video.videoWidth, video.videoHeight);
}

function toJpeg(source: CanvasImageSource, srcWidth: number, srcHeight: number): Promise<Blob> {
  const scale = Math.min(1, MAX_EDGE / Math.max(srcWidth, srcHeight));
  const width = Math.round(srcWidth * scale);
  const height = Math.round(srcHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas not supported"));
  ctx.drawImage(source, 0, 0, width, height);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not process photo"))),
      "image/jpeg",
      0.85
    )
  );
}
