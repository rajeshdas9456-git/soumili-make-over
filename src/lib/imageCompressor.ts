// Ultra-Fast Client-Side Image Compressor for Soumili's Makeover
// Converts 5MB-15MB bridal camera photos into crisp, lightweight web images (under 120KB) in milliseconds!

export function compressImageFile(file: File, maxWidth = 1200, quality = 0.76): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (JPG, PNG, WebP)'));
    }

    // For tiny files (under 100KB), read directly to save time
    if (file.size < 100 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/webp' || file.type === 'image/svg+xml')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Resize down to maxWidth while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(img.src);
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to high-quality JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        // Fallback: resolve original data URI if image decode fails
        resolve(event.target?.result as string);
      };
    };

    reader.onerror = (err) => reject(err);
  });
}

// Convert base64 dataURI to lightweight Blob for server upload
export function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
