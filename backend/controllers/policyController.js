import Policy from '../models/Policy.js';

export const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPolicy = async (req, res) => {
  try {
    const { name, description, premium, coverage, document } = req.body;
    const policy = new Policy({ name, description, premium, coverage, document });
    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const policy = await Policy.findByIdAndUpdate(id, update, { new: true });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByIdAndDelete(id);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json({ message: 'Policy deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
