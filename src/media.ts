import { useEffect, useState } from 'react';

const MAX_EDGE = 1600;

// Shrinks a photo to 1600px on its long edge and re-encodes as JPEG ~0.85.
export async function resizePhoto(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode photo'))), 'image/jpeg', 0.85),
  );
}

// Object URL for a Blob, revoked when the blob changes or the component unmounts.
export function useBlobUrl(blob?: Blob): string {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!blob) {
      setUrl('');
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

// On-device OCR. Tesseract is only downloaded the first time this runs.
export async function readTextFromImage(image: Blob): Promise<string> {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker(['eng', 'por']);
  try {
    const { data } = await worker.recognize(image);
    return data.text;
  } finally {
    await worker.terminate();
  }
}
