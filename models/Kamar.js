import mongoose from 'mongoose';

const kamarSchema = new mongoose.Schema({
    nomor: { type: String, required: true, unique: true },
    tipe: { type: String, required: true },
    harga: { type: Number, required: true },
    status: { type: String, required: true, enum: ['Kosong', 'Terisi'], default: 'Kosong' }
}, { timestamps: true });

export default mongoose.model('Kamar', kamarSchema);
