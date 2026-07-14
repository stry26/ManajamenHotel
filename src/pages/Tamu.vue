<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Manajemen Tamu</h2>
      <button class="btn btn-primary" @click="openModal('add')">
        <i class="fa-solid fa-plus me-1"></i> Tambah Tamu
      </button>
    </div>

    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <input type="text" v-model="search" class="form-control" placeholder="Cari nama atau telepon...">
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
                <th>Nama</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tamu, index) in filteredTamu" :key="tamu._id">
                <td>{{ index + 1 }}</td>
                <td class="fw-bold">{{ tamu.nama }}</td>
                <td>{{ tamu.telepon }}</td>
                <td>{{ tamu.alamat }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="openModal('edit', tamu)">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteTamu(tamu._id)">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTamu.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">Data tidak ditemukan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal fade" id="tamuModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Edit Tamu' : 'Tambah Tamu' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTamu">
              <div class="mb-3">
                <label class="form-label">Nama</label>
                <input type="text" class="form-control" v-model="form.nama" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Telepon</label>
                <input type="text" class="form-control" v-model="form.telepon" required pattern="\d+" title="Hanya angka diperbolehkan">
              </div>
              <div class="mb-3">
                <label class="form-label">Alamat</label>
                <textarea class="form-control" v-model="form.alamat" required rows="3"></textarea>
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
      tamuList: [],
      search: '',
      loading: false,
      modalInstance: null,
      isEdit: false,
      form: {
        _id: null,
        nama: '',
        telepon: '',
        alamat: ''
      }
    }
  },
  computed: {
    filteredTamu() {
      return this.tamuList.filter(t => {
        const searchLower = this.search.toLowerCase();
        return t.nama.toLowerCase().includes(searchLower) || t.telepon.includes(searchLower);
      });
    }
  },
  mounted() {
    this.fetchTamu();
    this.modalInstance = new bootstrap.Modal(document.getElementById('tamuModal'));
  },
  methods: {
    async fetchTamu() {
      this.loading = true;
      try {
        const res = await api.get('/tamu');
        this.tamuList = res.data;
      } catch (err) {
        this.$swal.fire('Error', 'Gagal memuat data tamu', 'error');
      } finally {
        this.loading = false;
      }
    },
    openModal(type, data = null) {
      if (type === 'add') {
        this.isEdit = false;
        this.form = { _id: null, nama: '', telepon: '', alamat: '' };
      } else {
        this.isEdit = true;
        this.form = { ...data };
      }
      this.modalInstance.show();
    },
    async saveTamu() {
      // Validate phone is only numbers
      if (!/^\d+$/.test(this.form.telepon)) {
        return this.$swal.fire('Peringatan', 'Nomor telepon hanya boleh berisi angka', 'warning');
      }

      try {
        if (this.isEdit) {
          await api.put(`/tamu/${this.form._id}`, this.form);
          this.$swal.fire('Sukses', 'Data tamu berhasil diubah', 'success');
        } else {
          await api.post('/tamu', this.form);
          this.$swal.fire('Sukses', 'Data tamu berhasil ditambahkan', 'success');
        }
        this.modalInstance.hide();
        this.fetchTamu();
      } catch (err) {
        this.$swal.fire('Error', err.response?.data?.message || 'Terjadi kesalahan', 'error');
      }
    },
    async deleteTamu(id) {
      const result = await this.$swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data tamu akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        try {
          await api.delete(`/tamu/${id}`);
          this.$swal.fire('Terhapus!', 'Data tamu berhasil dihapus.', 'success');
          this.fetchTamu();
        } catch (err) {
          this.$swal.fire('Error', 'Gagal menghapus tamu', 'error');
        }
      }
    }
  }
}
</script>
