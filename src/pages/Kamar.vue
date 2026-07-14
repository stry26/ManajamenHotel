<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Manajemen Kamar</h2>
      <button class="btn btn-primary" @click="openModal('add')">
        <i class="fa-solid fa-plus me-1"></i> Tambah Kamar
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input type="text" v-model="search" class="form-control" placeholder="Cari nomor kamar...">
          </div>
          <div class="col-md-4">
            <select v-model="filterStatus" class="form-select">
              <option value="">Semua Status</option>
              <option value="Kosong">Kosong</option>
              <option value="Terisi">Terisi</option>
            </select>
          </div>
        </div>

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
                <th>Nomor Kamar</th>
                <th>Tipe</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(kamar, index) in filteredKamar" :key="kamar._id">
                <td>{{ index + 1 }}</td>
                <td class="fw-bold">{{ kamar.nomor }}</td>
                <td>{{ kamar.tipe }}</td>
                <td>Rp {{ kamar.harga.toLocaleString() }}</td>
                <td>
                  <span :class="['badge', kamar.status === 'Kosong' ? 'bg-success' : 'bg-danger']">
                    {{ kamar.status }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="openModal('edit', kamar)">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteKamar(kamar._id)">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="filteredKamar.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">Data tidak ditemukan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="kamarModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Kamar' : 'Tambah Kamar' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveKamar">
              <div class="mb-3">
                <label class="form-label">Nomor Kamar</label>
                <input type="text" class="form-control" v-model="form.nomor" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Tipe</label>
                <select class="form-select" v-model="form.tipe" required>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Harga</label>
                <input type="number" class="form-control" v-model="form.harga" required min="1">
              </div>
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select class="form-select" v-model="form.status" required>
                  <option value="Kosong">Kosong</option>
                  <option value="Terisi">Terisi</option>
                </select>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
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
      kamarList: [],
      search: '',
      filterStatus: '',
      loading: false,
      modalInstance: null,
      isEdit: false,
      form: {
        _id: null,
        nomor: '',
        tipe: 'Standard',
        harga: 0,
        status: 'Kosong'
      }
    }
  },
  computed: {
    filteredKamar() {
      return this.kamarList.filter(k => {
        const matchSearch = k.nomor.toLowerCase().includes(this.search.toLowerCase());
        const matchStatus = this.filterStatus === '' || k.status === this.filterStatus;
        return matchSearch && matchStatus;
      });
    }
  },
  mounted() {
    this.fetchKamar();
    this.modalInstance = new bootstrap.Modal(document.getElementById('kamarModal'));
  },
  methods: {
    async fetchKamar() {
      this.loading = true;
      try {
        const res = await api.get('/kamar');
        this.kamarList = res.data;
      } catch (err) {
        this.$swal.fire('Error', 'Gagal memuat data kamar', 'error');
      } finally {
        this.loading = false;
      }
    },
    openModal(type, data = null) {
      if (type === 'add') {
        this.isEdit = false;
        this.form = { _id: null, nomor: '', tipe: 'Standard', harga: '', status: 'Kosong' };
      } else {
        this.isEdit = true;
        this.form = { ...data };
      }
      this.modalInstance.show();
    },
    async saveKamar() {
      if (this.form.harga <= 0) {
        return this.$swal.fire('Peringatan', 'Harga harus lebih dari nol', 'warning');
      }

      try {
        if (this.isEdit) {
          await api.put(`/kamar/${this.form._id}`, this.form);
          this.$swal.fire('Sukses', 'Data kamar berhasil diubah', 'success');
        } else {
          await api.post('/kamar', this.form);
          this.$swal.fire('Sukses', 'Data kamar berhasil ditambahkan', 'success');
        }
        this.modalInstance.hide();
        this.fetchKamar();
      } catch (err) {
        this.$swal.fire('Error', err.response?.data?.message || 'Terjadi kesalahan', 'error');
      }
    },
    async deleteKamar(id) {
      const result = await this.$swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data kamar akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        try {
          await api.delete(`/kamar/${id}`);
          this.$swal.fire('Terhapus!', 'Data kamar berhasil dihapus.', 'success');
          this.fetchKamar();
        } catch (err) {
          this.$swal.fire('Error', 'Gagal menghapus kamar', 'error');
        }
      }
    }
  }
}
</script>
