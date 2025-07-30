import express from "express";
import cors from "cors";
import userRouter from "./routes/users";
import petRouter from "./routes/pets";
import 'dotenv/config';
import mongoose from "mongoose";
import { testingMiddleware } from "./middlewares/jwt";
import configureCloudinary from "./config/cloudinary";
import path from "path";



const main = async() => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("no mongo uri")
        }

        await mongoose.connect(process.env.MONGO_URI)

        const app = express();

        app.use(express.json());
        app.use(
            express.urlencoded({
                extended: true,
            })
        );
        app.use(cors());
        configureCloudinary();
        app.use("/", express.static(path.join(__dirname, "documentation")));
        app.use("/images", express.static("uploads"));
        app.use(testingMiddleware);


        app.post('/testing', (req, res) => {
            res.send('Hello World!')
        });

        app.use("/api/users", userRouter);
        app.use("/api/pets", petRouter);

        app.use('/*splat', (req, res) => res.status(404).json({ error: "Endpoint not found." }));

        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log("Connection to MongoDB established, and server is running on http://localhost:" + port);
        });
    } catch (error) {
        console.log(error);
    }
}

main();