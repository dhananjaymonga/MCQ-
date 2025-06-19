const fs = require('fs');

function cleanupTempFile(filePath) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Temp file cleanup error:', err);
  }
}

module.exports = { cleanupTempFile };