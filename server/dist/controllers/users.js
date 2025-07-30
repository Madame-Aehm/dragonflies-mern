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
exports.updateUser = exports.getUserByUN = exports.getAllUsers = exports.getActiveUser = exports.login = exports.register = void 0;
const errorHandling_1 = require("../utils/errorHandling");
const users_1 = __importDefault(require("../models/users"));
const hashPassword_1 = require("../utils/hashPassword");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
const imageManagement_1 = require("../utils/imageManagement");
// auth functions 
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "both email and password are required" });
        }
        const existingUser = yield users_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "user already exists" });
        }
        const encryptedPassword = yield (0, hashPassword_1.encryptPassword)(password);
        console.log(encryptedPassword);
        const newUser = yield users_1.default.create(Object.assign(Object.assign({}, req.body), { password: encryptedPassword }));
        // console.log(newUser)
        // res.status(201).json({
        //   success: true,
        //   _id: newUser._id
        // })
        // generate token
        res.status(201).json({
            user: {
                email: newUser.email,
                username: newUser.username,
                _id: newUser._id,
                createdAt: newUser.createdAt
            }
        });
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log("details:", email, password);
        if (!email || !password) {
            return res.status(400).json({ error: "both email and password are required" });
        }
        // validate email + password correctly formatted
        const user = yield users_1.default.findOne({ email });
        console.log("found user", user);
        if (!user) {
            return res.status(404).json({ error: "no user with that email" });
        }
        console.log("password", password, "hashedPW", user.password);
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        console.log("isValid", isValid);
        if (!isValid) {
            return res.status(400).json({ error: "password is wrong" });
        }
        user.set("password", undefined);
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.email);
        console.log(token);
        res.status(200).json({
            validated: true,
            token: token,
            user: user
        });
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.login = login;
const getActiveUser = (req, res) => {
    res.status(200).json({
        message: "token validated",
        user: req.user
    });
};
exports.getActiveUser = getActiveUser;
// user functions
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield users_1.default.find().select("-password");
        res.status(users.length === 0 ? 204 : 200).json(users);
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.getAllUsers = getAllUsers;
const getUserByUN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.params.search;
        const user = yield users_1.default
            .findOne({ username: {
                '$regex': `^${search}$`,
                $options: 'i'
            } })
            .select("-password")
            .populate({ path: "pets", select: ["name", "animal"] });
        if (user) {
            return res.status(200).json(user);
        }
        res.status(404).json({ error: "no user found" });
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
});
exports.getUserByUN = getUserByUN;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const _id = req.params._id;
        const _id = req.user._id;
        const body = req.body;
        console.log(_id, body);
        if (req.file) {
            body.image = yield (0, imageManagement_1.imageUpload)(req.file, "dragonflies/user_profiles");
        }
        // if body.password, encrpyt password
        const updatedUser = yield users_1.default.findByIdAndUpdate(_id, body, { new: true }).select("-password -updatedAt");
        res.status(200).json(updatedUser);
    }
    catch (error) {
        (0, errorHandling_1.handleError)(error, res);
    }
    finally {
        if (req.file) {
            (0, imageManagement_1.removeTempFile)(req.file);
        }
    }
});
exports.updateUser = updateUser;
