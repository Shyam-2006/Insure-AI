import express from 'express';
import { getPolicies, createPolicy, updatePolicy, deletePolicy } from '../controllers/policyController.js';
import upload from '../middleware/upload.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPolicies);
// File upload for policy document
router.post('/upload', auth, admin, upload.single('document'), (req, res) => {
	if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
	res.json({ filePath: `/uploads/${req.file.filename}` });
});
router.post('/', auth, admin, createPolicy);
router.put('/:id', auth, admin, updatePolicy);
router.delete('/:id', auth, admin, deletePolicy);

export default router;
