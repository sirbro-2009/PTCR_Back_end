import express  from "express";
import cors from "cors"
import mongoose from 'mongoose'
import "dotenv/config"
/*Users */
import  user_props from "./routes/users_routes/g_u_d_-user-prop"
import  analystics from "./routes/users_routes/get-db-state"
import  login_in_fp from "./routes/users_routes/login-in-forgetPassword"
import  loginRoute from "./routes/users_routes/login-in"
import  signUpRoute from "./routes/users_routes/sign_ip"
/*Quran*/
import quranRections from './routes/quran_routes/quran_recitations'
import quranReading from './routes/quran_routes/quran_reading'
const app =express()
const port = 3000
app.use(express.json())
app.use(cors());
const connectString:string  = process.env.CONNECTION_STRING as string
///DATA BASE CONNECTION 
mongoose
  .connect(connectString)
  .then(() => {
    console.log("CONNECTED !");
  })
  .catch((e) => {
    console.log("SOMETHING WRONGE !",e)
  })
/*LOGIN CHECK */
app.use("/auth", loginRoute);
/*SIGN UP CHECK */
app.use("/auth", signUpRoute);
/*FORGET PASSWORD */
app.use("/auth", login_in_fp);
/**analystics */
app.use("/",analystics)
/*USER RLO */
app.use("/user",user_props)
/*Quran route */
//quranRections
app.use("/quran",quranRections)
app.use("/quran",quranReading)
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
