import express from 'express'
import { getActiveUser, getAllUsers, getUserByUN, login, register, updateUser } from '../controllers/users';
import { jwtAuth, testingMiddleware } from '../middlewares/jwt';
import { handleMulterResponse, upload } from '../middlewares/multer';
import { imageUpload } from '../utils/imageManagement';
import { handleError } from '../utils/errorHandling';

const router = express.Router();

router.get("/test", (req, res) => {
  res.send('testing route....')
})

// auth endpoints
router.post("/register", register)
router.post("/login", login);
router.get("/me", jwtAuth, getActiveUser);


// user endpoints
router.get("/", getAllUsers)
router.get("/:search", jwtAuth, getUserByUN)
router.post("/update", jwtAuth, upload.single("image"), handleMulterResponse, updateUser);

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


export default router