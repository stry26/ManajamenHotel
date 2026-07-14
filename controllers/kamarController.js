import Kamar from '../models/Kamar.js';

export const getSemuaKamar = async (req, res) => {
    try {
        const kamar = await Kamar.find();
        res.json(kamar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getKamarById = async (req, res) => {
    try {
        const kamar = await Kamar.findById(req.params.id);
        if (!kamar) return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        res.json(kamar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const tambahKamar = async (req, res) => {
    try {
        const kamar = new Kamar(req.body);
        const newKamar = await kamar.save();
        res.status(201).json(newKamar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateKamar = async (req, res) => {
    try {
        const kamar = await Kamar.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!kamar) return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        res.json(kamar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const hapusKamar = async (req, res) => {
    try {
        const kamar = await Kamar.findByIdAndDelete(req.params.id);
        if (!kamar) return res.status(404).json({ message: 'Kamar tidak ditemukan' });
        res.json({ message: 'Kamar berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
