"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const profileSchema = new mongoose.Schema({
//   birthdate: String,
//   image: String
// })
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, default: "Anon" },
    password: { type: String, required: true },
    // profile: { type: Boolean, default: false },
    image: { type: String, default: "https://res.cloudinary.com/dpqiaisdz/image/upload/v1753793578/dragonflies/user_profiles/placeholder_iq94uk.png" },
    pets: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "pets" }]
}, { timestamps: true, collection: "users" });
const UserModel = mongoose_1.default.model("users", userSchema);
exports.default = UserModel;
