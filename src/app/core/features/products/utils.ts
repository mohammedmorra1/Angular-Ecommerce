import { Product } from '../../../../Types/type';

export function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context generation failed'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to highly compressed JPEG data URL
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export function extractTop3Products(content: string, products: Product[]): unknown[] {
  console.log(products);
  const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)```/i);
  const candidate = jsonBlockMatch ? jsonBlockMatch[1] : content;
  const arrayMatch = candidate.match(/\[[\s\S]*\]/);

  if (!arrayMatch) {
    throw new Error('Could not find a JSON array in the Mistral response');
  }

  const jsonText = arrayMatch[0];
  const parsed = JSON.parse(jsonText);

  if (!Array.isArray(parsed)) {
    throw new Error('Parsed Mistral result is not a JSON array');
  }

  return parsed
    .slice(0, 3)
    .map((id) => {
      if (typeof id === 'number') {
        return id;
      }
      if (typeof id === 'string') {
        const parsedId = Number(id.trim());
        if (!Number.isNaN(parsedId)) {
          return parsedId;
        }
      }
      throw new Error('Parsed product id must be a numeric value');
    })
    .map((id) => products.find((p) => p.id == id));
}
