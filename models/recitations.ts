import mongoose from "mongoose";
const {Schema} = mongoose

const reciationsAndnarrative = new Schema({
  narrative: String,
  rewaya: {
    en: String,
    ar: String
  },
  reciters: [{
    id: Number,
    reciter: {
      en: String,
      ar: String,
      dsc:{
        ar:String,
        en:String
      }
    }
  }]
})

const RAN = mongoose.model("RAN",reciationsAndnarrative)
export default RAN