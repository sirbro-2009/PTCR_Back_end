import Quran from "../../models/quran.js";
import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import { Document } from "mongoose";
interface Ires extends Partial<Document> {
  name?: {
    ar: string;
    en: string;
  };
  number?: number;
  revelation_place?: {
    ar: string;
    en: string;
  };
  verses_count?: number;
  verses?: {
    number: number;
    text: { ar: string; en: string };
    juz: number;
    page: number;
    sajda: boolean;
  }[];
}
router.get("/quran_reading", async (req: Request, res: Response) => {
  try {
    const { surahIndex,aya } = req.query;
    const editedIndex = Number(surahIndex as string);
    if (editedIndex && editedIndex >= 0 && editedIndex <= 114) {
      const response = await Quran.findOne({ number: editedIndex }).lean();
      if (response) {
        
        const { name, number, revelation_place, verses_count, verses } =
          response as unknown as Ires;
          let versesArray = verses
          if(typeof aya === "string" && aya !== "undefined" && Number(aya)>0 && Number(aya)<=verses_count! ){
          versesArray = verses!.filter((e,i)=>{
            return i === (Number(aya as string)-1)
          }) 
          }
          res.json({ name, number, revelation_place, verses_count,verses: versesArray })
      }
    } else {
      res.status(404).json({ error: false });
    }
  } catch {
    res.status(505).json({ error: true });
  }
});
export default router;
