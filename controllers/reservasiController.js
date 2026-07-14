import Reservasi from '../models/Reservasi.js';
import Kamar from '../models/Kamar.js';

export const getSemuaReservasi = async (req, res) => {
    try {
        const reservasi = await Reservasi.aggregate([
            {
                $lookup: {
                    from: 'tamus',
                    localField: 'id_tamu',
                    foreignField: '_id',
                    as: 'tamu_info'
                }
            },
            {
                $lookup: {
                    from: 'kamars',
                    localField: 'id_kamar',
                    foreignField: '_id',
                    as: 'kamar_info'
                }
            },
            {
                $unwind: '$tamu_info'
            },
            {
                $unwind: '$kamar_info'
            },
            {
                $project: {
                    _id: 1,
                    nama_tamu: '$tamu_info.nama',
                    nomor_kamar: '$kamar_info.nomor',
                    tipe: '$kamar_info.tipe',
                    harga: '$kamar_info.harga',
                    tanggal_checkin: 1,
                    tanggal_checkout: 1,
                    status: 1
                }
            }
        ]);
        res.json(reservasi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getReservasiById = async (req, res) => {
    try {
        const reservasi = await Reservasi.findById(req.params.id);
        if (!reservasi) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
        res.json(reservasi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const tambahReservasi = async (req, res) => {
    try {
        const { id_kamar } = req.body;
        
        // Cek status kamar
        const kamar = await Kamar.findById(id_kamar);
        if (!kamar) return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        if (kamar.status === 'Terisi') return res.status(400).json({ message: 'Kamar sudah terisi' });

        const reservasi = new Reservasi(req.body);
        const newReservasi = await reservasi.save();

        // Update status kamar menjadi Terisi
        await Kamar.findByIdAndUpdate(id_kamar, { status: 'Terisi' });

        res.status(201).json(newReservasi);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateReservasi = async (req, res) => {
    try {
        const reservasi = await Reservasi.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservasi) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
        res.json(reservasi);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const hapusReservasi = async (req, res) => {
    try {
        const reservasi = await Reservasi.findById(req.params.id);
        if (!reservasi) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });

        const id_kamar = reservasi.id_kamar;
        
        await Reservasi.findByIdAndDelete(req.params.id);

        // Kembalikan status kamar menjadi Kosong
        await Kamar.findByIdAndUpdate(id_kamar, { status: 'Kosong' });

        res.json({ message: 'Reservasi berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
