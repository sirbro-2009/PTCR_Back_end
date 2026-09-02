import mongoose from "mongoose";
const Schema = mongoose.Schema;
const Mosque = new Schema({
  email: String,
  fullName: String,
  userName: String,
  password: String,
  userType: String,
  profilePicture: String,
  Token: [{ token: String }],
  Gender: String,
  dateOfborn: String,
  notification: {
    isActivated: Boolean,
    alaramArray: [{ time: String, id: Number }],
    subscription: {
      userId: String,
      endpoint: String,
      expirationTime: Number,
      lang: String,
      keys: {
        p256dh: String,
        auth: String,
      },
      timezone: String,
    },
  },
  MosqueProps: {
    City: String,
    Country: String,
    MosqueName: String,
    MosqueImg: String,
    Lat: Number,
    Lon: Number,
    Region:String,
    MosuqeId:Number,
    MosqueIcama: {
      Fajr: String,
      Dhuhr: String,
      asr: String,
      Maghrib: String,
      Isha: String,
    },
  },
  SavedQuran: [{ surah: Number, reader: Number }],
  prayer_data: {
    method: String,
    tune: [String],
    school: String,
    is_12: Boolean,
  },
  isVerified: Boolean,
  verifyCode: {
    Number: Number,
    exp: Number,
  },
});
const mosque = mongoose.model("mosque", Mosque);
export default mosque;
