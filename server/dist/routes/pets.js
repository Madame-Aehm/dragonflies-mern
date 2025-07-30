"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pets_1 = require("../controllers/pets");
const router = express_1.default.Router();
// router.get("/test", (req, res) => {
//     res.send('testing route....')
// })
router.post("/", pets_1.addPet);
router.get("/", pets_1.getPets);
exports.default = router;
