import jwt from "jsonwebtoken";
import 'dotenv/config'

export const generateToken = (_id: string, email: string) => {
    const payload = {
        sub: _id,
        email: email
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return null;
    }
    const token = jwt.sign(payload, secret, { expiresIn: "7d" })
    return token
}