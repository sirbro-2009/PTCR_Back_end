import express from "express";
import "dotenv/config";
import type { Request ,Response} from "express";
import User from "../../models/user.js";
import Mosque from "../../models/mosque.js";
import upload from "../../middleware/multer.js";
import bcrypt from "bcrypt";
import { Document } from 'mongoose'
const router = express.Router();
//////////////////get Data
export interface result extends Partial<Document>{
    [key: string]: any 
    fullName:string,
    userName:string,
    profilePicture:string,
    email:string,
    userType:string,
    Gender:string,
    SavedQuran?:{surah:Number,reader:Number}[],
    dateOfborn:string,
    password?:string
    Token?: { token?: string }[]
}
router.get("/get-infromations", async (req: Request, res:Response) => {
  try {
    let done = false;
    const token = req.headers.authorization?.split(" ")[1];

    const isUser = await User.findOne({ "Token.token": token });
    const isMosque = await Mosque.findOne({ "Token.token": token });
    const type:result = (isUser ?? isMosque) as result
    if (token && type) {

        done = true;
        const {
          fullName,
          userName,
          profilePicture,
          email,
          userType,
          Gender,
          dateOfborn,
        } = type;
        const  resule:result = {
          fullName,
          userName,
          profilePicture,
          email,
          userType,
          Gender,
          dateOfborn,
        };
      res.json({ ...resule, done: done });
      }
      else{
      res.status(404).json({done:done})
      }
    }
  catch (e) {
    res.status(500).json({ error: true });
  }
});
////////////////log out
router.delete("/sign-out", async (req: Request, res:Response) => {
  try {
    let done = false;
    const token = req.headers.authorization?.split(" ")[1];
    const isUser = await User.findOne({ "Token.token": token });
    const isMosque = await Mosque.findOne({ "Token.token": token });
    const type:result = (isUser ?? isMosque) as result
      done = true;
      const tokens_array = (type.Token?.filter((e) => e.token !== token)) as { token?: string }[]
  
      type.Token = tokens_array;
      type.markModified!("Token");
      await type.save!();      

    res.json({ done: done });
  } catch (e) {
    res.json({ error: true });
  }
});

/////////////////////////////UPdate
router.put(
  "/up_date",
  upload.single("profile_img"),
  async (req: Request, res:Response) => {
    try {
      let done = false;
      const token = req.headers.authorization?.split(" ")[1];
      const { editValue, EditType, lng } = req.body 
      const isUser = await User.findOne({ "Token.token": token });
      const isMosque = await Mosque.findOne({ "Token.token": token });
      const type:result = (isUser ?? isMosque) as result
      //user/////////////////////////////////////////////////////////////
      //everything exept email and password and profile picture
      if (type) {
        if (EditType !== "email" && EditType !== "password" && !req.file) {
          type[EditType] = editValue;
          await type.save!();
        }
        //////profile picture
        if (req.file) {
          const imageUrl = req.file.path;
          type.profilePicture = imageUrl;
          await type.save!();
        }
        //email
        if (EditType === "email") {
          type.email = editValue;
          await type.save!();
        }
        //password
        if (EditType === "password") {
          const { newPassword, currentPassword } = editValue;
          const passwordCheck = await bcrypt.compare(
            currentPassword,
            type.password!
          );
          if (passwordCheck) {
            type.password = await bcrypt.hash(newPassword, 10);
            await type.save!();
          }
        }
        done = true;
        const {
          fullName,
          userName,
          profilePicture,
          email,
          userType,
          Gender,
          dateOfborn,
        } = type;
        const result:result = {
          fullName,
          userName,
          profilePicture,
          email,
          userType,
          Gender,
          dateOfborn,
        };
      res.json({ done: done, ...result });
      }
    } catch {
      res.status(500).json({ error: true });
    }
  },
);
///DELETE ACCOUNT
router.delete("/delete", async (req: Request, res:Response) => {
  try {
    let done = false;
    const token = req.headers.authorization?.split(" ")[1];
    const isUser = await User.findOne({ "Token.token": token });
    const isMosque = await Mosque.findOne({ "Token.token": token });
    const type:result = (isUser ?? isMosque) as result
    if (type) {
      done = true;
      await type.deleteOne!();
    }
    res.json({ done: done });
  } catch {
    res.status(500).json({ error: true });
  }
});
export default router;
