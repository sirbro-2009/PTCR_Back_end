import mongoose from 'mongoose'
const Schema = mongoose.Schema

const visitSchema = new Schema({
  path: String,
  date: { type: Date, default: Date.now },
  ip:String,
  userAgent:String
})
const Visit =  mongoose.model("Visit", visitSchema)
export default Visit