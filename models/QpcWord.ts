import mongoose from "mongoose";

const qpcWordSchema = new mongoose.Schema({
  surah: Number,
  ayah: Number,
  word: Number,
  location: String, 
  text: String,
});

qpcWordSchema.index({ surah: 1, ayah: 1 });

export default mongoose.model("QpcWord", qpcWordSchema);