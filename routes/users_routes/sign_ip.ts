import Checker from "../../Date/Date";
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
router.post("/sign-up", async (req:Request,res:Response) => {
  try {
    const verfyNumber = {
      Number:crypto.randomInt(100000, 999999),
      exp:new Date(Date.now()+15*60*1000).getTime()
    }
    const { email, dateOfborn, userType, password ,lng} = req.body;
    let cause,
      done = false;
    if (userType === "normal") {
      const check = await User.find({ email: email});
      if (!check.length && Checker(dateOfborn)) {
        const newUser = new User({ ...req.body });
        newUser.password = await bcrypt.hash(password, 10);
        newUser.verifyCode = verfyNumber
        await sendVerificationEmail(email,verfyNumber.Number.toString(),lng)
        await newUser.save();
        done = true;
      } else {
        if (check.length) {
          cause = "Email-prop";
        } else if (!Checker(dateOfborn)) {
          cause = "Age-prop";
        }
      }

    } 
    ////////////////////////////////Mosque
    else if (userType === "mosque") {
      const checkMosque = await Mosque.find({ email: email });
      if (!checkMosque.length && Checker(dateOfborn)) {
        const newMosque = new Mosque({ ...req.body });
        newMosque.password = await bcrypt.hash(password, 10);
        newMosque.verifyCode = verfyNumber
        await sendVerificationEmail(email,verfyNumber.Number.toString(),lng)
        await newMosque.save();
        done = true;            
      } else {
        if (checkMosque.length) {
          cause = "Email-prop";
        } else if (!Checker(dateOfborn)) {
          cause = "Age-prop";
        }
      }
    } else {
      cause = false;
    }
    res.json({ done: done, cause: cause });
  } catch (e) {
    return res.json({ done: false });
  }
});
router.post("/sign-up/verify",async(req:Request,res:Response)=>{
try{
  const {email,code} = req.body
  let token,done = false
  let cause
  const findUser =await User.findOne({email:email})
  const findUserMosque =await Mosque.findOne({email:email})
    const type: result = (findUser ?? findUserMosque) as result;
/////////////////////user
  if(type){
  const checkExp = new Date().getTime()-type.verifyCode?.exp!
  if(checkExp<=0){
    const isThecode = type.verifyCode?.Number === code
    if(isThecode){
        const theToken =await  jwt.sign(
          { userId: type._id },
          process.env.JWT_SECRET as string,
          { expiresIn: "30d" },
        );
        type.Token!.push({ token: theToken });
        token = theToken
        type.verifyCode = {}
        type.isVerified = true
        done = true
        cause = null
        await type.save!()
    }
    else if(!isThecode){
      cause = "The code is wronge"      
    }
  }
  else if(checkExp > 0){
      cause = "The code has expired"
      type.verifyCode = {}
      await User.findOneAndDelete({email:email})
  }
  }
  else{
  cause = "The code has expired"
  }
  res.json({
    token:token,
    done:done,
    cause:cause
  })
}
catch{
  res.json({
    done:false,
    cause:"Something wronge try again"
  })
}
})
export default router;
