import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";
// import dotenv from "dotenv"
// dotenv.config()

const configureCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_APIKEY,
        api_secret: process.env.CLOUD_SECRET
    });
}

export default configureCloudinary