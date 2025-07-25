import { Request, Response } from "express";
import { handleError } from "../utils/errorHandling";
import UserModel from "../models/users";
import { encryptPassword } from "../utils/hashPassword";
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken";

// auth functions 

export const register = async(req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "both email and password are required" })
    }
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "user already exists" })
    }
    const encryptedPassword = await encryptPassword(password)
    console.log(encryptedPassword)
    const newUser = await UserModel.create({ ...req.body, password: encryptedPassword })
    // console.log(newUser)
    // res.status(201).json({
    //   success: true,
    //   _id: newUser._id
    // })
    // generate token
    res.status(201).json({
      user: {
        email: newUser.email,
        username: newUser.username,
        _id: newUser._id,
        createdAt: newUser.createdAt
      }
    })
  } catch (error) {
    handleError(error, res);
  }
}

export const login = async(req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("details:", email, password)
    if (!email || !password) {
      return res.status(400).json({ error: "both email and password are required" })
    }
    // validate email + password correctly formatted
    const user = await UserModel.findOne({ email })
    console.log("found user", user);
    if (!user) {
      return res.status(404).json({ error: "no user with that email" });
    }
    console.log("password", password, "hashedPW", user.password);
    const isValid = await bcrypt.compare(password, user.password);
    console.log("isValid", isValid);
    if (!isValid) {
      return res.status(400).json({ error: "password is wrong" });
    }
    user.set("password", undefined);
    const token = generateToken(user._id.toString(), user.email)
    console.log(token);
    res.status(200).json({
      validated: true,
      token: token,
      user: user
    })
  } catch (error) {
    handleError(error, res);
  }
}

export const getActiveUser = (req: Request, res: Response) => {

  res.status(200).json({ 
    message: "token validated", 
    user: req.user
  });
}



// user functions

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
    const user = await UserModel
      .findOne({ username: {
        '$regex': `^${search}$`, 
        $options: 'i'
      }})
      .select("-password")
      .populate({ path: "pets", select: ["name", "animal"] });
    if (user) {
      return res.status(200).json(user)
    } 
    res.status(404).json({ error: "no user found" })
  } catch (error) {
    handleError(error, res);
  }
}

export const updateUser = async(req: Request, res: Response) => {
  try {
    // const _id = req.params._id;
    const _id = req.user._id;
    const body = req.body;
    console.log(_id, body);
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      body,
      { new: true }
    ).select("-password -updatedAt")
    res.status(200).json(updatedUser)
  } catch (error) {
    handleError(error, res);
  }
}