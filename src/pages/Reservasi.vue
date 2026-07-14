<template>
  <div class="reservasi-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Manajemen Reservasi</h1>
        <p class="page-subtitle">Kelola seluruh data reservasi dan pemesanan kamar</p>
      </div>
      <button class="btn-primary-modern" @click="openModal('add')" id="btn-buat-reservasi">
        <i class="fa-solid fa-calendar-plus"></i> Buat Reservasi
      </button>
    </div>

    <!-- Stats Row -->
    <div class="res-stats-row">
      <div class="mini-stat">
        <div class="mini-stat-icon sky"><i class="fa-solid fa-calendar-check"></i></div>
        <div><p class="mini-stat-label">Total Reservasi</p><p class="mini-stat-value">{{ reservasiList.length }}</p></div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-icon emerald"><i class="fa-solid fa-right-to-bracket"></i></div>
        <div><p class="mini-stat-label">Sedang Check In</p><p class="mini-stat-value">{{ reservasiList.filter(r => r.status === 'Check In').length }}</p></div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-icon gold"><i class="fa-solid fa-door-open"></i></div>
        <div><p class="mini-stat-label">Kamar Kosong</p><p class="mini-stat-value">{{ kamarKosongList.length }}</p></div>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card-modern">
      <div v-if="loading" class="spinner-modern">
        <div class="spinner-ring"></div>
        <span>Memuat data reservasi...</span>
      </div>
      <div v-else class="table-wrapper">
        <table class="table-modern" v-if="reservasiList.length > 0">
          <thead>
            <tr>
              <th style="width:48px">#</th>
              <th>Tamu</th>
              <th>Kamar</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Durasi & Total</th>
              <th>Status</th>
              <th style="text-align:right; padding-right:20px; min-width:160px">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(res, index) in reservasiList" :key="res._id">
              <td class="num-col">{{ index + 1 }}</td>
              <td>
                <div class="guest-cell">
                  <div class="guest-avatar">{{ res.nama_tamu ? res.nama_tamu.charAt(0).toUpperCase() : '?' }}</div>
                  <span class="guest-name">{{ res.nama_tamu }}</span>
                </div>
              </td>
              <td>
                <div class="room-cell">
                  <div class="room-num-icon"><i class="fa-solid fa-bed"></i></div>
                  <div>
                    <p class="room-num">{{ res.nomor_kamar }}</p>
                    <p class="room-tipe-label">{{ res.tipe }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="date-cell checkin-cell">
                  <i class="fa-solid fa-calendar-plus date-icon"></i>
                  <p class="date-main">{{ formatDate(res.tanggal_checkin) }}</p>
                </div>
              </td>
              <td>
                <div class="date-cell checkout-cell">
                  <i class="fa-solid fa-calendar-minus date-icon"></i>
                  <p class="date-main">{{ formatDate(res.tanggal_checkout) }}</p>
                </div>
              </td>
              <td>
                <p class="total-nights"><i class="fa-solid fa-moon" style="font-size:.7rem;color:var(--sky)"></i> {{ calcNight(res.tanggal_checkin, res.tanggal_checkout) }} malam</p>
                <p class="total-harga">Rp {{ calcTotal(res.harga, res.tanggal_checkin, res.tanggal_checkout).toLocaleString('id-ID') }}</p>
              </td>
              <td>
                <span class="badge-modern" :class="res.status === 'Check In' ? 'badge-success' : 'badge-gray'">
                  <i class="fa-solid fa-circle" style="font-size:.4rem"></i> {{ res.status }}
                </span>
              </td>
              <td>
                <div class="action-group">
                  <button class="btn-warning-modern" @click="openModal('edit', res)" :id="'btn-edit-res-' + index">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                  <button class="btn-danger-modern" @click="deleteReservasi(res._id)" :id="'btn-hapus-res-' + index">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
          <p>Belum ada data reservasi</p>
          <button class="btn-primary-modern" @click="openModal('add')" style="margin-top:12px; font-size:.82rem;">
            <i class="fa-solid fa-calendar-plus"></i> Buat Reservasi Pertama
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box modal-lg-box" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div class="modal-title-icon" :class="isEdit ? 'icon-warning' : 'icon-sky'">
              <i :class="isEdit ? 'fa-solid fa-calendar-pen' : 'fa-solid fa-calendar-plus'"></i>
            </div>
            <div>
              <h5 class="modal-title">{{ isEdit ? 'Edit Reservasi' : 'Buat Reservasi Baru' }}</h5>
              <p class="modal-subtitle">{{ isEdit ? 'Perbarui data reservasi yang dipilih' : 'Isi semua field yang diperlukan' }}</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="closeModal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body-custom">
          <form @submit.prevent="saveReservasi" id="form-reservasi">
            <div class="form-row-2">
              <!-- Pilih Tamu -->
              <div class="form-group">
                <label class="form-label-modern"><i class="fa-solid fa-user label-icon"></i> Pilih Tamu</label>
                <select class="form-select-modern" v-model="form.id_tamu" required id="select-tamu-reservasi">
                  <option value="" disabled>— Pilih Tamu —</option>
                  <option v-for="t in tamuList" :key="t._id" :value="t._id">{{ t.nama }}</option>
                </select>
              </div>
              <!-- Pilih Kamar -->
              <div class="form-group">
                <label class="form-label-modern"><i class="fa-solid fa-bed label-icon"></i> {{ isEdit ? 'Kamar' : 'Pilih Kamar Kosong' }}</label>
                <select class="form-select-modern" v-model="form.id_kamar" required id="select-kamar-reservasi">
                  <option value="" disabled>— Pilih Kamar —</option>
                  <option v-for="k in kamarSelectList" :key="k._id" :value="k._id">
                    No.{{ k.nomor }} — {{ k.tipe }} (Rp {{ k.harga.toLocaleString('id-ID') }}){{ k._id === form.id_kamar && isEdit ? ' ✓' : '' }}
                  </option>
                </select>
                <p v-if="!isEdit && kamarKosongList.length === 0" class="form-warning">
                  <i class="fa-solid fa-triangle-exclamation"></i> Tidak ada kamar kosong saat ini.
                </p>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label-modern"><i class="fa-solid fa-calendar-plus label-icon"></i> Tanggal Check In</label>
                <input type="date" class="form-control-modern" v-model="form.tanggal_checkin" required id="input-checkin-reservasi" :min="todayStr" />
              </div>
              <div class="form-group">
                <label class="form-label-modern"><i class="fa-solid fa-calendar-minus label-icon"></i> Tanggal Check Out</label>
                <input type="date" class="form-control-modern" v-model="form.tanggal_checkout" required id="input-checkout-reservasi" :min="form.tanggal_checkin || todayStr" />
              </div>
            </div>

            <!-- Status hanya saat edit -->
            <transition name="slide-down">
              <div class="form-group" v-if="isEdit">
                <label class="form-label-modern"><i class="fa-solid fa-circle-check label-icon"></i> Status Reservasi</label>
                <div class="status-radio-group">
                  <label class="status-radio" :class="{ active: form.status === 'Check In' }">
                    <input type="radio" v-model="form.status" value="Check In" />
                    <i class="fa-solid fa-right-to-bracket"></i><span>Check In</span>
                  </label>
                  <label class="status-radio" :class="{ active: form.status === 'Check Out' }">
                    <input type="radio" v-model="form.status" value="Check Out" />
                    <i class="fa-solid fa-right-from-bracket"></i><span>Check Out</span>
                  </label>
                </div>
              </div>
            </transition>

            <!-- Duration Preview -->
            <transition name="slide-down">
              <div class="duration-preview" v-if="showPreview">
                <div class="duration-item"><i class="fa-solid fa-moon"></i><span>{{ previewNight }} malam</span></div>
                <div class="duration-divider"></div>
                <div class="duration-item"><i class="fa-solid fa-bed"></i><span>Rp {{ selectedKamarHarga.toLocaleString('id-ID') }} / malam</span></div>
                <div class="duration-divider"></div>
                <div class="duration-item total-preview">
                  <i class="fa-solid fa-receipt"></i>
                  <span>Total: <strong>Rp {{ (previewNight * selectedKamarHarga).toLocaleString('id-ID') }}</strong></span>
                </div>
              </div>
            </transition>

            <div class="modal-footer-actions">
              <button type="button" class="btn-ghost" @click="closeModal" id="btn-batal-reservasi">
                <i class="fa-solid fa-xmark"></i> Batal
              </button>
              <button type="submit" class="btn-primary-modern" :disabled="saving || (!isEdit && kamarKosongList.length === 0)" id="btn-simpan-reservasi">
                <i class="fa-solid" :class="saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'"></i>
                {{ saving ? 'Menyimpan...' : (isEdit ? 'Perbarui Reservasi' : 'Simpan Reservasi') }}
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
  name: 'Reservasi',
  data() {
    return {
      reservasiList: [],
      tamuList: [],
      allKamarList: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      editId: null,
      form: { id_tamu: '', id_kamar: '', tanggal_checkin: '', tanggal_checkout: '', status: 'Check In' }
    }
  },
  computed: {
    todayStr() { return new Date().toISOString().slice(0, 10) },
    kamarKosongList() { return this.allKamarList.filter(k => k.status === 'Kosong') },
    kamarSelectList() {
      if (!this.isEdit) return this.kamarKosongList
      const cur = this.allKamarList.find(k => String(k._id) === String(this.form.id_kamar))
      const rest = this.kamarKosongList.filter(k => String(k._id) !== String(this.form.id_kamar))
      return cur ? [cur, ...rest] : rest
    },
    previewNight() {
      if (!this.form.tanggal_checkin || !this.form.tanggal_checkout) return 0
      const diff = Math.ceil(Math.abs(new Date(this.form.tanggal_checkout) - new Date(this.form.tanggal_checkin)) / 86400000)
      return diff > 0 ? diff : 1
    },
    selectedKamarHarga() {
      const k = this.allKamarList.find(k => String(k._id) === String(this.form.id_kamar))
      return k ? k.harga : 0
    },
    showPreview() {
      return this.form.tanggal_checkin && this.form.tanggal_checkout && this.selectedKamarHarga > 0 && this.previewNight > 0
    }
  },
  mounted() { this.fetchAll() },
  methods: {
    async fetchAll() {
      this.loading = true
      try {
        const [resRes, resTamu, resKamar] = await Promise.all([
          api.get('/reservasi'),
          api.get('/tamu'),
          api.get('/kamar')
        ])
        this.reservasiList = resRes.data
        this.tamuList      = resTamu.data
        this.allKamarList  = resKamar.data
      } catch (e) {
        this.$swal.fire({ title: 'Error', text: 'Gagal memuat data dari server', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
      } finally {
        this.loading = false
      }
    },
    openModal(type, data = null) {
      if (type === 'add') {
        this.isEdit = false
        this.editId = null
        this.form = { id_tamu: '', id_kamar: '', tanggal_checkin: '', tanggal_checkout: '', status: 'Check In' }
      } else {
        this.isEdit = true
        this.editId = data._id
        const toStr = d => {
          if (!d) return ''
          if (typeof d === 'string' && d.includes('T')) return d.split('T')[0]
          const dt = new Date(d)
          if (isNaN(dt.getTime())) return ''
          return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0')
        }
        this.form = {
          id_tamu: data.id_tamu ? String(data.id_tamu) : '',
          id_kamar: data.id_kamar ? String(data.id_kamar) : '',
          tanggal_checkin: toStr(data.tanggal_checkin),
          tanggal_checkout: toStr(data.tanggal_checkout),
          status: data.status || 'Check In'
        }
      }
      this.showModal = true
    },
    closeModal() { this.showModal = false },
    formatDate(date) {
      if (!date) return '-'
      if (typeof date === 'string' && date.includes('T')) {
        const parts = date.split('T')[0].split('-')
        const dt = new Date(parts[0], parts[1] - 1, parts[2])
        return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      }
      return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    calcNight(cin, cout) {
      const diff = Math.ceil(Math.abs(new Date(cout) - new Date(cin)) / 86400000)
      return diff > 0 ? diff : 1
    },
    calcTotal(harga, cin, cout) { return this.calcNight(cin, cout) * harga },
    async saveReservasi() {
      const cin  = new Date(this.form.tanggal_checkin)
      const cout = new Date(this.form.tanggal_checkout)
      if (!this.form.id_tamu) { this.$swal.fire({ title: 'Peringatan', text: 'Pilih tamu terlebih dahulu', icon: 'warning', background: '#161d2e', color: '#f1f5f9' }); return }
      if (!this.form.id_kamar) { this.$swal.fire({ title: 'Peringatan', text: 'Pilih kamar terlebih dahulu', icon: 'warning', background: '#161d2e', color: '#f1f5f9' }); return }
      if (cout <= cin) { this.$swal.fire({ title: 'Peringatan', text: 'Tanggal check out harus setelah tanggal check in', icon: 'warning', background: '#161d2e', color: '#f1f5f9' }); return }

      this.saving = true
      try {
        if (this.isEdit) {
          await api.put(`/reservasi/${this.editId}`, this.form)
          this.$swal.fire({ title: 'Diperbarui!', text: 'Data reservasi berhasil diubah', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
        } else {
          await api.post('/reservasi', this.form)
          this.$swal.fire({ title: 'Berhasil!', text: 'Reservasi berhasil dibuat', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
        }
        this.closeModal()
        this.fetchAll()
      } catch (e) {
        this.$swal.fire({ title: 'Error', text: e.response?.data?.message || 'Terjadi kesalahan', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
      } finally {
        this.saving = false
      }
    },
    async deleteReservasi(id) {
      const result = await this.$swal.fire({
        title: 'Hapus Reservasi?', text: 'Reservasi ini akan dihapus dan status kamar akan kembali Kosong.',
        icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#f43f5e', cancelButtonColor: '#374151',
        confirmButtonText: 'Ya, Hapus!', cancelButtonText: 'Batal',
        background: '#161d2e', color: '#f1f5f9'
      })
      if (result.isConfirmed) {
        try {
          await api.delete(`/reservasi/${id}`)
          this.$swal.fire({ title: 'Terhapus!', text: 'Reservasi berhasil dihapus.', icon: 'success', background: '#161d2e', color: '#f1f5f9', timer: 1500, showConfirmButton: false })
          this.fetchAll()
        } catch (e) {
          this.$swal.fire({ title: 'Error', text: e.response?.data?.message || 'Gagal menghapus reservasi', icon: 'error', background: '#161d2e', color: '#f1f5f9' })
        }
      }
    }
  }
}
</script>

<style scoped>
.reservasi-page { animation: fadeUp 0.4s ease both; }
@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.res-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 20px; }
.mini-stat { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 18px 20px; display: flex; align-items: center; gap: 14px; transition: var(--transition); }
.mini-stat:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
.mini-stat-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.mini-stat-icon.sky     { background: rgba(14,165,233,.15);  color: var(--sky); }
.mini-stat-icon.emerald { background: rgba(16,185,129,.15);  color: var(--emerald); }
.mini-stat-icon.gold    { background: rgba(245,158,11,.15);  color: var(--gold); }
.mini-stat-label { font-size: .72rem; font-weight: 600; color: var(--text-muted); margin: 0 0 4px; text-transform: uppercase; letter-spacing: .06em; }
.mini-stat-value { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -.03em; line-height: 1; }

.table-wrapper { overflow-x: auto; }
.num-col { color: var(--text-muted); font-size: .82rem; }
.guest-cell { display: flex; align-items: center; gap: 10px; }
.guest-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), #6d28d9); display: flex; align-items: center; justify-content: center; font-size: .9rem; font-weight: 700; color: white; flex-shrink: 0; }
.guest-name { font-size: .875rem; font-weight: 600; color: var(--text-primary); }
.room-cell { display: flex; align-items: center; gap: 10px; }
.room-num-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(139,92,246,.12); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: .8rem; flex-shrink: 0; }
.room-num { font-size: .875rem; font-weight: 700; color: var(--text-primary); margin: 0 0 2px; }
.room-tipe-label { display: inline-block; font-size: .68rem; font-weight: 600; padding: 1px 7px; border-radius: 4px; background: rgba(14,165,233,.1); color: var(--sky); margin: 0; }
.date-cell { display: flex; align-items: center; gap: 8px; }
.date-icon { font-size: .8rem; }
.checkin-cell  .date-icon { color: var(--emerald); }
.checkout-cell .date-icon { color: var(--rose); }
.date-main { font-size: .82rem; font-weight: 500; color: var(--text-primary); margin: 0; }
.total-nights { font-size: .75rem; color: var(--text-muted); margin: 0 0 3px; }
.total-harga  { font-size: .875rem; font-weight: 700; color: var(--emerald); margin: 0; }
.action-group { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 64px 20px; gap: 12px; }
.empty-state-icon { width: 64px; height: 64px; background: rgba(139,92,246,.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--accent-primary); }
.empty-state p { color: var(--text-muted); font-size: .9rem; margin: 0; }

.modal-overlay { position: fixed; inset: 0; z-index: 1050; background: rgba(0,0,0,.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayIn .2s ease; }
@keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
.modal-box { background: var(--bg-card); border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius-xl); box-shadow: 0 25px 80px rgba(0,0,0,.6); width: 100%; max-width: 580px; animation: modalIn .25s cubic-bezier(.34,1.56,.64,1); overflow: hidden; }
.modal-lg-box { max-width: 640px; }
@keyframes modalIn { from { opacity:0; transform:scale(.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
.modal-title-wrap { display: flex; align-items: center; gap: 12px; }
.modal-title-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: .95rem; }
.icon-sky     { background: rgba(14,165,233,.15); color: var(--sky); }
.icon-warning { background: rgba(245,158,11,.15);  color: var(--gold); }
.modal-title    { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 2px; }
.modal-subtitle { font-size: .72rem; color: var(--text-muted); margin: 0; }
.modal-close-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,.04); border: 1px solid var(--border-color); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .85rem; transition: var(--transition); }
.modal-close-btn:hover { background: rgba(244,63,94,.1); border-color: rgba(244,63,94,.2); color: var(--rose); }
.modal-body-custom { padding: 24px; }
.label-icon { margin-right: 4px; color: var(--accent-primary); font-size: .75rem; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 18px; }
.form-warning { display: flex; align-items: center; gap: 6px; font-size: .75rem; color: var(--rose); margin: 6px 0 0; }

.status-radio-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.status-radio { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); font-size: .85rem; font-weight: 500; color: var(--text-secondary); user-select: none; }
.status-radio input[type="radio"] { display: none; }
.status-radio i { font-size: .85rem; color: var(--text-muted); transition: var(--transition); }
.status-radio:hover { border-color: rgba(139,92,246,.3); background: rgba(139,92,246,.06); color: var(--text-primary); }
.status-radio.active { border-color: rgba(139,92,246,.4); background: rgba(139,92,246,.12); color: var(--accent-primary); }
.status-radio.active i { color: var(--accent-primary); }

.duration-preview { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; background: rgba(14,165,233,.06); border: 1px solid rgba(14,165,233,.15); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 20px; }
.duration-item { display: flex; align-items: center; gap: 8px; font-size: .82rem; color: var(--text-secondary); }
.duration-item i { color: var(--sky); font-size: .8rem; }
.duration-divider { width: 1px; height: 20px; background: rgba(14,165,233,.2); }
.total-preview { color: var(--text-primary); }
.total-preview strong { color: var(--emerald); font-size: .9rem; }

.slide-down-enter-active, .slide-down-leave-active { transition: all .25s ease; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { opacity:0; max-height:0; margin-bottom:0; padding-top:0; padding-bottom:0; }
.slide-down-enter-to, .slide-down-leave-from { max-height:120px; }

.modal-footer-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); }

@media (max-width: 768px) { .res-stats-row { grid-template-columns: repeat(2,1fr); } .form-row-2 { grid-template-columns: 1fr; } .duration-preview { flex-direction: column; gap: 8px; } .duration-divider { display: none; } }
@media (max-width: 480px) { .res-stats-row { grid-template-columns: 1fr; } .action-group { flex-direction: column; } }
</style>
