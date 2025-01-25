import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import conf from "../conf/conf.js";

cloudinary.config({
    cloud_name: conf.cloudinaryName,
    api_key: conf.cloudinaryApiKey,
    api_secret: conf.cloudinaryApiSecret
})

const uploadOncloudinary = async (localFilePath) => {
    try {
        if (localFilePath) {
            console.log("here cloudinary ",localFilePath);
            
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            console.log("cloudinary " ,response);
            
            fs.unlinkSync(localFilePath)
            return response;
        }
        return null
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default uploadOncloudinary