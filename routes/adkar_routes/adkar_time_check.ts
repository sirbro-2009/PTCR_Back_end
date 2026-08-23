import User from "../../models/user.js";
import Mosque from "../../models/mosque.js";
import webpush from "../../config/webpush.js";
import type { Request, Response } from "express";
import express from "express";

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}
const adhkarKeys: string[] = [
  "morning_adhkar",
  "evening_adhkar",
  "Waking_Up_Adhkar",
  "Dua_for_Wearing_Clothes",
  "Dua_for_Wearing_New_Clothes",
  "Dua_for_One_Who_Wears_New_Clothes",
  "What_to_Say_When_Taking_Off_Clothes",
  "Dua_for_Entering_the_Toilet",
  "Dua_for_Leaving_the_Toilet",
  "Dhikr_Before_Ablution",
  "Dhikr_After_Ablution",
  "Dhikr_When_Leaving_the_House",
  "Dhikr_When_Entering_the_House",
  "Dua_for_Going_to_the_Mosque",
  "Dua_for_Entering_the_Mosque",
  "Dua_for_Leaving_the_Mosque",
  "Adhkar_of_the_Adhan",
  "Opening_Dua_of_Prayer_(Istiftah)",
  "Dua_of_Ruku",
  "Dua_of_Rising_from_Ruku",
  "Dua_of_Sujood",
  "Dua_Between_the_Two_Prostrations",
  "Dua_of_Sujood_al-Tilawah",
  "Tashahhud",
  "Sending_Blessings_on_the_Prophet_After_Tashahhud",
  "Dua_After_the_Final_Tashahhud_Before_Salam",
  "Adhkar_After_the_Salam_(Post-Prayer_Dhikr)",
  "Dua_of_Istikhara_Prayer",
  "Sleep_Adhkar",
  "Dua_When_Turning_Over_at_Night",
  "Dua_for_Anxiety_and_Fear_During_Sleep",
  "What_to_Do_Upon_Seeing_a_Dream_or_Nightmare",
  "Dua_of_Qunoot_in_Witr",
  "Dhikr_After_the_Salam_of_Witr",
  "Dua_for_Anxiety_and_Sadness",
  "Dua_for_Distress",
  "Dua_When_Meeting_the_Enemy_or_a_Ruler",
  "Dua_for_One_Who_Fears_the_Injustice_of_a_Ruler",
  "Dua_Against_the_Enemy",
  "What_to_Say_When_Fearing_a_People",
  "Dua_for_One_Afflicted_with_Doubt_in_Faith",
  "Dua_for_Settling_Debt",
  "Dua_for_Whispers_(Waswasa)_in_Prayer_and_Recitation",
  "Dua_When_Something_Becomes_Difficult",
  "What_to_Do_After_Committing_a_Sin",
  "How_to_Repel_Satan_and_His_Whispers",
  "Dua_When_Something_Undesired_Happens",
  "Congratulating_the_Parent_of_a_Newborn_and_Its_Reply",
  "Ruqyah_to_Protect_Children",
  "Dua_for_a_Sick_Person_During_a_Visit",
  "Dua_for_a_Dying_Patient_Who_Has_Lost_Hope",
  "Talqeen_for_One_on_the_Verge_of_Death",
  "Dua_for_One_Afflicted_with_a_Calamity",
  "Dua_When_Closing_the_Eyes_of_the_Deceased",
  "Dua_for_the_Deceased_in_the_Funeral_Prayer",
  "Dua_for_a_Deceased_Child_(al-Fart)_in_the_Funeral_Prayer",
  "Dua_of_Condolence",
  "Dua_When_Placing_the_Deceased_into_the_Grave",
  "Dua_After_Burying_the_Deceased",
  "Dua_for_Visiting_Graves",
  "Dua_for_the_Wind",
  "Dua_for_Thunder",
  "Duas_for_Seeking_Rain_(Istisqa)",
  "Dua_When_It_Rains",
  "Dhikr_After_the_Rain",
  "Duas_for_Clear_Skies",
  "Dua_Upon_Seeing_the_New_Crescent_Moon",
  "Dua_When_Breaking_the_Fast",
  "Dua_Before_Eating",
  "Dua_After_Finishing_Eating",
  "Guest's_Dua_for_the_Host",
  "Dua_for_One_Who_Gives_You_Drink",
  "Dua_When_Breaking_Fast_at_Someone's_Home",
  "Dua_of_a_Fasting_Person_Invited_to_a_Meal",
  "What_a_Fasting_Person_Says_If_Insulted",
  "Dua_Upon_Seeing_the_First_Fruits",
  "Dua_for_Sneezing",
  "What_to_Say_to_a_Non-Muslim_Who_Sneezes_and_Praises_Allah",
  "Dua_for_a_Newly_Married_Person",
  "Groom's_Dua_for_Himself_/_Dua_When_Buying_an_Animal",
  "Dua_Before_Marital_Intimacy",
  "Dua_for_Anger",
  "Dua_Upon_Seeing_Someone_Afflicted",
  "What_to_Repeat_in_a_Gathering",
  "Expiation_of_the_Gathering_(Kaffarat_al-Majlis)",
  "Reply_to_Someone_Who_Says_'May_Allah_Forgive_You'",
  "Dua_for_One_Who_Does_You_a_Favor",
  "What_Protects_from_the_Dajjal",
  "Reply_to_Someone_Who_Says_'I_Love_You_for_Allah's_Sake'",
  "Reply_to_Someone_Who_Offers_You_Their_Wealth",
  "Dua_for_One_Who_Lent_You_Money,_When_Repaying",
  "Dua_for_Fear_of_Shirk",
  "Reply_to_Someone_Who_Says_'May_Allah_Bless_You'",
  "Dua_for_Disliking_Bad_Omens",
  "Dua_for_Riding_a_Mount_/_Vehicle",
  "Travel_Dua",
  "Dua_for_Entering_a_Town_or_Village",
  "Dua_for_Entering_the_Marketplace",
  "Dua_If_One's_Mount_Stumbles",
  "Traveler's_Dua_for_the_One_Staying_Behind",
  "Dua_of_the_One_Staying_Behind_for_the_Traveler",
  "Takbeer_and_Tasbeeh_While_Traveling",
  "Traveler's_Dua_Before_Dawn",
  "Dua_When_Stopping_at_a_Place,_While_Traveling_or_Otherwise",
  "Dhikr_Upon_Returning_from_Travel",
  "What_to_Say_Upon_Good_or_Bad_News",
  "How_to_Reply_to_a_Non-Muslim's_Greeting",
  "Dua_Upon_Hearing_a_Rooster_Crow_or_a_Donkey_Bray",
  "Dua_Upon_Hearing_Dogs_Bark_at_Night",
  "Dua_for_One_You_Have_Cursed_by_Mistake",
  "What_to_Say_When_Praising_a_Fellow_Muslim",
  "What_to_Say_When_You_Are_Praised/Complimented",
  "The_Talbiyah_for_One_in_the_State_of_Ihram",
  "Takbeer_Upon_Reaching_the_Black_Stone",
  "Dua_Between_the_Yemeni_Corner_and_the_Black_Stone",
  "Dua_While_Standing_on_Safa_and_Marwah",
  "Dua_on_the_Day_of_Arafah",
  "Dhikr_at_al-Mash'ar_al-Haram",
  "Takbeer_With_Each_Pebble_When_Stoning_the_Jamarat",
  "What_to_Say_When_Amazed_or_Pleased",
  "What_to_Do_When_Something_Pleasing_Happens",
  "What_to_Say_When_Feeling_Pain_in_the_Body",
  "Dua_Against_the_Evil_Eye",
  "What_to_Say_When_Startled",
  "What_to_Say_When_Slaughtering",
  "What_to_Say_to_Repel_the_Schemes_of_Rebellious_Devils",
];
export async function sendPushToUser(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: PushPayload,
): Promise<{ success: boolean; statusCode?: number }> {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (err: any) {
    console.error("Push send failed:", err);
    return { success: false, statusCode: err?.statusCode };
  }
}

function NotificationCheck(timeZone: string, time: string) {
  const cureentTimeZoneTime = Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  return time === cureentTimeZoneTime;
}
export async function notification_cron(Model: typeof User | typeof Mosque) {
  const users = await (Model as any).find({ "notification.isActivated": true });

  for (const e of users) {
    if (!e.notification?.alaramArray) continue;

    for (const ele of e.notification.alaramArray) {
      const timezone = e.notification?.subscription?.timezone;
      const subscription = e.notification?.subscription;

      if (
        timezone &&
        subscription?.endpoint &&
        subscription.keys?.p256dh &&
        subscription.keys.auth &&
        typeof ele.time === "string" &&
        NotificationCheck(timezone, ele.time)
      ) {
        const result = await sendPushToUser(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth,
            },
          },
          {
            title: "حان وقت الأذكار",
            body:
              "اضغط لعرض أذكار اليوم" +
              (ele.id == null ? "" : (adhkarKeys[ele.id] ?? "")),
            url: "/dashboard",
          },
        );

        if (
          !result.success &&
          (result.statusCode === 410 || result.statusCode === 404)
        ) {
          e.notification.isActivated = false;
          await e.save();
        }
      }
    }
  }
}
const router = express.Router();
router.get("/cron/notifications", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.cron_code}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    await notification_cron(User);
    await notification_cron(Mosque);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Cron job failed:", err);
    res.status(500).json({ error: "cron failed" });
  }
});

export default router;
