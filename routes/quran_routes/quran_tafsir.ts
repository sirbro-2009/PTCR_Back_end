import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
interface TafsirResponse {
  tafseer_id: number;
  tafseer_name: string;
  ayah_url: string;
  ayah_number: number;
  text: string;
  detail?:string|undefined
}
router.get('/tafsir',async(req:Request,res:Response)=>{
const {aya,surahIndex,id} = req.query as {aya:string,surahIndex:string,id:string}
try{
    const sendRequest = await fetch(
      `http://api.quran-tafseer.com/tafseer/${id}/${surahIndex}/${aya}`,
    );
    const response =  await sendRequest.json() as TafsirResponse
    if("detail" in response){
    return res.status(404).json({error:true})
    }
    return res.json(response)
}
catch{
res.status(505).json({error:true})
}
})
export default router