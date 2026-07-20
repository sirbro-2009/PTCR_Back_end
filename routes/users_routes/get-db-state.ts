import express from "express";
import "dotenv/config";
import type { Request, Response } from "express";
import User from "../../models/user.js";
import Mosque from "../../models/mosque.js";
import Visit from "../../models/visitors.js";
const router = express.Router();
router.get("/visit", async (req: Request, res: Response) => {
  const check = await Visit.findOne({
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  if (!check) {
    const newUser = new Visit({
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    await newUser.save();
    res.json({ ok: true });
  }
});
//////////////////////////////////////////////////////
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    const visiotrs = await Visit.countDocuments();
    const mosques = await Mosque.countDocuments();
    const users = await User.countDocuments();
    res.json({ mosques, users, visiotrs });
  } catch (e) {
    res.json({ error: true });
  }
});
export default router;
