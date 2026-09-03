import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
import User from "../../models/user.js";
import Mosque from "../../models/mosque.js";
import jwt from "jsonwebtoken";
import { getUserObject } from "../adkar_routes/adkar_setting.js";
interface adhan_response {
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
      Midnight: string;
    };
    date: {
      hijri: {
        date: string;
      };
    };
  };
}
router.get("/get_hidjri_date_algeria",async(req: Request, res: Response)=>{
try{
        const request4 = await fetch(
          `https://marw.gov.dz/rest/ubiko_rest/get_hijri_date?_format=json&time=${Date.now()}`,
        );
        res.status(200).json(await request4.json())
}
catch(error){
  res.status(500).json({error})
}
})
router.get("/prayer_time", async (req: Request, res: Response) => {
  try {
    ////get user data
    const { longitude, latitude } = req.query;

    let theDate = new Date(Date.now());
    let full_date =
      theDate.getDate() +
      "-" +
      (theDate.getMonth() + 1) +
      "-" +
      theDate.getFullYear();
    setInterval(() => {
      theDate = new Date(Date.now());
      full_date =
        theDate.getDate() +
        "-" +
        (theDate.getMonth() + 1) +
        "-" +
        theDate.getFullYear();
    }, 1000);

    const user = (
      await getUserObject(req.headers.authorization?.split(" ")[1], res)
    ).type;
    if (user) {
      const { school, tune, method } = user.prayer_data as { school:string, tune:string[], method:string }
      ///get loacation data
      const request2 = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.country_api_key}&lat=${latitude}&lon=${longitude}&format=json`,
      );
      const response2 = (await request2.json()) as {
        address: { country_code: string };
      };
      const { country_code } = response2.address;
      ///fetch prayer_time

      const request = await fetch(
        `https://api.aladhan.com/v1/timings/${full_date}?
        latitude=${latitude}&longitude=${longitude}&method=${method??'3'}&school=${school??''}
        &tune=${tune?tune.map((e)=>e === "NaN"?'0':e).join(","):`0,0,0,0,0,${country_code === "dz"?'3':'0'},0,0,0`}`,
      );
      const response = (await request.json()) as adhan_response;
      const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Midnight } =
        response.data.timings;
      let { date } = response.data.date.hijri;
      ////get hidjry data

      if (country_code === "dz") {
        const request4 = await fetch(
          `https://marw.gov.dz/rest/ubiko_rest/get_hijri_date?_format=json&time=${Date.now()}`,
        );
        const response4 = (await request4.json()) as {
          result: { formatted: string };
        };
        date = response4.result.formatted.split("الموافق")[0] as string;
      }
      ///respose
      res.status(200).json({
        prayers: [Fajr, Dhuhr, Asr, Maghrib, Isha],
        sunrise_midnight: [Sunrise, Midnight],
        hijrid_date: date,
      });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});
router.get("/get_props" ,async (req: Request, res: Response) => {
  try {
    const user = (
      await getUserObject(req.headers.authorization?.split(" ")[1], res)
    ).type;
    if (user) {
      res.json(user.prayer_data);
    }
  } catch (error) {
    res.status(500).send({ error });
  }
})
router.post("/add_props", async (req: Request, res: Response) => {
  try {
    const user = (
      await getUserObject(req.headers.authorization?.split(" ")[1], res)
    ).type;
    if (user) {
      const { method, school, tune ,is_12} = req.body;
      const all_Props = [method, school, tune,is_12];
      const props_name:string[] = ["method", "school", "tune","is_12"]   
      for (const [i, e] of all_Props.entries()) {
        if (e !== undefined && props_name[i]) {
          (user.prayer_data  as any)[props_name[i] as keyof typeof user.prayer_data] = e;
        }
      }
      await user.save();
      res.json(user.prayer_data);
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});
export default router;
