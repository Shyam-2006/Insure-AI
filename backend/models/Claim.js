import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  amount: { type: Number, required: true },
  description: String,
  document: { type: String }, // file path or URL
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Claim', claimSchema);
