import Kamar from '../models/Kamar.js';
import Tamu from '../models/Tamu.js';
import Reservasi from '../models/Reservasi.js';

export const getDashboardData = async (req, res) => {
    try {
        const totalKamar = await Kamar.countDocuments();
        const totalTamu = await Tamu.countDocuments();
        const totalReservasi = await Reservasi.countDocuments();
        const kamarKosong = await Kamar.countDocuments({ status: 'Kosong' });
        const kamarTerisi = await Kamar.countDocuments({ status: 'Terisi' });

        res.json({
            total_kamar: totalKamar,
            total_tamu: totalTamu,
            total_reservasi: totalReservasi,
            kamar_kosong: kamarKosong,
            kamar_terisi: kamarTerisi
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
