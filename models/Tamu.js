import mongoose from 'mongoose';

const tamuSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    telepon: { type: String, required: true },
    alamat: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Tamu', tamuSchema);
