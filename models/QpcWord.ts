import mongoose from "mongoose";

const qpcWordSchema = new mongoose.Schema({
  surah: { type: Number, required: true },
  ayah: { type: Number, required: true },
  word: { type: Number, required: true },
  location: { type: String, required: true, unique: true }, 
  text: { type: String, required: true },
});

qpcWordSchema.index({ surah: 1, ayah: 1 });

export default mongoose.model("QpcWord", qpcWordSchema);