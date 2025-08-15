"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterResponse = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
    // destination: "uploads/",
    // filename: function(req, file, cb) {
    //     const fileExt = path.extname(file.originalname);
    //     let filename = req.user._id + "-" + Date.now() + fileExt;
    //     return cb(null, filename)
    // }
    }),
    fileFilter: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname);
        if (fileExt !== ".jpg" && fileExt !== ".jpeg" && fileExt !== ".png") {
            // cb(new Error("File extension not supported"));
            req.multerError = "File extension not supported";
            cb(null, false);
            return;
        }
        cb(null, true);
    },
});
const handleMulterResponse = (req, res, next) => {
    if (req.multerError) {
        return res.status(403).json({ error: req.multerError });
    }
    next();
};
exports.handleMulterResponse = handleMulterResponse;
