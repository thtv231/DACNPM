const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({ 
    cloud_name: process.CLOUD_NAME, 
    api_key: process.CLOUD_KEY, 
    api_secret: process.CLOUD_SECRET  // Click 'View Credentials' below to copy your API secret
});
const MAX_RETRIES = 3;
module.exports.upload =async (req,res,next)=>{
     
        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            });
            
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };
    
        const uploadWithRetry = async (req, retries) => {
          for (let attempt = 1; attempt <= retries; attempt++) {
            try {
              const result = await streamUpload(req);
              return result;  // Return the result if successful
            } catch (error) {
              console.error(`Upload attempt ${attempt} failed:`, error);
              if (attempt === retries || error.http_code !== 499) {
                throw error;  // Rethrow the error if max retries reached or non-timeout error
              }
            }
          }
        };
    
        try {
          const result = await uploadWithRetry(req, MAX_RETRIES);
          console.log(result);
          req.body[req.file.fieldname] = result.secure_url
          next()  
          // Attach the upload result to the request object
          
    
          // Proceed to the next middleware/controller
        } catch (error) {
            console.error("Final upload error:", error);
            if (error.http_code === 499) {
                res.status(408).send("Request Timeout, please try again");
            } else {
                res.status(500).send("Upload failed");
            }
        }
        
        
      

}