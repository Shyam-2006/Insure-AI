import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  premium: { type: Number, required: true },
  coverage: { type: Number, required: true },
  document: { type: String }, // file path or URL
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Policy', policySchema);
