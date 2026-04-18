import { v2 as cloudinary } from 'cloudinary';

// For local development, allow mock uploads if credentials are placeholders
const isLocalDev = !process.env.CLOUDINARY_CLOUD_NAME || 
  process.env.CLOUDINARY_CLOUD_NAME === 'your-cloud-name-here';

if (!isLocalDev) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not set');
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY is not set');
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET is not set');
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image) {
  // Mock upload for local development when Cloudinary is not configured
  if (isLocalDev) {
    console.log('[DEV] Using mock image upload for:', image.name || 'uploaded-image');
    // Return a placeholder image URL for local development
    return 'https://via.placeholder.com/400x300/cccccc/333333?text=Mock+Upload';
  }

  const imageData = await image.arrayBuffer();
  const mime = image.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(imageData).toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'nextjs-course-mutations',
  });
  return result.secure_url;
}
