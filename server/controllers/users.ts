import { Request, Response } from "express";
import { handleError } from "../utils/errorHandling";
import UserModel from "../models/users";

export const getAllUsers = async(req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(users.length === 0 ? 204 : 200).json(users)
  } catch (error) {
    handleError(error, res);
  }
}

export const getUserByUN = async(req: Request, res: Response) => {
  try {
    const search = req.params.search;
    const user = await UserModel.findOne({ username: {
      '$regex': `^${search}$`, 
      $options: 'i'
    }}).select("-password")
    if (user) {
      return res.status(200).json(user)
    } 
    res.status(404).json({ error: "no user found" })
  } catch (error) {
    handleError(error, res);
  }
}