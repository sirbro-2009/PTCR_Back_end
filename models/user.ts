import mongoose from 'mongoose'
const Schema  = mongoose.Schema 
const userSchema = new Schema({
  email: String,
  fullName: String,
  userName: String,
  password: String,
  userType: String,
  profilePicture: String,
  Token: [{ token: String }],
  Gender: String,
  dateOfborn: String,
  isVerified: Boolean,
  SavedQuran: [{ surah: Number, reader: Number }],
  notification: {
    isActivated: Boolean,
    alaramArray: [{ time: String, id: Number }],
    subscription: {
      userId: String,
      endpoint: String,
      expirationTime:Number,
      lang: String,
      keys:{
      p256dh: String,
      auth: String,        
      },
      timezone:String
    },
  },
  verifyCode: {
    Number: Number,
    exp: Number,
  },
});
const User = mongoose.model("User",userSchema)
export default  User