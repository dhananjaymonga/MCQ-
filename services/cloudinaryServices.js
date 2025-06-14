const cloudinary = require('../utilty/cloudinary');

class CloudinaryService {
  /**
   * Upload PDF file to Cloudinary
   * @param {string} filePath - Local file path
   * @returns {Object} Upload results containing URLs
   */
  async uploadPDF(filePath) {
    try {
      // Upload as raw (for full PDF view)
      const rawUpload = await cloudinary.uploader.upload(filePath, {
        resource_type: 'raw',
        folder: 'pdfs',
      });

      // Upload as auto (for thumbnail generation)
      const autoUpload = await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto',
        folder: 'pdfs',
      });

      // Generate thumbnail URL from the auto upload
      const thumbnailUrl = cloudinary.url(autoUpload.public_id, {
        format: 'jpg',
        page: 1,
        secure: true,
      });

      return {
        pdfUrl: rawUpload.secure_url,
        thumbnailUrl: thumbnailUrl,
        rawPublicId: rawUpload.public_id,
        autoPublicId: autoUpload.public_id
      };
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @param {string} resourceType - Resource type ('raw' or 'auto')
   */
  async deleteFile(publicId, resourceType = 'raw') {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
      console.warn(`Warning: Could not delete Cloudinary file ${publicId}:`, error.message);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param {string} url - Cloudinary URL
   * @returns {string} Public ID
   */
  extractPublicId(url) {
    try {
      const urlParts = url.split('/');
      const publicIdWithExtension = urlParts.slice(-2).join('/');
      return publicIdWithExtension.split('.')[0];
    } catch (error) {
      throw new Error(`Invalid Cloudinary URL: ${url}`);
    }
  }
}

module.exports = new CloudinaryService();