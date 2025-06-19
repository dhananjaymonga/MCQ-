const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function testImageKitConnection() {
  try {
    await imagekit.listFiles({ limit: 1 });
    console.log('ImageKit connection successful');
  } catch (err) {
    console.error('ImageKit connection failed:', err.message);
  }
}

module.exports = imagekit;
module.exports.testImageKitConnection = testImageKitConnection;
console.log("⚠️ imagekit.js file is being used");
