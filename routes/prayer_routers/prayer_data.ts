import express from "express";
const router = express.Router();
import type { Request, Response } from "express";
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
    date:{
      hijri:{
        date:string
      }
    }
  };
}
router.get("/prayer_time", async (req: Request, res: Response) => {
  try {
    ////get user data
    const { longitude, latitude } = req.query;
    let theDate = new Date(Date.now());
    let full_date =
      theDate.getDate() + "-" + (theDate.getMonth() + 1) + "-" + theDate.getFullYear();
    setInterval(() => {
      theDate = new Date(Date.now());
      full_date =
        theDate.getDate() + "-" + (theDate.getMonth() + 1) + "-" + theDate.getFullYear();
    }, 1000);
    ///fetch prayer_time
    const request = await fetch(
      `https://api.aladhan.com/v1/timings/${full_date}?latitude=${latitude}&longitude=${longitude}&method=3&school=0&tune=0,0,0,0,0,3,0,0,0`,
    );
    const response = (await request.json()) as adhan_response;
    const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Midnight } =
      response.data.timings;
    let {date} = response.data.date.hijri
    ////get hidjry data
    const request2 = await fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=${process.env.country_api_key}&lat=${latitude}&lon=${longitude}&format=json`,
    );
    const response2 = (await request2.json()) as {
      address: { country_code: string };
    };
    const { country_code } = response2.address;
    if(country_code === 'dz'){
      const request4 = await fetch(`https://marw.gov.dz/rest/ubiko_rest/get_hijri_date?_format=json&time=${Date.now()}`)
      const response4 = await request4.json() as {result:{formatted:string}}
      date = response4.result.formatted.split("الموافق")[0] as string
    }
    ///respose
    res.status(200).json({
      prayers:[
        Fajr, Dhuhr, Asr, Maghrib, Isha
      ],
      sunrise_midnight:[
        Sunrise,Midnight
      ],
      hijrid_date:date
    })
  } catch (error) {
    res.status(500).send({ error });
  }
});
export default router;
