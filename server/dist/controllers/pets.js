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
exports.addPet = exports.getPets = void 0;
const errorHandling_1 = require("../utils/errorHandling");
const mongoose_1 = __importDefault(require("mongoose"));
const pets_1 = __importDefault(require("../models/pets"));
const users_1 = __importDefault(require("../models/users"));
const getPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    try {
        let pets;
        if (search) {
            pets = yield pets_1.default.find({ name: {
                    "$regex": search,
                    "$options": "i"
                } }).populate({ path: "owner", select: "username createdAt" });
        }
        else {
            pets = yield pets_1.default.find().populate({ path: "owner", select: "username createdAt" });
        }
        res.status(200).json(pets);
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.getPets = getPets;
const addPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, animal, owner } = req.body;
        if (!name || !animal) {
            return res.status(400).json({ error: "name and animal required" });
        }
        if (!mongoose_1.default.isValidObjectId(owner)) {
            return res.status(400).json({ error: "owner must be an objectid" });
        }
        const newPet = yield pets_1.default.create(Object.assign({}, req.body));
        // add newly created pet id to user 
        yield users_1.default.findByIdAndUpdate(owner, {
            $push: { pets: newPet._id }
        });
        res.status(201).json(newPet);
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.addPet = addPet;
