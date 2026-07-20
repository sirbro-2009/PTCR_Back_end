import express from "express";
import "dotenv/config";
import type { Request, Response } from "express";
import User from "../../models/user.ts";
import Mosque from "../../models/mosque.ts";
import bcrypt from "bcrypt";
import { Document } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendVerificationEmail from "../../mail.ts";
const router = express.Router();
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
router.post(
  "/login/verfiy/create-code",
  async (req: Request, res: Response) => {
    try {
      const verfyNumber = {
        Number: crypto.randomInt(100000, 999999),
        exp: new Date(Date.now() + 15 * 60 * 1000).getTime(),
      };
      let done = false;
      const token = req.headers.authorization?.split(" ")[1];

      const { email, lng } = req.body;
      let findUser = await User.findOne({ email: email });
      let findUserMosque = await Mosque.findOne({ email: email });
      if (email) {
        findUser = await User.findOne({ email: email });
        findUserMosque = await Mosque.findOne({ email: email });
      }
      if (!email) {
        findUser = await User.findOne({ "Token.token": token });
        findUserMosque = await Mosque.findOne({ "Token.token": token });
      }
      const type: result = (findUser ?? findUserMosque) as result;
      if (type) {
        type.verifyCode = verfyNumber;
        await sendVerificationEmail(
          type.email!,
          verfyNumber.Number.toString()!,
          lng!,
        );
        await type.save!();
        done = true;
      }
      res.json({ done: done });
    } catch (e) {
      res.json({ done: false });
    }
  },
);
router.post("/login/verify", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { email, code } = req.body;
    let done = false;
    let cause: boolean | null | string = false;
    let findUser = await User.findOne({ email: email });
    let findUserMosque = await Mosque.findOne({ email: email });
    if (email) {
      findUser = await User.findOne({ email: email });
      findUserMosque = await Mosque.findOne({ email: email });
    }
    if (!email) {
      findUser = await User.findOne({ "Token.token": token });
      findUserMosque = await Mosque.findOne({ "Token.token": token });
    }
    const type:result = (findUser ?? findUserMosque) as result

    /////////////////////user
    if (type) {
      const checkExp = new Date().getTime() - type.verifyCode?.exp!;
      if (checkExp <= 0) {
        const isThecode = type.verifyCode?.Number === code;
        if (isThecode) {
          type.verifyCode = {};
          type.isVerified = true;
          done = true;
          cause = null;
          await type.save!();
        } else if (!isThecode) {
          cause = "The code is wronge";
        }
      } else if (checkExp > 0) {
        cause = "The code has expired";
        type.verifyCode = {};
        await type.save!();
      }
    }
     else {
      cause = "The code has expired";
    }
    res.json({
      done: done,
      cause: cause,
    });
  } catch {
    res.status(500).json({
      done: false,
      cause: "Something wronge try again",
    });
  }
});
router.post(
  "/login/verify/new-password",
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      let token,
        done = false;
      let cause:boolean|null = false
      const findUser = await User.findOne({ email: email });
      const findUserMosque = await Mosque.findOne({ email: email })
      const type:result = (findUser ?? findUserMosque) as result
      if (type) {
        const theToken = await jwt.sign(
          { userId: type._id },
          process.env.JWT_SECRET as string,
          { expiresIn: "30d" },
        );
        type.Token = [{ token: theToken }];
        token = theToken;
        type.password = await bcrypt.hash(password, 10);
        done = true;
        cause = null;
        await type.save!();
      }
      res.json({
        token: token,
        done: done,
        cause: cause,
      });
    } catch {
      res.json({
        done: false,
        cause: "Something wronge try again",
      });
    }
  },
);
export default router;
