import Quran from "../../models/quran";
import RAN from "../../models/recitations";
import User from "../../models/user.ts";
import Mosque from "../../models/mosque.ts";
import type { result } from "../users_routes/g_u_d_-user-prop.ts";
import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import { Document } from "mongoose";

interface nnr extends Partial<Document> {
  number?: number;
  name?: { ar: string; en: string; transliteration: string };
  revelation_place?: { ar: string; en: string };
}
interface audio {
  id: number;
  reciter: { ar: string; en: string };
  rewaya: { ar: string; en: string };
  server: string;
  link: string;
}
interface respone extends nnr {
  audio?:
    | [
        {
          id: number;
          reciter: { ar: string; en: string };
          rewaya: { ar: string; en: string };
          server: string;
          link: string;
        },
      ]
    | any;
  recitaiton?: {
    ar: string;
    en: string;
    dsc?: {
      ar: string;
      en: string;
    };
  };
}
/**reciations And narrative */
router.get("/reciations_And_narrative", async (req: Request, res: Response) => {
  try {
    const { narrative } = req.query;
    if (narrative) {
      const editedNarrative = (string: string) => {
        return string.replaceAll(" ", "_");
      };
      const response = await RAN.findOne({
        narrative: editedNarrative(narrative as string),
      }).lean();
      if (!response) {
        res.status(404).json({ error: true });
      } else {
        res.send(response);
      }
    } else {
      res.status(404).json({ error: true });
    }
  } catch {
    res.status(505).json({ error: true });
  }
});
/*quran_rections */
interface request {
  sourah?: string;
  reaction?: string;
  array?: string| undefined;
}
router.get("/quran_rections", async (req: Request, res: Response) => {
  try {
    const { sourah, reaction, array } = req.query as unknown as request;
    if (!array) {
      const index: number = Number(sourah);
      const recitaiton: number = Number(reaction) - 1;
      if (index > 0 && recitaiton >= 0) {
        const surah = await Quran.findOne({ number: index });
        const { number, name, revelation_place, audio } = surah as respone;
        const recitaitonIndex = audio![recitaiton];
        const response: respone = {
          number,
          name,
          revelation_place,
          audio: recitaitonIndex,
        };
        res.json(response);
      } else {
        res.status(404).json({ error: true });
      }
    } else {
async function sendData() {
try{
  const toParse = array !=="undefined"?array:'[]'
  const parsedArray = JSON.parse(toParse as string);
  if (!parsedArray) return [];
  const response = await Promise.all(
    parsedArray.map(async (e: { reader: number; surah: number }) => {
      const surah = await Quran.findOne({ number: e.surah });
      const { number, name, revelation_place, audio } = surah as respone;
      
      const recitaitonIndex = audio![e.reader - 1]; 

      const object: respone = {
        number,
        name,
        revelation_place,
        audio: recitaitonIndex,
      };

      return object;
    })
  );
  return response; 
}
catch{
  res.status(404).json({error:true})
}
}
async function main() {
  const data = await sendData();
  res.json( data);
}

main();
    }
  } catch (e) {
    console.log(e)
    res.status(505).json({ error: true });
  }
});
/**add audio to User account */
router.post("/add_audio", async (req: Request, res: Response) => {
  try {
    let done = false;
    let cause = "";
    const { surah, reader } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const isUser = await User.findOne({ "Token.token": token });
    const isMosque = await Mosque.findOne({ "Token.token": token });
    const type: result = (isUser ?? isMosque) as result;
    if (type) {
      const allAudios = type.SavedQuran?.find((e) => {
        return e.surah === surah && e.reader === reader;
      });
      if (!allAudios) {
        type.SavedQuran?.push({ surah, reader });
        await type.save!();
        done = true;
        res.json(type.SavedQuran);
      } else {
        cause = "all_ready_exixt";
        res.status(404).json({ done, cause });
      }
    }
  } catch {
    res.status(505).json({ error: true });
  }
});
interface sendedData {
  surah: number;
  reader: number;
}
router.delete("/delete_audio", async (req: Request, res: Response) => {
  try {
    let done = false;
    let cause = "";
    const { surah, reader } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const isUser = await User.findOne({ "Token.token": token });
    const isMosque = await Mosque.findOne({ "Token.token": token });
    const type: result = (isUser ?? isMosque) as result;
    if (type) {
      const allAudios = type.SavedQuran;
      const theCheck = allAudios?.find(
        (e) => e.surah === surah && e.reader === reader,
      );
      if (theCheck) {
        allAudios?.splice(allAudios.indexOf(theCheck),1);
        type.SavedQuran = allAudios;
        await type.save!();
        done = true;
        res.json(allAudios);
      } else {
        res.status(404).json({ done, cause });
      }
    }
  } catch {
    res.status(505).json({ error: true });
  }
});
router.get("/get_saved", async (req: Request, res: Response) => {
  try {
    let done = false;
    const token = req.headers.authorization?.split(" ")[1];
    const isUser = await User.findOne({ "Token.token": token });
    const isMosque = await Mosque.findOne({ "Token.token": token });
    const type: result = (isUser ?? isMosque) as result;
    if (type) {
      res.json(type.SavedQuran);
    } else {
      res.status(404).json({ done, cause: "no_data" });
    }
  } catch {
    res.status(505).json({ error: true });
  }
});
export default router;
