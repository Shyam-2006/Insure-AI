import Claim from '../models/Claim.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/email.js';

export const getClaims = async (req, res) => {
  try {
    const claims = await Claim.find().populate('user policy');
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createClaim = async (req, res) => {
  try {
    const { user, policy, amount, description, document } = req.body;
    const claim = new Claim({ user, policy, amount, description, document });
    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const oldClaim = await Claim.findById(id).populate('user');
    const claim = await Claim.findByIdAndUpdate(id, update, { new: true }).populate('user');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    
    if (update.status && oldClaim && oldClaim.status !== update.status) {
      if (claim.user) {
        await Notification.create({
          user: claim.user._id,
          message: `Your claim ${claim._id} has been ${update.status}.`
        });
        await sendEmail(
          claim.user.email, 
          `Claim Status: ${update.status}`,
          `Hello ${claim.user.name},\nYour insurance claim has been updated to ${update.status}.`
        );
      }
    }

    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
