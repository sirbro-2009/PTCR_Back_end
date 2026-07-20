import express from "express";
import "dotenv/config";
import type { Request, Response } from "express";
import User from "../../models/user.js";
import Mosque from "../../models/mosque.js";
import bcrypt from "bcrypt";
import { Document } from "mongoose";
import jwt from "jsonwebtoken";
const router = express.Router()
interface result extends Partial<Document> {
  [key: string]: any;
  fullName: string;
  userName: string;
  profilePicture: string;
  email: string;
  userType: string;
  Gender: string;
  dateOfborn: string;
  password?: string;
  Token?: { token?: string }[];
}
router.post("/login-in", async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    const check = await User.findOne({ email: email });
    const checkMosque = await Mosque.findOne({ email: email });
    let cause,
      done = false;
    let Token = null
      const type: result = (check ?? checkMosque) as result;

    if (type) {
      const passwordCheck = await bcrypt.compare(password, type.password as string);
      if (passwordCheck) {
        done = true;
        Token = jwt.sign({ userId: type._id }, process.env.JWT_SECRET as string, {
          expiresIn: "7d",
        });
        type.Token?.push!({ token: Token });
        await type.save!();
      }
    } 
    else {
      cause = "login-props";
    }
    res.json({ done: done, cause: cause, token: Token });
  } catch (e) {
    return res.status(404).json({ done: false, cause: "login-props" });
  }
});
export default  router;
