import express from 'express'
import { getActiveUser, getAllUsers, getUserByUN, login, register, updateUser } from '../controllers/users';
import { jwtAuth, testingMiddleware } from '../middlewares/users';

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
router.post("/update", jwtAuth, updateUser)


export default router