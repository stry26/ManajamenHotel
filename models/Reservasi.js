import mongoose from 'mongoose';

const reservasiSchema = new mongoose.Schema({
    id_tamu: { type: mongoose.Schema.Types.ObjectId, ref: 'Tamu', required: true },
    id_kamar: { type: mongoose.Schema.Types.ObjectId, ref: 'Kamar', required: true },
    tanggal_checkin: { type: Date, required: true },
    tanggal_checkout: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Check In', 'Check Out'], default: 'Check In' }
}, { timestamps: true });

export default mongoose.model('Reservasi', reservasiSchema);
