import express from 'express'
import { getAllUsers, getUserByUN, login, register, updateUser } from '../controllers/users';

const router = express.Router();

router.get("/test", (req, res) => {
  res.send('testing route....')
})

// auth endpoints
router.post("/register", register)
router.post("/login", login);


// user endpoints
router.get("/", getAllUsers)
router.get("/:search", getUserByUN)
router.post("/update/:_id", updateUser)

export default router