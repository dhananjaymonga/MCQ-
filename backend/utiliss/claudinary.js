const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function generateThumbnail(tempFilePath) {
  try {
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'image',
      format: 'jpg',
      pages: 1,
      folder: 'pdf-thumbnails',
      transformation: [
        { width: 300, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return '';
  }
}

module.exports = { generateThumbnail };