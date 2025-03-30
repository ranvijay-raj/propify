const fs = require("fs")
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: "dfr3lyxke", 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
async function uploadToCloudinary(locaFilePath) {
  return cloudinary.uploader.upload(locaFilePath, { resource_type: "auto" }).then((result) => { 
            fs.unlinkSync(locaFilePath); 
            return { 
                message: "Success", 
                url: result.url, 
            };
        }) .catch((error) => {
            fs.unlinkSync(locaFilePath); 
            return { message: "Fail" }; 
        });
}
module.exports = uploadToCloudinary