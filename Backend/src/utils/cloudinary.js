import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilepath) => {
  try {
    if (!localFilepath) return null;

    // Upload the file on cloudinary

    const result = await cloudinary.uploader.upload(localFilepath, {
      resource_type: "auto",
    });

    // file was successfully uploaded only for debuging purpose
    console.log("File has been successfully uploaded", result.url);

    fs.unlinkSync(localFilepath);
    return result;
  } catch (error) {
    fs.unlinkSync(localFilepath); // remove the locally uploaded temporary file as the upload operation gets failed
    return null;
  }
};

export { uploadOnCloudinary };
