import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
/*Users */
import user_props from "./routes/users_routes/g_u_d_-user-prop.js";
import analystics from "./routes/users_routes/get-db-state.js";
import login_in_fp from "./routes/users_routes/login-in-forgetPassword.js";
import loginRoute from "./routes/users_routes/login-in.js";
import signUpRoute from "./routes/users_routes/sign_ip.js";
/*Quran*/
import quranRections from "./routes/quran_routes/quran_recitations.js";
import quranReading from "./routes/quran_routes/quran_reading.js";
import tafsir from "./routes/quran_routes/quran_tafsir.js";
const app = express();
app.use(express.json());
app.use(cors());
const connectString: string = process.env.CONNECTION_STRING as string;
///DATA BASE CONNECTION
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose
    .connect(connectString)
    .then(() => {
      console.log("CONNECTED !");
      isConnected = true;
    })
    .catch((e) => {
      console.log("SOMETHING WRONGE !", e);
    });
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    console.error("DB CONNECTION FAILED:", e);
    res.status(500).json({ error: "Database connection failed" });
  }
});
app.get("/", (req, res) => {
  try {
    res.send("hello");
  } catch {
    res.status(505).send("hello");
  }
});
/*LOGIN CHECK */
app.use("/auth", loginRoute);
/*SIGN UP CHECK */
app.use("/auth", signUpRoute);
/*FORGET PASSWORD */
app.use("/auth", login_in_fp);
/**analystics */
app.use("/", analystics);
/*USER RLO */
app.use("/user", user_props);
/*Quran route */
app.use("/quran", quranRections);
app.use("/quran", quranReading);
app.use("/quran", tafsir);
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default app;
