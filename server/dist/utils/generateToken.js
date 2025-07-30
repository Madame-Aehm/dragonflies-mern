"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const generateToken = (_id, email) => {
    const payload = {
        sub: _id,
        email: email
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" });
    return token;
};
exports.generateToken = generateToken;
