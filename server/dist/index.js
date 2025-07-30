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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const pets_1 = __importDefault(require("./routes/pets"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = require("./middlewares/jwt");
const cloudinary_1 = __importDefault(require("./config/cloudinary"));
const path_1 = __importDefault(require("path"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("no mongo uri");
        }
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({
            extended: true,
        }));
        app.use((0, cors_1.default)());
        (0, cloudinary_1.default)();
        app.use("/", express_1.default.static(path_1.default.join(__dirname, "documentation")));
        app.use("/images", express_1.default.static("uploads"));
        app.use(jwt_1.testingMiddleware);
        app.post('/testing', (req, res) => {
            res.send('Hello World!');
        });
        app.use("/api/users", users_1.default);
        app.use("/api/pets", pets_1.default);
        app.use('/*splat', (req, res) => res.status(404).json({ error: "Endpoint not found." }));
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log("Connection to MongoDB established, and server is running on http://localhost:" + port);
        });
    }
    catch (error) {
        console.log(error);
    }
});
main();
