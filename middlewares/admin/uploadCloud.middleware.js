const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET  // Click 'View Credentials' below to copy your API secret
});

module.exports.upload = (req, res, next) => {
  if (req.file) {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadWithRetry = async (req, retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const result = await streamUpload(req);
          req.body[req.file.fieldname] = result.secure_url;
          next();
          return;
        } catch (error) {
          console.error(`Upload attempt ${attempt} failed:`, error);
          if (attempt === retries || error.name !== 'TimeoutError') {
            res.status(500).send('File upload failed.');
            return;
          }
        }
      }
    };

    uploadWithRetry(req);
  } else {
    next();
  }
};