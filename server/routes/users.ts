import express from 'express'
import { getAllUsers, getUserByUN, register, updateUser } from '../controllers/users';

const router = express.Router();

router.get("/test", (req, res) => {
  res.send('testing route....')
})

router.get("/", getAllUsers)
router.get("/:search", getUserByUN)
router.post("/register", register)
router.post("/update/:_id", updateUser)

export default router