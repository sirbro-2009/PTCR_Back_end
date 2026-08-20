import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import User from "../../models/user.js";
import Mosque from "../../models/mosque.js";
import jwt from 'jsonwebtoken';

///
async function getUserObject(token:string|undefined,res:Response){
    
    if(!token)res.status(404).json({error:"user not found"})
    const isUser = await User.findOne({ "Token.token": token });
    const isMosque = await Mosque.findOne({ "Token.token": token });
    const type = (isUser ?? isMosque)
    return {type}
}
////adkar_data
router.get("/get-adkar-data",async(req:Request,res:Response)=>{
    const type = (await getUserObject(req.headers.authorization?.split(" ")[1],res)).type
    try{
        res.json(type?.notification)
    }
    catch{
        res.status(500).json({error:"some thing wrong in the server"})
    }
})
///put active value
router.put("/set-active",async(req:Request,res:Response)=>{
    const token = req.headers.authorization?.split(" ")[1]
    const type = (await getUserObject(token,res)).type

    if (!type ) return res.status(404).json({error:"user not found"});
    try{
        const {active,subscription} = req.body //as {active:boolean,subscription?:any}
        if (!type.notification || typeof token !== 'string') return null
        
        type.notification.isActivated = active;
        //type.notification.subscription =  subscription
        const decodedUser = jwt.decode(token);
        const userId = typeof decodedUser === "string"
            ? decodedUser
            : decodedUser && typeof decodedUser === "object"
                ? String((decodedUser as { _id?: string; id?: string; userId?: string })._id ?? (decodedUser as { _id?: string; id?: string; userId?: string }).id ?? (decodedUser as { _id?: string; id?: string; userId?: string }).userId ?? "")
                : "";
        if (!userId || Object.keys(subscription).length === 0) return res.status(404).json({error:"user not found"});
        if (type.notification.subscription) type.notification.subscription = {...subscription,userId};
        await type.save()
        res.json(type.notification);
    }
    catch{
        res.status(500).json({error:"some thing wrong in the server"})
    }     
})
///post new alarm 
router.post("/add-alarm",async(req:Request,res:Response)=>{
    const type = (await getUserObject(req.headers.authorization?.split(" ")[1],res)).type
    const {id,time} = req.body as {id:number,time:string}
    
    try{
    type?.notification?.alaramArray.push({id,time})    
        await type?.save()
        res.json(type?.notification);
    }
    catch{
        res.status(500).json({error:"some thing wrong in the server"})
    }
})
//put alarm
router.put("/put-alarm", async (req: Request, res: Response) => {
    try {
        const type = (await getUserObject(req.headers.authorization?.split(" ")[1], res)).type;

        if (!type || !type.notification) {
            return res.status(404).json({ error: "user not found" });
        }

        const { id, time } = req.body as { id: number; time: string };
        const editedArray = type.notification.alaramArray.map((e) => {
            return e.id === id ? { id, time } : e;
        });

        type.notification.alaramArray = editedArray;
        await type.save();
        return res.json(type.notification);
    } catch {
        return res.status(500).json({ error: "some thing wrong in the server" });
    }
})
//delete alarm
router.delete("/delete-alarm",async(req:Request,res:Response)=>{
try{
        const type = (await getUserObject(req.headers.authorization?.split(" ")[1], res)).type;
        if (!type || !type.notification) {
            return res.status(404).json({ error: "user not found" });
        }

        const { id } = req.body as { id: number };
        const editedArray = type.notification.alaramArray.filter((e) => {
            return e.id !== id
        });

        type.notification.alaramArray = editedArray;
        await type.save();
        return res.json(type.notification);
}
catch{
        return res.status(500).json({ error: "some thing wrong in the server" });
}
})
export default router;