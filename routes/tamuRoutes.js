import express from 'express';
import { getSemuaTamu, getTamuById, tambahTamu, updateTamu, hapusTamu } from '../controllers/tamuController.js';

const router = express.Router();

router.get('/', getSemuaTamu);
router.get('/:id', getTamuById);
router.post('/', tambahTamu);
router.put('/:id', updateTamu);
router.delete('/:id', hapusTamu);

export default router;
