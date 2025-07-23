import express from 'express'
import { addPet, getPets } from '../controllers/pets';

const router = express.Router();

// router.get("/test", (req, res) => {
//     res.send('testing route....')
// })

router.post("/", addPet);

router.get("/", getPets);


export default router