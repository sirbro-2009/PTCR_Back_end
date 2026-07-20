import mongoose from 'mongoose'
const Schema  = mongoose.Schema 
const userSchema =  new Schema ({
  email:String,
  fullName:String,
  userName:String,
  password:String,
  userType:String,
  profilePicture:String,
  Token: [{ token: String }] ,
  Gender:String,
  dateOfborn:String,
  isVerified:Boolean,
  SavedQuran:[{surah:Number,reader:Number}],
  verifyCode:{
        Number:Number,
        exp:Number
      }
})
const User = mongoose.model("User",userSchema)
export default  User