"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTempFile = exports.imageUpload = void 0;
const cloudinary_1 = require("cloudinary");
const imageUpload = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(file.path, { folder: folder });
        console.log(result);
        return result.secure_url;
    }
    catch (e) {
        console.log(e);
    }
});
exports.imageUpload = imageUpload;
const fs_1 = __importDefault(require("fs"));
const removeTempFile = (file) => {
    if (file) {
        fs_1.default.unlink(file.path, (error) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Temp file deleted");
            }
        });
    }
};
exports.removeTempFile = removeTempFile;
