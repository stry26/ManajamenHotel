import Tamu from '../models/Tamu.js';

export const getSemuaTamu = async (req, res) => {
    try {
        const tamu = await Tamu.find();
        res.json(tamu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTamuById = async (req, res) => {
    try {
        const tamu = await Tamu.findById(req.params.id);
        if (!tamu) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
        res.json(tamu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const tambahTamu = async (req, res) => {
    try {
        const tamu = new Tamu(req.body);
        const newTamu = await tamu.save();
        res.status(201).json(newTamu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTamu = async (req, res) => {
    try {
        const tamu = await Tamu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tamu) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
        res.json(tamu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const hapusTamu = async (req, res) => {
    try {
        const tamu = await Tamu.findByIdAndDelete(req.params.id);
        if (!tamu) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
        res.json({ message: 'Tamu berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
