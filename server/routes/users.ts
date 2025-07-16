import express from 'express'
import { getAllUsers, getUserByUN } from '../controllers/users';

const router = express.Router();

router.get("/test", (req, res) => {
  res.send('testing route....')
})

router.get("/", getAllUsers)
router.get("/:search", getUserByUN)

export default router