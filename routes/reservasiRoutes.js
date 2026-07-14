import express from 'express';
import { getSemuaReservasi, getReservasiById, tambahReservasi, updateReservasi, hapusReservasi } from '../controllers/reservasiController.js';

const router = express.Router();

router.get('/', getSemuaReservasi);
router.get('/:id', getReservasiById);
router.post('/', tambahReservasi);
router.put('/:id', updateReservasi);
router.delete('/:id', hapusReservasi);

export default router;
