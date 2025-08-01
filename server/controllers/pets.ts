import { Request, Response } from "express";
import { handleError } from "../utils/errorHandling";
import mongoose from "mongoose";
import PetModel from "../models/pets";
import UserModel from "../models/users";


export const getPets = async(req: Request, res: Response) => {
    const { search } = req.query;
    try {
        let pets;
        if (search) {
            pets = await PetModel.find({ name: { 
                "$regex": search, 
                "$options": "i" 
            }}).populate({ path: "owner", select: "username createdAt" });
        } else {
            pets = await PetModel.find().populate({ path: "owner", select: "username createdAt" });
        }
        res.status(200).json(pets);
    } catch (error) {
        handleError(error, res);
    }
}

export const addPet = async(req: Request, res: Response) => {
    try {
        const { name, animal, owner } = req.body;
        if (!name || !animal) {
            return res.status(400).json({ error: "name and animal required"});
        }
        if (!mongoose.isValidObjectId(owner)) {
            return res.status(400).json({ error: "owner must be an objectid"})
        }
        const newPet = await PetModel.create({ ...req.body });
        // add newly created pet id to user 
        await UserModel.findByIdAndUpdate(owner, {
            $push: { pets: newPet._id }
        });
        res.status(201).json(newPet);
    } catch (error) {
        handleError(error, res);
    }
}