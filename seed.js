import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Kamar from './models/Kamar.js';
import Tamu from './models/Tamu.js';
import Reservasi from './models/Reservasi.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Kamar.deleteMany();
        await Tamu.deleteMany();
        await Reservasi.deleteMany();

        // Insert 10 Kamar
        const kamarData = [];
        for (let i = 1; i <= 10; i++) {
            kamarData.push({
                nomor: `1${i.toString().padStart(2, '0')}`,
                tipe: i % 2 === 0 ? 'Deluxe' : 'Standard',
                harga: i % 2 === 0 ? 500000 : 300000,
                status: 'Kosong'
            });
        }
        const createdKamar = await Kamar.insertMany(kamarData);

        // Insert 5 Tamu
        const tamuData = [
            { nama: 'Budi Santoso', telepon: '081234567890', alamat: 'Jakarta' },
            { nama: 'Siti Aminah', telepon: '081298765432', alamat: 'Bandung' },
            { nama: 'Andi Wijaya', telepon: '085612345678', alamat: 'Surabaya' },
            { nama: 'Dewi Lestari', telepon: '087812349876', alamat: 'Yogyakarta' },
            { nama: 'Rudi Hartono', telepon: '089912345678', alamat: 'Semarang' }
        ];
        const createdTamu = await Tamu.insertMany(tamuData);

        // Insert 3 Reservasi
        const reservasiData = [
            {
                id_tamu: createdTamu[0]._id,
                id_kamar: createdKamar[0]._id,
                tanggal_checkin: new Date('2026-08-01'),
                tanggal_checkout: new Date('2026-08-03'),
                status: 'Check In'
            },
            {
                id_tamu: createdTamu[1]._id,
                id_kamar: createdKamar[1]._id,
                tanggal_checkin: new Date('2026-08-02'),
                tanggal_checkout: new Date('2026-08-05'),
                status: 'Check In'
            },
            {
                id_tamu: createdTamu[2]._id,
                id_kamar: createdKamar[2]._id,
                tanggal_checkin: new Date('2026-08-04'),
                tanggal_checkout: new Date('2026-08-06'),
                status: 'Check In'
            }
        ];
        
        await Reservasi.insertMany(reservasiData);

        // Update status kamar to Terisi
        await Kamar.findByIdAndUpdate(createdKamar[0]._id, { status: 'Terisi' });
        await Kamar.findByIdAndUpdate(createdKamar[1]._id, { status: 'Terisi' });
        await Kamar.findByIdAndUpdate(createdKamar[2]._id, { status: 'Terisi' });

        console.log('Data seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding data: ${error}`);
        process.exit(1);
    }
};

seedData();
