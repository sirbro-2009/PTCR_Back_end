import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import Mosque from "../../models/mosque.js";
interface IcamaObject {
      Fajr: string,
      Dhuhr: string,
      asr: string,
      Maghrib: string,
      Isha: string,
    }
router.post("/edit_icama_durations", async (req: Request, res: Response) =>{
try{
    const token = req.headers.authorization?.split(" ")[1];
    const icama_object:IcamaObject  = req.body
    let mosuqe;
    if (token) {
      mosuqe = await Mosque.findOne({ "Token.token": token });
    }
    if (!mosuqe || !icama_object) return res.status(404).send({ error: "unvalid data" });
    if(icama_object && mosuqe.MosqueProps){
    mosuqe.MosqueProps.MosqueIcama = icama_object
    await mosuqe.save()
    res.status(200).json(mosuqe.MosqueProps)
    }

}
catch(err){
    res.status(500).json({err})
}
})

export default router