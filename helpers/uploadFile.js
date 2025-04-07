const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports.upload = async (buffer) => {
  let result = await streamUpload(buffer);
  return result.secure_url;
};