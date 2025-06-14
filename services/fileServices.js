const fs = require('fs');
const path = require('path');

class FileService {
  /**
   * Delete local file
   * @param {string} filePath - File path to delete
   */
  deleteLocalFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Local file deleted successfully:', filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Warning: Could not delete local file:', error.message);
      return false;
    }
  }

  /**
   * Extract local path from full URL
   * @param {string} fullUrl - Full URL including protocol and host
   * @param {string} protocol - Request protocol
   * @param {string} host - Request host
   * @returns {string} Local file path
   */
  extractLocalPath(fullUrl, protocol, host) {
    if (!fullUrl) return '';
    return fullUrl.replace(`${protocol}://${host}/`, '');
  }

  /**
   * Generate local PDF URL
   * @param {string} filePath - Local file path
   * @param {Object} req - Express request object
   * @returns {string} Full URL to local file
   */
  generateLocalUrl(filePath, req) {
    return `${req.protocol}://${req.get('host')}/${filePath}`;
  }

  /**
   * Ensure upload directory exists
   */
  ensureUploadDir() {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Upload directory created');
    }
  }

  /**
   * Get file size in bytes
   * @param {string} filePath - Path to file
   * @returns {number} File size in bytes
   */
  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      console.warn('Could not get file size:', error.message);
      return 0;
    }
  }
}

module.exports = new FileService();