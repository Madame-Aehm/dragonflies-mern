"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const jwt_1 = require("../middlewares/jwt");
const multer_1 = require("../middlewares/multer");
const router = express_1.default.Router();
router.get("/test", (req, res) => {
    res.send('testing route....');
});
// auth endpoints
router.post("/register", users_1.register);
router.post("/login", users_1.login);
router.get("/me", jwt_1.jwtAuth, users_1.getActiveUser);
// user endpoints
router.get("/", users_1.getAllUsers);
router.get("/:search", jwt_1.jwtAuth, users_1.getUserByUN);
router.post("/update", jwt_1.jwtAuth, multer_1.upload.single("image"), multer_1.handleMulterResponse, users_1.updateUser);
// router.post(
//   "/image", 
//   jwtAuth, 
//   upload.single("image"), 
//   handleMulterResponse,
//   async(req, res) => {
//     try {
//       console.log(req.file);
//       if (req.file) {
//         const result = await imageUpload(req.file, "/dragonflies/user_profiles");
//         console.log(result);
//       }
//       res.send("image testing endpoint")
//     } catch (error) {
//       console.log(error)
//       handleError(error, res);
//     }
//   }
// )
exports.default = router;
