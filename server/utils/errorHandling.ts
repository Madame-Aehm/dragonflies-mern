import { Response } from "express";

export const handleError = (error: unknown, res: Response) => {
  console.log(error);
  if (error instanceof Error) {
    res.status(500).json({ error: error.message })
  } else {
    res.status(500).json({ error: "Something went wrong :("})
  }
}

