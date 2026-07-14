<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Manajemen Reservasi</h2>
      <button class="btn btn-primary" @click="openModal('add')">
        <i class="fa-solid fa-plus me-1"></i> Buat Reservasi
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>No</th>
                <th>Tamu</th>
                <th>Kamar</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(res, index) in reservasiList" :key="res._id">
                <td>{{ index + 1 }}</td>
                <td class="fw-bold">{{ res.nama_tamu }}</td>
                <td>{{ res.nomor_kamar }} ({{ res.tipe }})</td>
                <td>{{ formatDate(res.tanggal_checkin) }}</td>
                <td>{{ formatDate(res.tanggal_checkout) }}</td>
                <td>Rp {{ calculateTotal(res.harga, res.tanggal_checkin, res.tanggal_checkout).toLocaleString() }}</td>
                <td>
                  <span :class="['badge', res.status === 'Check In' ? 'bg-success' : 'bg-secondary']">
                    {{ res.status }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-danger" @click="deleteReservasi(res._id)">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="reservasiList.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">Belum ada data reservasi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="reservasiModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Buat Reservasi Baru</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveReservasi">
              <div class="mb-3">
                <label class="form-label">Tamu</label>
                <select class="form-select" v-model="form.id_tamu" required>
                  <option value="" disabled>Pilih Tamu</option>
                  <option v-for="tamu in tamuList" :key="tamu._id" :value="tamu._id">
                    {{ tamu.nama }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Kamar Kosong</label>
                <select class="form-select" v-model="form.id_kamar" required>
                  <option value="" disabled>Pilih Kamar</option>
                  <option v-for="kamar in kamarKosongList" :key="kamar._id" :value="kamar._id">
                    {{ kamar.nomor }} - {{ kamar.tipe }} (Rp {{ kamar.harga.toLocaleString() }})
                  </option>
                </select>
                <small v-if="kamarKosongList.length === 0" class="text-danger">Tidak ada kamar kosong saat ini.</small>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Tanggal Check In</label>
                  <input type="date" class="form-control" v-model="form.tanggal_checkin" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Tanggal Check Out</label>
                  <input type="date" class="form-control" v-model="form.tanggal_checkout" required>
                </div>
              </div>
              <div class="text-end mt-2">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-primary" :disabled="kamarKosongList.length === 0">Simpan Reservasi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      reservasiList: [],
      tamuList: [],
      kamarKosongList: [],
      loading: false,
      modalInstance: null,
      form: {
        id_tamu: '',
        id_kamar: '',
        tanggal_checkin: '',
        tanggal_checkout: '',
        status: 'Check In'
      }
    }
  },
  mounted() {
    this.fetchData();
    this.modalInstance = new bootstrap.Modal(document.getElementById('reservasiModal'));
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const [resReservasi, resTamu, resKamar] = await Promise.all([
          api.get('/reservasi'),
          api.get('/tamu'),
          api.get('/kamar')
        ]);
        this.reservasiList = resReservasi.data;
        this.tamuList = resTamu.data;
        this.kamarKosongList = resKamar.data.filter(k => k.status === 'Kosong');
      } catch (err) {
        this.$swal.fire('Error', 'Gagal memuat data', 'error');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    },
    calculateTotal(harga, checkin, checkout) {
      const start = new Date(checkin);
      const end = new Date(checkout);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return (diffDays > 0 ? diffDays : 1) * harga;
    },
    openModal() {
      this.form = { id_tamu: '', id_kamar: '', tanggal_checkin: '', tanggal_checkout: '', status: 'Check In' };
      this.modalInstance.show();
    },
    async saveReservasi() {
      const checkin = new Date(this.form.tanggal_checkin);
      const checkout = new Date(this.form.tanggal_checkout);
      
      if (checkout <= checkin) {
        return this.$swal.fire('Peringatan', 'Tanggal checkout harus lebih besar dari tanggal checkin', 'warning');
      }

      try {
        await api.post('/reservasi', this.form);
        this.$swal.fire('Sukses', 'Reservasi berhasil dibuat', 'success');
        this.modalInstance.hide();
        this.fetchData();
      } catch (err) {
        this.$swal.fire('Error', err.response?.data?.message || 'Terjadi kesalahan', 'error');
      }
    },
    async deleteReservasi(id) {
      const result = await this.$swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Reservasi ini akan dihapus dan status kamar akan kembali Kosong!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        try {
          await api.delete(`/reservasi/${id}`);
          this.$swal.fire('Terhapus!', 'Reservasi berhasil dihapus.', 'success');
          this.fetchData();
        } catch (err) {
          this.$swal.fire('Error', 'Gagal menghapus reservasi', 'error');
        }
      }
    }
  }
}
</script>
