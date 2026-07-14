import express from 'express';
import { getSemuaKamar, getKamarById, tambahKamar, updateKamar, hapusKamar } from '../controllers/kamarController.js';

const router = express.Router();

router.get('/', getSemuaKamar);
router.get('/:id', getKamarById);
router.post('/', tambahKamar);
router.put('/:id', updateKamar);
router.delete('/:id', hapusKamar);

export default router;
