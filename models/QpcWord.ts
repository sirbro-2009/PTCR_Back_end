import mongoose from "mongoose";

const qpcWordSchema = new mongoose.Schema({
  surah: String,
  ayah: String,
  word: String,
  location: String, 
  text: String,
  id:Number,
});

qpcWordSchema.index({ surah: 1, ayah: 1 });

export default mongoose.model("QpcWord", qpcWordSchema);