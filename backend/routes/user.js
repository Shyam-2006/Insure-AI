import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, admin, getUsers);
router.put('/:id', auth, admin, updateUser);
router.delete('/:id', auth, admin, deleteUser);

export default router;
