import mongoose from 'mongoose'
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
  MosqueProps: {
    City: String,
    Country: String,
    MosqueName: String,
    MosqueImg: String,
    Lat: Number,
    Lon: Number,
    MosqueIcama: {
      fadjr: String,
      dhohr: String,
      asr: String,
      maghreb: String,
      isha: String,
    },
  },
  SavedQuran:[{surah:Number,reader:Number}],
  isVerified:Boolean,
  verifyCode:{
        Number:Number,
        exp:Number
      } 
});
const mosque = mongoose.model("mosque", Mosque);
export default mosque;
