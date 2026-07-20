import mongoose from "mongoose";
const Schema = mongoose.Schema;
const QuranSchema = new Schema({
  number: Number,
  name: { ar: String, en: String, transliteration: String },
  revelation_place: { ar: String, en: String },
  verses_count: Number,
  words__count: Number,
  letters__count: Number,
  verses: [
    { number: Number, text: {ar:String,en:String}, juz: Number, page: Number, sajda: Boolean },
  ],
  audio:[
    {
      id: Number,
      reciter:{ar:String,en:String,dsc:{
        ar:String,
        en:String
      }},
      rewaya:{ar:String,en:String},
      server:String,
      link: String
    },
  ]
});
const Quran = mongoose.model("quran", QuranSchema);
export default Quran;
