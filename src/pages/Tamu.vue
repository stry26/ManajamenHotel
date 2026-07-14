<template>
  <div class="tamu-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Manajemen Tamu</h1>
        <p class="page-subtitle">Kelola data seluruh tamu hotel</p>
      </div>
      <button class="btn-primary-modern" @click="openModal('add')" id="btn-tambah-tamu">
        <i class="fa-solid fa-user-plus"></i> Tambah Tamu
      </button>
    </div>

    <!-- Stats Row -->
    <div class="tamu-stats-row">
      <div class="mini-stat">
        <div class="mini-stat-icon purple"><i class="fa-solid fa-users"></i></div>
        <div><p class="mini-stat-label">Total Tamu</p><p class="mini-stat-value">{{ tamuList.length }}</p></div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-icon emerald"><i class="fa-solid fa-magnifying-glass"></i></div>
        <div><p class="mini-stat-label">Hasil Pencarian</p><p class="mini-stat-value">{{ filteredTamu.length }}</p></div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-icon sky"><i class="fa-solid fa-id-card"></i></div>
        <div><p class="mini-stat-label">Tamu Terdaftar</p><p class="mini-stat-value">{{ tamuList.length }}</p></div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card-modern">
      <div class="filter-bar">
        <div class="search-wrapper" style="flex:1; max-width:380px;">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" v-model="search" class="form-control-modern" placeholder="Cari nama atau nomor telepon..." id="tamu-search" />
        </div>
        <div class="filter-result-count">
          <i class="fa-solid fa-filter" style="font-size:.7rem;"></i>
          {{ filteredTamu.length }} dari {{ tamuList.length }} tamu
        </div>
      </div>

      <div v-if="loading" class="spinner-modern">
        <div class="spinner-ring"></div>
        <span>Memuat data tamu...</span>
      </div>

      <div v-else class="table-wrapper">
        <table class="table-modern" v-if="filteredTamu.length > 0">
          <thead>
            <tr>
              <th style="width:48px">#</th>
              <th>Tamu</th>
              <th>Nomor Telepon</th>
              <th>Alamat</th>
              <th style="text-align:right; padding-right:20px">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tamu, index) in filteredTamu" :key="tamu._id">
              <td class="num-col">{{ index + 1 }}</td>
              <td>
                <div class="tamu-cell">
                  <div class="tamu-avatar">{{ tamu.nama.charAt(0).toUpperCase() }}</div>
                  <div>
                    <p class="tamu-name">{{ tamu.nama }}</p>
                    <p class="tamu-id">ID: {{ tamu._id.slice(-6).toUpperCase() }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="phone-cell">
                  <i class="fa-solid fa-phone phone-icon"></i>
                  <span>{{ tamu.telepon }}</span>
                </div>
              </td>
              <td>
                <div class="address-cell">
                  <i class="fa-solid fa-location-dot address-icon"></i>
                  <span class="address-text">{{ tamu.alamat }}</span>
                </div>
              </td>
              <td>
                <div class="action-group">
                  <button class="btn-warning-modern" @click="openModal('edit', tamu)" :id="'btn-edit-tamu-' + index">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <button class="btn-danger-modern" @click="deleteTamu(tamu._id)" :id="'btn-hapus-tamu-' + index">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-users-slash"></i></div>
          <p>Tidak ada tamu ditemukan</p>
          <button class="btn-primary-modern" @click="search = ''" style="margin-top:12px; font-size:.82rem;" v-if="search">
            <i class="fa-solid fa-rotate-left"></i> Reset Pencarian
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div class="modal-title-icon" :class="isEdit ? 'icon-warning' : 'icon-emerald'">
              <i :class="isEdit ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
            </div>
            <h5 class="modal-title">{{ isEdit ? 'Edit Data Tamu' : 'Tambah Tamu Baru' }}</h5>
          </div>
          <button class="modal-close-btn" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body-custom">
          <form @submit.prevent="saveTamu" id="form-tamu">
            <transition name="slide-down">
              <div class="form-avatar-preview" v-if="form.nama">
                <div class="preview-avatar">{{ form.nama.charAt(0).toUpperCase() }}</div>
                <div>
                  <p class="preview-name">{{ form.nama }}</p>
                  <p class="preview-sub">{{ isEdit ? 'Memperbarui data tamu' : 'Tamu Baru' }}</p>
                </div>
              </div>
            </transition>
            <div class="form-group">
              <label class="form-label-modern"><i class="fa-solid fa-user label-icon"></i> Nama Lengkap</label>
              <input type="text" class="form-control-modern" v-model="form.nama" placeholder="Masukkan nama lengkap tamu" required id="input-nama-tamu" ref="firstInput" />
            </div>
            <div class="form-group">
              <label class="form-label-modern"><i class="fa-solid fa-phone label-icon"></i> Nomor Telepon</label>
              <input type="text" class="form-control-modern" v-model="form.telepon" placeholder="cth: 08123456789" required id="input-telepon-tamu" />
            </div>
            <div class="form-group">
              <label class="form-label-modern"><i class="fa-solid fa-location-dot label-icon"></i> Alamat</label>
              <textarea class="form-control-modern" v-model="form.alamat" placeholder="Masukkan alamat lengkap" required rows="3" id="input-alamat-tamu" style="resize:none;"></textarea>
            </div>
            <div class="modal-footer-actions">
              <button type="button" class="btn-ghost" @click="closeModal" id="btn-batal-tamu">
                <i class="fa-solid fa-xmark"></i> Batal
              </button>
              <button type="submit" class="btn-primary-modern" :disabled="saving" id="btn-simpan-tamu">
                <i class="fa-solid" :class="saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'"></i>
                {{ saving ? 'Menyimpan...' : (isEdit ? 'Perbarui Data' : 'Simpan Tamu') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Tamu',
  data() {
    return {
      tamuList: [],
      search: '',
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      editId: null,
      form: { nama: '', telepon: '', alamat: '' }
    }
  },
  computed: {
    filteredTamu() {
      const q = this.search.toLowerCase()
      return this.tamuList.filter(t => t.nama.toLowerCase().includes(q) || t.telepon.includes(q))
    }
  },
  mounted() { this.fetchTamu() },
  methods: {
    async fetchTamu() {
      this.loading = true
      try {
        const res = await api.get('/tamu')
        this.tamuList = res.data
      } catch (e) {
        this.$swal.fire({ title: 'Error', text: 'Gagal memuat data tamu dari server', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
      } finally {
        this.loading = false
      }
    },
    openModal(type, data = null) {
      if (type === 'add') {
        this.isEdit = false
        this.editId = null
        this.form = { nama: '', telepon: '', alamat: '' }
      } else {
        this.isEdit = true
        this.editId = data._id
        this.form = { nama: data.nama, telepon: data.telepon, alamat: data.alamat }
      }
      this.showModal = true
      this.$nextTick(() => this.$refs.firstInput?.focus())
    },
    closeModal() { this.showModal = false },
    async saveTamu() {
      if (!/^\d+$/.test(this.form.telepon)) {
        this.$swal.fire({ title: 'Peringatan', text: 'Nomor telepon hanya boleh berisi angka', icon: 'warning', background: '#161d2e', color: '#f1f5f9' })
        return
      }
      this.saving = true
      try {
        if (this.isEdit) {
          await api.put(`/tamu/${this.editId}`, this.form)
          this.$swal.fire({ title: 'Berhasil!', text: 'Data tamu berhasil diubah', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
        } else {
          await api.post('/tamu', this.form)
          this.$swal.fire({ title: 'Berhasil!', text: 'Tamu baru berhasil ditambahkan', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
        }
        this.closeModal()
        this.fetchTamu()
      } catch (e) {
        this.$swal.fire({ title: 'Error', text: e.response?.data?.message || 'Terjadi kesalahan', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
      } finally {
        this.saving = false
      }
    },
    async deleteTamu(id) {
      const result = await this.$swal.fire({
        title: 'Hapus Tamu?', text: 'Data tamu ini akan dihapus secara permanen.',
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#f43f5e', cancelButtonColor: '#374151',
        confirmButtonText: 'Ya, Hapus!', cancelButtonText: 'Batal',
        background: '#161d2e', color: '#f1f5f9'
      })
      if (result.isConfirmed) {
        try {
          await api.delete(`/tamu/${id}`)
          this.$swal.fire({ title: 'Terhapus!', text: 'Data tamu berhasil dihapus.', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1500, showConfirmButton: false })
          this.fetchTamu()
        } catch (e) {
          this.$swal.fire({ title: 'Error', text: e.response?.data?.message || 'Gagal menghapus tamu', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
        }
      }
    }
  }
}
</script>

<style scoped>
.tamu-page { animation: fadeUp 0.4s ease both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.tamu-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 20px; }
.mini-stat { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px 20px; display: flex; align-items: center; gap: 14px; transition: var(--transition); }
.mini-stat:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
.mini-stat-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.mini-stat-icon.purple { background: rgba(139,92,246,.15); color: var(--accent-primary); }
.mini-stat-icon.emerald{ background: rgba(16,185,129,.15);  color: var(--emerald); }
.mini-stat-icon.sky    { background: rgba(14,165,233,.15);  color: var(--sky); }
.mini-stat-label { font-size: .72rem; font-weight: 600; color: var(--text-muted); margin: 0 0 4px; text-transform: uppercase; letter-spacing: .06em; }
.mini-stat-value { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -.03em; line-height: 1; }

.filter-bar { display: flex; align-items: center; gap: 12px; padding: 20px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; }
.search-wrapper { position: relative; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: .82rem; }
.search-wrapper .form-control-modern { padding-left: 36px; }
.filter-result-count { margin-left: auto; font-size: .78rem; color: var(--text-muted); font-weight: 500; display: flex; align-items: center; gap: 6px; }

.table-wrapper { overflow-x: auto; }
.num-col { color: var(--text-muted); font-size: .82rem; }
.tamu-cell { display: flex; align-items: center; gap: 12px; }
.tamu-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), #6d28d9); display: flex; align-items: center; justify-content: center; font-size: .95rem; font-weight: 700; color: white; flex-shrink: 0; }
.tamu-name { font-size: .875rem; font-weight: 600; color: var(--text-primary); margin: 0 0 2px; }
.tamu-id   { font-size: .7rem; color: var(--text-muted); margin: 0; font-family: monospace; }
.phone-cell { display: flex; align-items: center; gap: 8px; font-size: .875rem; color: var(--text-primary); }
.phone-icon { color: var(--emerald); font-size: .8rem; }
.address-cell { display: flex; align-items: flex-start; gap: 8px; font-size: .875rem; color: var(--text-secondary); }
.address-icon { color: var(--rose); font-size: .8rem; margin-top: 2px; flex-shrink: 0; }
.address-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
.action-group { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px 20px; gap: 12px; }
.empty-state-icon { width: 64px; height: 64px; background: rgba(139,92,246,.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--accent-primary); }
.empty-state p { color: var(--text-muted); font-size: .9rem; margin: 0; }

.modal-overlay { position: fixed; inset: 0; z-index: 1050; background: rgba(0,0,0,.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayIn .2s ease; }
@keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
.modal-box { background: var(--bg-card); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius-xl); box-shadow: 0 25px 80px rgba(0,0,0,.6); width: 100%; max-width: 480px; animation: modalIn .25s cubic-bezier(.34,1.56,.64,1); overflow: hidden; }
@keyframes modalIn { from { opacity:0; transform:scale(.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
.modal-title-wrap { display: flex; align-items: center; gap: 12px; }
.modal-title-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: .95rem; }
.icon-emerald { background: rgba(16,185,129,.15); color: var(--emerald); }
.icon-warning { background: rgba(245,158,11,.15); color: var(--gold); }
.modal-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.modal-close-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,.04); border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .85rem; transition: var(--transition); }
.modal-close-btn:hover { background: rgba(244,63,94,.1); border-color: rgba(244,63,94,.2); color: var(--rose); }
.modal-body-custom { padding: 24px; }

.label-icon { margin-right: 4px; color: var(--accent-primary); font-size: .75rem; }
.form-avatar-preview { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: rgba(139,92,246,.06); border: 1px solid rgba(139,92,246,.15); border-radius: var(--radius-md); margin-bottom: 20px; }
.preview-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), #6d28d9); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; color: white; flex-shrink: 0; }
.preview-name { font-size: .9rem; font-weight: 700; color: var(--text-primary); margin: 0 0 2px; }
.preview-sub  { font-size: .72rem; color: var(--text-muted); margin: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all .25s ease; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { opacity:0; max-height:0; margin-bottom:0; }
.slide-down-enter-to, .slide-down-leave-from { max-height:100px; }

.form-group { margin-bottom: 18px; }
.modal-footer-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); }

@media (max-width: 768px) { .tamu-stats-row { grid-template-columns: repeat(2,1fr); } .address-text { max-width: 130px; } }
@media (max-width: 480px) { .tamu-stats-row { grid-template-columns: 1fr; } .filter-bar { flex-direction: column; align-items: stretch; } .filter-result-count { margin-left: 0; } .action-group { flex-direction: column; gap: 6px; } }
</style>
