"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectID = mongoose_1.default.Schema.Types.ObjectId;
const petSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    animal: { type: String, enum: ["dog", "cat", "bird"] },
    owner: { type: objectID, required: true, ref: "users" }
}, { timestamps: true, collection: "pets" });
const PetModel = mongoose_1.default.model("pets", petSchema);
exports.default = PetModel;
