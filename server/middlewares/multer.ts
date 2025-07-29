import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path"

// export const upload = multer({ dest: 'uploads/' })

declare global {
    namespace Express {
        interface Request {
            multerError?: string
        }
    }
}

export const upload = multer({
    storage: multer.diskStorage({
        // destination: "uploads/",
        // filename: function(req, file, cb) {
        //     const fileExt = path.extname(file.originalname);
        //     let filename = req.user._id + "-" + Date.now() + fileExt;
        //     return cb(null, filename)
        // }
    }),
    fileFilter: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        if (fileExt !== ".jpg" && fileExt !== ".jpeg" && fileExt !== ".png") {
            // cb(new Error("File extension not supported"));
            req.multerError = "File extension not supported";
            cb(null, false);
            return;
        }
        cb(null, true);
    },
})


export const handleMulterResponse = (req: Request, res: Response, next: NextFunction) => {
    if (req.multerError) {
        return res.status(403).json({ error: req.multerError });
    }
    next();
}