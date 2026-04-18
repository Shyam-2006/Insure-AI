import express from 'express';
import { getClaims, createClaim, updateClaim } from '../controllers/claimController.js';
import upload from '../middleware/upload.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, admin, getClaims);
// File upload for claim document
router.post('/upload', auth, upload.single('document'), (req, res) => {
	if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
	res.json({ filePath: `/uploads/${req.file.filename}` });
});
router.post('/', auth, createClaim);
router.put('/:id', auth, admin, updateClaim);

export default router;
