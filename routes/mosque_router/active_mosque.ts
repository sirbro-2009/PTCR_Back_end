import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import Mosque from "../../models/mosque.js";
import crypto from "crypto";
interface reqest_data {
      Lat: number;
      Lon: number;
      MosqueName: string;
      Region:string;
      Country: string;
      City: string;
      MosqueId?:number
    }
router.get("/get_mosque_data",async (req: Request, res: Response) => {
    try{      
    const token = req.headers.authorization?.split(" ")[1];
    let mosuqe
    if(token){
     mosuqe = await Mosque.findOne({ "Token.token": token });
    }

    if (!mosuqe) return res.status(404).send({ error: "unvalid mosque token" });
    const {MosqueProps,prayer_data} = mosuqe
    res.status(200).json({...MosqueProps,...prayer_data})
    }
    catch(e){
        res.status(500).json({error:e})
    }
})
router.get("/get_mosque_data_by_id",async (req: Request, res: Response)=>{
    try{      
        const id = req.query.id

    if(typeof Number(id) !== 'number')return res.status(404).send({ error: " id" })
    const mosuqe = await Mosque.findOne({  "MosqueProps.MosqueId": Number(id)});
    if (!mosuqe) return res.status(404).send({ error: "unvalid mosque id" });
    const {MosqueProps,prayer_data} = mosuqe
    res.status(200).json({...MosqueProps,...prayer_data})
    }
    catch(e){
        res.status(500).json({error:e})
    }
})
router.get("/mosques_search",async (req: Request, res: Response)=>{
try{
const {name,Lan,Log} = req.query
const condetion1 = typeof name === 'string'
const condetion2 = typeof Lan === 'string'
const condetion3 = typeof Log === 'string'
if(condetion1 && !condetion2 && !condetion3){
  const mosques = await Mosque.find({
    "MosqueProps.MosqueName": { $regex: new RegExp(name, "i") }
  }).lean()
res.status(404).json(mosques)
}
else if(!condetion1 && condetion2 && condetion3){

}
}
catch(err){
res.status(500).json({err})
}
})
router.post("/set_active", async (req: Request, res: Response) => {
  try {
    const new_mosque_id = crypto.randomInt(100000, 999999);
    const { Lon, Lat, MosqueName, Country,Region, City } = req.body as reqest_data
    const token = req.headers.authorization?.split(" ")[1];
    const mosuqe = await Mosque.findOne({ "Token.token": token });
    if (mosuqe) {
      let  mosqueProps:reqest_data = {
        Lon,
        Lat,
        MosqueName,
        Country,
        City,
        Region
      };      
      mosuqe.MosqueProps = {...mosqueProps,MosqueId:mosuqe.MosqueProps?.MosqueId??new_mosque_id};
      await mosuqe.save()
      return res.status(200).json(mosuqe.MosqueProps)
    }
    else{
      res.status(404).send({ error: "unvalid mosque token",token,mosuqe })
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
export default router;
