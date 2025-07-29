import { v2 as cloudinary } from "cloudinary";

export const imageUpload = async(file: Express.Multer.File, folder: string) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, { folder: folder });
        console.log(result);
        return result.secure_url;
    } catch(e) {
        console.log(e);
    }
}

import fs from "fs";

export const removeTempFile = (file: Express.Multer.File) => {
    if (file) { 
        fs.unlink(file.path, (error) => { 
        if (error) {
            console.log(error);
        } else {
            console.log("Temp file deleted");
        }
        });
    }
}