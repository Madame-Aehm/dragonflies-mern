import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import UserModel from "../models/users";

declare global {
    namespace Express {
        interface Request {
            user?: any // or custom user type 
        }
    }
}

export const testingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.path);
    next();
    // const value = false;
    // if (value) {
    //     next()
    // } else {
    //     res.status(500).json({ error: "value is false" })
    // }
}

export const jwtAuth = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(400).json({ error: "no token" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.log("check env");
        return res.status(500).json({ error: "no secret" });
    }
    try {
        const valid = jwt.verify(token, secret);
        console.log(valid);
        const user = await UserModel.findById(valid.sub).select("-password")
        console.log(user)
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "reauth required" });
    }
}