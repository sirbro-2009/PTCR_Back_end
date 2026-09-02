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
    const mosuqe = await Mosque.findOne({ "Token.token": token });
    if(mosuqe){
    const {MosqueProps,prayer_data} = mosuqe
    res.status(200).json({...MosqueProps,...prayer_data})
    }
    else{
       res.status(404).send({ error: "unvalid mosque token" ,token,mosuqe});
    }
    }
    catch(e){
        res.status(500).json({error:e})
    }
})
router.post("/set_active", async (req: Request, res: Response) => {
  try {
    const new_mosque_id = crypto.randomInt(100000, 999999);
    const { Lon, Lat, MosqueName, Country,Region, City } = req.body as reqest_data
    const token = req.headers.authorization?.split(" ")[1];
    const mosuqe = await Mosque.findOne({ "Token.token": token });
    if (!mosuqe) return res.status(404).send({ error: "unvalid mosque token" });
    if (mosuqe) {
      let  mosqueProps:reqest_data = {
        Lon,
        Lat,
        MosqueName,
        Country,
        City,
        Region
      };
      if(typeof mosuqe.MosqueProps?.MosqueId !== 'number'){
        mosqueProps.MosqueId = new_mosque_id
      }
      mosuqe.MosqueProps = mosqueProps;
      await mosuqe.save()
      res.status(200).json(mosuqe.MosqueProps)
    }

  } catch (e) {
    res.status(500).json({ error: e });
  }
});
export default router;
