const cloudinary = require("cloudinary").v2;

const uploadFileHelper = require("../../helpers/uploadFile");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports.upload = async (req, res, next) => {
  if (req.file) {
    req.body[req.file.fieldname] = await uploadFileHelper.upload(req.file.buffer);
  }

  next();
};
