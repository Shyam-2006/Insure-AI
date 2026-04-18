import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const userCount = await mongoose.model('User').countDocuments();
    const policyCount = await mongoose.model('Policy').countDocuments();
    const claimCount = await mongoose.model('Claim').countDocuments();
    res.json({ userCount, policyCount, claimCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/reports', async (req, res) => {
  try {
    // Example: claims by status
    const claimsByStatus = await mongoose.model('Claim').aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ claimsByStatus });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
