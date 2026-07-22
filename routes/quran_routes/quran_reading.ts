import Quran from "../../models/quran.js";
import QpcWord from "../../models/QpcWord.js";
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
  tadjwid?: any;
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
    const { surahIndex, aya } = req.query;
    const editedIndex = Number(surahIndex as string);
    if (editedIndex && editedIndex >= 0 && editedIndex <= 114) {
      const response = await Quran.findOne({ number: editedIndex }).lean();
      if (response) {
        const { name, number, revelation_place, verses_count, verses } =
          response as unknown as Ires;
        let versesArray = verses;

        if (
          typeof aya === "string" &&
          aya !== "undefined" &&
          Number(aya) > 0 &&
          Number(aya) <= verses_count!
        ) {
          versesArray = verses!.filter((e, i) => {
            return i === Number(aya as string) - 1;
          });
        }
        const tadjwid = versesArray
          ? await Promise.all(
              versesArray.map(async (e) => {
                const tajwidArray = await QpcWord.find({
                  surah: number?.toString(),
                  ayah: e.number.toString(),
                }).lean(); 
                return tajwidArray.map((e,i)=>{return e.text}).join("");
              }),
            )
          : [];

        res.json({
          name,
          number,
          revelation_place,
          verses_count,
          verses: versesArray,
          tadjwid,
        });
      }
    } else {
      res.status(404).json({ error: true });
    }
  } catch (e) {
    console.log(e);
    res.status(505).json({ error: true });
  }
});
export default router;
