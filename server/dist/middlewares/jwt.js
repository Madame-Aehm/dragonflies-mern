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
exports.jwtAuth = exports.testingMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
const testingMiddleware = (req, res, next) => {
    console.log(req.method, req.path);
    next();
    // const value = false;
    // if (value) {
    //     next()
    // } else {
    //     res.status(500).json({ error: "value is false" })
    // }
};
exports.testingMiddleware = testingMiddleware;
const jwtAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(400).json({ error: "no token" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.log("check env");
        return res.status(500).json({ error: "no secret" });
    }
    try {
        const valid = jsonwebtoken_1.default.verify(token, secret);
        console.log(valid);
        const user = yield users_1.default.findById(valid.sub).select("-password");
        console.log(user);
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "reauth required" });
    }
});
exports.jwtAuth = jwtAuth;
