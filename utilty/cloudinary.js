
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dvn9wwxhl',
    api_key: '496822881153243',
    api_secret: 'yHK8hESIHgkrJMjhD5K5sPLRzDs'
});

module.exports = cloudinary;