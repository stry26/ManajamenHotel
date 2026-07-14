<template>
  <div class="kamar-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Manajemen Kamar</h1>
        <p class="page-subtitle">Kelola seluruh data kamar hotel</p>
      </div>
      <button class="btn-primary-modern" @click="openModal('add')" id="btn-tambah-kamar">
        <i class="fa-solid fa-plus"></i> Tambah Kamar
      </button>
    </div>

    <!-- Stats Row -->
    <div class="kamar-stats-row">
      <div class="mini-stat">
        <div class="mini-stat-icon purple"><i class="fa-solid fa-building"></i></div>
        <div>
          <p class="mini-stat-label">Total Kamar</p>
          <p class="mini-stat-value">{{ kamarList.length }}</p>
        </div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-icon emerald"><i class="fa-solid fa-door-open"></i></div>
        <div>
          <p class="mini-stat-label">Kamar Kosong</p>
          <p class="mini-stat-value">{{ kamarList.filter(k => k.status === 'Kosong').length }}</p>
        </div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-icon rose"><i class="fa-solid fa-door-closed"></i></div>
        <div>
          <p class="mini-stat-label">Kamar Terisi</p>
          <p class="mini-stat-value">{{ kamarList.filter(k => k.status === 'Terisi').length }}</p>
        </div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card-modern">
      <div class="filter-bar">
        <div class="search-wrapper" style="flex:1; max-width:340px;">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" v-model="search" class="form-control-modern" placeholder="Cari nomor kamar..." id="kamar-search" />
        </div>
        <select v-model="filterStatus" class="form-select-modern" style="width:160px;" id="kamar-filter-status">
          <option value="">Semua Status</option>
          <option value="Kosong">Kosong</option>
          <option value="Terisi">Terisi</option>
        </select>
        <div class="filter-result-count">
          <i class="fa-solid fa-filter" style="font-size:.7rem;"></i>
          {{ filteredKamar.length }} dari {{ kamarList.length }} kamar
        </div>
      </div>

      <div v-if="loading" class="spinner-modern">
        <div class="spinner-ring"></div>
        <span>Memuat data kamar...</span>
      </div>

      <div v-else class="table-wrapper">
        <table class="table-modern" v-if="filteredKamar.length > 0">
          <thead>
            <tr>
              <th style="width:48px">#</th>
              <th>Nomor Kamar</th>
              <th>Tipe</th>
              <th>Harga / Malam</th>
              <th>Status</th>
              <th style="text-align:right; padding-right:20px">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(kamar, index) in filteredKamar" :key="kamar._id">
              <td class="num-col">{{ index + 1 }}</td>
              <td>
                <div class="room-number-cell">
                  <div class="room-num-icon"><i class="fa-solid fa-bed"></i></div>
                  <span class="fw-600">{{ kamar.nomor }}</span>
                </div>
              </td>
              <td><span class="tipe-badge" :class="'tipe-' + kamar.tipe.toLowerCase()">{{ kamar.tipe }}</span></td>
              <td><span class="price-text">Rp {{ kamar.harga.toLocaleString('id-ID') }}</span></td>
              <td>
                <span class="badge-modern" :class="kamar.status === 'Kosong' ? 'badge-success' : 'badge-danger'">
                  <i class="fa-solid fa-circle" style="font-size:.4rem"></i> {{ kamar.status }}
                </span>
              </td>
              <td>
                <div class="action-group">
                  <button class="btn-warning-modern" @click="openModal('edit', kamar)" :id="'btn-edit-kamar-' + index">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <button class="btn-danger-modern" @click="deleteKamar(kamar._id)" :id="'btn-hapus-kamar-' + index">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-bed"></i></div>
          <p>Tidak ada kamar ditemukan</p>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div class="modal-title-icon"><i class="fa-solid fa-bed"></i></div>
            <h5 class="modal-title">{{ isEdit ? 'Edit Data Kamar' : 'Tambah Kamar Baru' }}</h5>
          </div>
          <button class="modal-close-btn" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body-custom">
          <form @submit.prevent="saveKamar" id="form-kamar">
            <div class="form-group">
              <label class="form-label-modern">Nomor Kamar</label>
              <input type="text" class="form-control-modern" v-model="form.nomor" placeholder="cth: 101, A-202" required id="input-nomor-kamar" ref="firstInput" />
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label-modern">Tipe Kamar</label>
                <select class="form-select-modern" v-model="form.tipe" required id="select-tipe-kamar">
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label-modern">Status</label>
                <select class="form-select-modern" v-model="form.status" required id="select-status-kamar">
                  <option value="Kosong">Kosong</option>
                  <option value="Terisi">Terisi</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label-modern">Harga Per Malam (Rp)</label>
              <input type="number" class="form-control-modern" v-model.number="form.harga" placeholder="cth: 500000" required min="1" id="input-harga-kamar" />
            </div>
            <div class="modal-footer-actions">
              <button type="button" class="btn-ghost" @click="closeModal" id="btn-batal-kamar">
                <i class="fa-solid fa-xmark"></i> Batal
              </button>
              <button type="submit" class="btn-primary-modern" :disabled="saving" id="btn-simpan-kamar">
                <i class="fa-solid" :class="saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'"></i>
                {{ saving ? 'Menyimpan...' : (isEdit ? 'Perbarui' : 'Simpan') }}
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
  name: 'Kamar',
  data() {
    return {
      kamarList: [],
      search: '',
      filterStatus: '',
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      form: { nomor: '', tipe: 'Standard', harga: '', status: 'Kosong' },
      editId: null
    }
  },
  computed: {
    filteredKamar() {
      return this.kamarList.filter(k => {
        const matchSearch = k.nomor.toLowerCase().includes(this.search.toLowerCase())
        const matchStatus = !this.filterStatus || k.status === this.filterStatus
        return matchSearch && matchStatus
      })
    }
  },
  mounted() { this.fetchKamar() },
  methods: {
    async fetchKamar() {
      this.loading = true
      try {
        const res = await api.get('/kamar')
        this.kamarList = res.data
      } catch (e) {
        this.$swal.fire({ title: 'Error', text: 'Gagal memuat data kamar dari server', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
      } finally {
        this.loading = false
      }
    },
    openModal(type, data = null) {
      if (type === 'add') {
        this.isEdit = false
        this.editId = null
        this.form = { nomor: '', tipe: 'Standard', harga: '', status: 'Kosong' }
      } else {
        this.isEdit = true
        this.editId = data._id
        this.form = { nomor: data.nomor, tipe: data.tipe, harga: data.harga, status: data.status }
      }
      this.showModal = true
      this.$nextTick(() => this.$refs.firstInput?.focus())
    },
    closeModal() { this.showModal = false },
    async saveKamar() {
      this.saving = true
      try {
        if (this.isEdit) {
          await api.put(`/kamar/${this.editId}`, this.form)
          this.$swal.fire({ title: 'Berhasil!', text: 'Data kamar berhasil diubah', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
        } else {
          await api.post('/kamar', this.form)
          this.$swal.fire({ title: 'Berhasil!', text: 'Kamar baru berhasil ditambahkan', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
        }
        this.closeModal()
        this.fetchKamar()
      } catch (e) {
        this.$swal.fire({ title: 'Error', text: e.response?.data?.message || 'Terjadi kesalahan', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
      } finally {
        this.saving = false
      }
    },
    async deleteKamar(id) {
      const result = await this.$swal.fire({
        title: 'Hapus Kamar?', text: 'Data kamar ini akan dihapus secara permanen.',
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#f43f5e', cancelButtonColor: '#374151',
        confirmButtonText: 'Ya, Hapus!', cancelButtonText: 'Batal',
        background: '#161d2e', color: '#f1f5f9'
      })
      if (result.isConfirmed) {
        try {
          await api.delete(`/kamar/${id}`)
          this.$swal.fire({ title: 'Terhapus!', text: 'Data kamar berhasil dihapus.', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1500, showConfirmButton: false })
          this.fetchKamar()
        } catch (e) {
          this.$swal.fire({ title: 'Error', text: e.response?.data?.message || 'Gagal menghapus kamar', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
        }
      }
    }
  }
}
</script>

<style scoped>
.kamar-page { animation: fadeUp 0.4s ease both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.kamar-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.mini-stat { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px 20px; display: flex; align-items: center; gap: 14px; transition: var(--transition); }
.mini-stat:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
.mini-stat-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.mini-stat-icon.purple { background: rgba(139,92,246,.15); color: var(--accent-primary); }
.mini-stat-icon.emerald{ background: rgba(16,185,129,.15);  color: var(--emerald); }
.mini-stat-icon.rose   { background: rgba(244,63,94,.12);   color: var(--rose); }
.mini-stat-label { font-size: .72rem; font-weight: 600; color: var(--text-muted); margin: 0 0 4px; text-transform: uppercase; letter-spacing: .06em; }
.mini-stat-value { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -.03em; line-height: 1; }

.filter-bar { display: flex; align-items: center; gap: 12px; padding: 20px; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; }
.search-wrapper { position: relative; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: .82rem; }
.search-wrapper .form-control-modern { padding-left: 36px; }
.filter-result-count { margin-left: auto; font-size: .78rem; color: var(--text-muted); font-weight: 500; display: flex; align-items: center; gap: 6px; }

.table-wrapper { overflow-x: auto; }
.num-col { color: var(--text-muted); font-size: .82rem; }
.fw-600 { font-weight: 600; }
.room-number-cell { display: flex; align-items: center; gap: 10px; }
.room-num-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(139,92,246,.12); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: .8rem; flex-shrink: 0; }
.tipe-badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: .75rem; font-weight: 600; }
.tipe-standard { background: rgba(148,163,184,.1); color: var(--text-secondary); border: 1px solid rgba(148,163,184,.15); }
.tipe-deluxe   { background: rgba(14,165,233,.12);  color: var(--sky);            border: 1px solid rgba(14,165,233,.2); }
.tipe-suite    { background: rgba(245,158,11,.12);  color: var(--gold);           border: 1px solid rgba(245,158,11,.2); }
.price-text { font-size: .875rem; font-weight: 600; color: var(--emerald); }
.action-group { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px 20px; gap: 12px; }
.empty-state-icon { width: 64px; height: 64px; background: rgba(139,92,246,.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--accent-primary); }
.empty-state p { color: var(--text-muted); font-size: .9rem; margin: 0; }

.modal-overlay { position: fixed; inset: 0; z-index: 1050; background: rgba(0,0,0,.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayIn .2s ease; }
@keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
.modal-box { background: var(--bg-card); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius-xl); box-shadow: 0 25px 80px rgba(0,0,0,.6); width: 100%; max-width: 500px; animation: modalIn .25s cubic-bezier(.34,1.56,.64,1); overflow: hidden; }
@keyframes modalIn { from { opacity:0; transform:scale(.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
.modal-title-wrap { display: flex; align-items: center; gap: 12px; }
.modal-title-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(139,92,246,.15); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: .95rem; }
.modal-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; }
.modal-close-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,.04); border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .85rem; transition: var(--transition); }
.modal-close-btn:hover { background: rgba(244,63,94,.1); border-color: rgba(244,63,94,.2); color: var(--rose); }
.modal-body-custom { padding: 24px; }
.form-group { margin-bottom: 18px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.modal-footer-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); }

@media (max-width: 768px) { .kamar-stats-row { grid-template-columns: repeat(2,1fr); } .form-row-2 { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .kamar-stats-row { grid-template-columns: 1fr; } .filter-bar { flex-direction: column; align-items: stretch; } .filter-result-count { margin-left: 0; } .action-group { flex-direction: column; gap: 6px; } }
</style>
