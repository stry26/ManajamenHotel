<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Selamat datang kembali, Admin! Berikut ringkasan hari ini.</p>
      </div>
      <div class="header-date">
        <i class="fa-regular fa-calendar"></i>
        <span>{{ todayDate }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="spinner-modern">
      <div class="spinner-ring"></div>
      <span>Memuat data dashboard...</span>
    </div>

    <!-- Content -->
    <div v-else>

      <!-- ── Top Stats ───────────────────────────────── -->
      <div class="stats-grid">
        <div class="stat-card" v-for="s in statCards" :key="s.key">
          <div class="stat-card-inner">
            <div class="stat-info">
              <p class="stat-label">{{ s.label }}</p>
              <h2 class="stat-value">{{ s.value }}</h2>
              <p class="stat-hint">{{ s.hint }}</p>
            </div>
            <div class="stat-icon-wrap" :class="s.color">
              <i :class="s.icon"></i>
            </div>
          </div>
          <div class="stat-progress">
            <div class="stat-progress-bar" :class="s.color" :style="{ width: s.pct }"></div>
          </div>
        </div>
      </div>

      <!-- ── Room Summary ────────────────────────────── -->
      <div class="room-status-grid">
        <div class="room-status-card available">
          <div class="room-status-icon"><i class="fa-solid fa-door-open"></i></div>
          <div class="room-status-info">
            <p class="room-status-label">Kamar Tersedia</p>
            <h3 class="room-status-value">{{ stats.kamar_kosong }}</h3>
          </div>
          <div class="room-status-badge available-badge">
            <i class="fa-solid fa-circle dot-xs"></i> Kosong
          </div>
        </div>
        <div class="room-status-card occupied">
          <div class="room-status-icon"><i class="fa-solid fa-door-closed"></i></div>
          <div class="room-status-info">
            <p class="room-status-label">Kamar Terisi</p>
            <h3 class="room-status-value">{{ stats.kamar_terisi }}</h3>
          </div>
          <div class="room-status-badge occupied-badge">
            <i class="fa-solid fa-circle dot-xs"></i> Terisi
          </div>
        </div>
        <div class="room-status-card rate">
          <div class="room-status-icon"><i class="fa-solid fa-chart-pie"></i></div>
          <div class="room-status-info">
            <p class="room-status-label">Tingkat Hunian</p>
            <h3 class="room-status-value">{{ occupancyRate }}%</h3>
          </div>
          <div class="occupancy-ring-wrap">
            <svg viewBox="0 0 40 40" class="occupancy-svg">
              <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
              <circle cx="20" cy="20" r="15" fill="none" stroke="var(--gold)" stroke-width="4"
                stroke-linecap="round" stroke-dasharray="94.25"
                :stroke-dashoffset="94.25 - (94.25 * occupancyRate / 100)"
                transform="rotate(-90 20 20)" style="transition: stroke-dashoffset 1s ease"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- ── Kalender + Detail Panel ─────────────────── -->
      <div class="calendar-section">

        <!-- KALENDER -->
        <div class="card-modern calendar-card">
          <div class="cal-header">
            <button class="cal-nav-btn" @click="prevMonth" id="btn-prev-month">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="cal-title">
              <span class="cal-month">{{ monthName }}</span>
              <span class="cal-year">{{ calendarYear }}</span>
            </div>
            <button class="cal-nav-btn" @click="nextMonth" id="btn-next-month">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Day Labels -->
          <div class="cal-days-header">
            <span v-for="d in ['Min','Sen','Sel','Rab','Kam','Jum','Sab']" :key="d">{{ d }}</span>
          </div>

          <!-- Calendar Grid -->
          <div class="cal-grid">
            <div
              v-for="(cell, i) in calendarCells"
              :key="i"
              class="cal-cell"
              :class="{
                'other-month': !cell.isCurrentMonth,
                'today': cell.isToday,
                'selected': cell.date && isSameDay(cell.date, selectedDate),
                'has-event': cell.date && getEventsForDate(cell.date).length > 0,
                'empty-cell': !cell.date
              }"
              @click="cell.date && selectDate(cell.date)"
            >
              <span class="cal-day-num">{{ cell.day }}</span>
              <!-- Event dots -->
              <div v-if="cell.date && getEventsForDate(cell.date).length > 0" class="event-dots">
                <span
                  v-for="(ev, ei) in getEventsForDate(cell.date).slice(0, 3)"
                  :key="ei"
                  class="event-dot"
                  :class="ev.type === 'checkin' ? 'dot-checkin' : 'dot-checkout'"
                ></span>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div class="cal-legend">
            <div class="legend-item">
              <span class="legend-dot dot-checkin"></span>
              <span>Check In</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot dot-checkout"></span>
              <span>Check Out</span>
            </div>
            <div class="legend-item">
              <span class="legend-today-box"></span>
              <span>Hari Ini</span>
            </div>
          </div>
        </div>

        <!-- DETAIL PANEL -->
        <div class="card-modern detail-card">
          <div class="detail-header">
            <div class="detail-title-wrap">
              <div class="detail-icon">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div>
                <h3 class="detail-title">{{ selectedDateLabel }}</h3>
                <p class="detail-subtitle">
                  {{ selectedDayEvents.length > 0
                    ? selectedDayEvents.length + ' kegiatan pada hari ini'
                    : 'Tidak ada kegiatan'
                  }}
                </p>
              </div>
            </div>
            <button class="go-today-btn" @click="goToToday" id="btn-go-today">
              <i class="fa-solid fa-crosshairs"></i> Hari Ini
            </button>
          </div>

          <!-- No events -->
          <div v-if="selectedDayEvents.length === 0" class="detail-empty">
            <div class="detail-empty-icon">
              <i class="fa-regular fa-calendar-xmark"></i>
            </div>
            <p>Tidak ada reservasi pada tanggal ini</p>
            <span>Pilih tanggal lain di kalender</span>
          </div>

          <!-- Events List -->
          <div v-else class="detail-events">
            <div
              v-for="ev in selectedDayEvents"
              :key="ev.id + ev.type"
              class="event-card"
              :class="ev.type === 'checkin' ? 'event-checkin' : 'event-checkout'"
            >
              <div class="event-type-bar"></div>
              <div class="event-body">
                <div class="event-top">
                  <div class="event-avatar">
                    {{ ev.nama_tamu.charAt(0).toUpperCase() }}
                  </div>
                  <div class="event-main">
                    <p class="event-guest">{{ ev.nama_tamu }}</p>
                    <p class="event-room">
                      <i class="fa-solid fa-bed"></i>
                      Kamar {{ ev.nomor_kamar }}
                      <span class="event-tipe">{{ ev.tipe }}</span>
                    </p>
                  </div>
                  <div class="event-type-badge" :class="ev.type === 'checkin' ? 'badge-checkin' : 'badge-checkout'">
                    <i :class="ev.type === 'checkin' ? 'fa-solid fa-right-to-bracket' : 'fa-solid fa-right-from-bracket'"></i>
                    {{ ev.type === 'checkin' ? 'Check In' : 'Check Out' }}
                  </div>
                </div>
                <div class="event-dates">
                  <div class="event-date-item">
                    <i class="fa-solid fa-calendar-plus"></i>
                    <span>Check In: {{ formatDateFull(ev.tanggal_checkin) }}</span>
                  </div>
                  <div class="event-date-item">
                    <i class="fa-solid fa-calendar-minus"></i>
                    <span>Check Out: {{ formatDateFull(ev.tanggal_checkout) }}</span>
                  </div>
                  <div class="event-date-item">
                    <i class="fa-solid fa-moon"></i>
                    <span>{{ calcNight(ev.tanggal_checkin, ev.tanggal_checkout) }} malam
                      · Rp {{ (calcNight(ev.tanggal_checkin, ev.tanggal_checkout) * ev.harga).toLocaleString('id-ID') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div><!-- /.calendar-section -->

      <!-- ── Bottom: Reservasi Terkini + Status Kamar ── -->
      <div class="bottom-grid">

        <!-- Reservasi Terkini -->
        <div class="card-modern section-card">
          <div class="section-card-header">
            <div class="section-card-title">
              <div class="section-icon sky"><i class="fa-solid fa-calendar-check"></i></div>
              <div>
                <h3>Reservasi Terkini</h3>
                <p>{{ allReservasi.length }} reservasi tercatat</p>
              </div>
            </div>
            <router-link to="/reservasi" class="view-all-link">
              Lihat Semua <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
          <div v-if="allReservasi.length === 0" class="section-empty">
            <div class="empty-state-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
            <p>Belum ada data reservasi</p>
          </div>
          <div v-else class="reservasi-list">
            <div v-for="res in allReservasi.slice(0,5)" :key="res.id" class="reservasi-item">
              <div class="res-avatar">{{ res.nama_tamu.charAt(0).toUpperCase() }}</div>
              <div class="res-info">
                <p class="res-name">{{ res.nama_tamu }}</p>
                <p class="res-detail">
                  <i class="fa-solid fa-bed"></i>
                  Kamar {{ res.nomor_kamar }}
                  <span class="res-tipe">{{ res.tipe }}</span>
                </p>
              </div>
              <div class="res-dates">
                <p class="res-date-range">
                  {{ formatDateShort(res.tanggal_checkin) }}
                  <i class="fa-solid fa-arrow-right" style="font-size:.6rem;color:var(--text-muted)"></i>
                  {{ formatDateShort(res.tanggal_checkout) }}
                </p>
                <span class="badge-modern" :class="res.status === 'Check In' ? 'badge-success' : 'badge-gray'">
                  <i class="fa-solid fa-circle" style="font-size:.4rem"></i>
                  {{ res.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Kamar -->
        <div class="card-modern section-card">
          <div class="section-card-header">
            <div class="section-card-title">
              <div class="section-icon purple"><i class="fa-solid fa-building"></i></div>
              <div>
                <h3>Status Kamar</h3>
                <p>{{ allKamar.length }} kamar terdaftar</p>
              </div>
            </div>
            <router-link to="/kamar" class="view-all-link">
              Kelola <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
          <div class="kamar-filter-tabs">
            <button
              v-for="tab in kamarTabs" :key="tab.value"
              class="filter-tab" :class="{ active: activeKamarTab === tab.value }"
              @click="activeKamarTab = tab.value"
            >
              {{ tab.label }}
              <span class="tab-count">{{ tab.count }}</span>
            </button>
          </div>
          <div v-if="filteredKamarList.length === 0" class="section-empty">
            <div class="empty-state-icon"><i class="fa-solid fa-bed"></i></div>
            <p>Tidak ada kamar</p>
          </div>
          <div v-else class="kamar-grid">
            <div
              v-for="k in filteredKamarList" :key="k.id"
              class="kamar-tile" :class="k.status === 'Kosong' ? 'tile-kosong' : 'tile-terisi'"
            >
              <div class="tile-header">
                <span class="tile-number">{{ k.nomor }}</span>
                <span class="tile-dot" :class="k.status === 'Kosong' ? 'dot-green' : 'dot-red'"></span>
              </div>
              <p class="tile-tipe">{{ k.tipe }}</p>
              <p class="tile-harga">{{ formatHarga(k.harga) }}</p>
              <div class="tile-status-bar" :class="k.status === 'Kosong' ? 'bar-green' : 'bar-red'"></div>
            </div>
          </div>
        </div>

      </div><!-- /.bottom-grid -->

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3 class="section-title">Aksi Cepat</h3>
        <div class="quick-actions-grid">
          <router-link to="/kamar" class="quick-action-item">
            <div class="qa-icon purple"><i class="fa-solid fa-bed"></i></div>
            <span>Kelola Kamar</span>
            <i class="fa-solid fa-arrow-right qa-arrow"></i>
          </router-link>
          <router-link to="/tamu" class="quick-action-item">
            <div class="qa-icon emerald"><i class="fa-solid fa-user-plus"></i></div>
            <span>Data Tamu</span>
            <i class="fa-solid fa-arrow-right qa-arrow"></i>
          </router-link>
          <router-link to="/reservasi" class="quick-action-item">
            <div class="qa-icon sky"><i class="fa-solid fa-calendar-plus"></i></div>
            <span>Buat Reservasi</span>
            <i class="fa-solid fa-arrow-right qa-arrow"></i>
          </router-link>
        </div>
      </div>

    </div><!-- /v-else -->
  </div>
</template>

<script>
// ── DUMMY DATA (mirrored from seed.js, extended for current month) ──────────
const TODAY = new Date()
const Y = TODAY.getFullYear()
const M = TODAY.getMonth() // 0-indexed

function d(y, m, day) { return new Date(y, m, day) }

const DUMMY_KAMAR = [
  { id: 'k1',  nomor: '101', tipe: 'Standard', harga: 300000, status: 'Terisi' },
  { id: 'k2',  nomor: '102', tipe: 'Deluxe',   harga: 500000, status: 'Terisi' },
  { id: 'k3',  nomor: '103', tipe: 'Standard', harga: 300000, status: 'Terisi' },
  { id: 'k4',  nomor: '104', tipe: 'Deluxe',   harga: 500000, status: 'Kosong' },
  { id: 'k5',  nomor: '105', tipe: 'Standard', harga: 300000, status: 'Kosong' },
  { id: 'k6',  nomor: '106', tipe: 'Deluxe',   harga: 500000, status: 'Kosong' },
  { id: 'k7',  nomor: '107', tipe: 'Standard', harga: 300000, status: 'Kosong' },
  { id: 'k8',  nomor: '108', tipe: 'Suite',    harga: 900000, status: 'Kosong' },
  { id: 'k9',  nomor: '109', tipe: 'Standard', harga: 300000, status: 'Kosong' },
  { id: 'k10', nomor: '110', tipe: 'Deluxe',   harga: 500000, status: 'Kosong' },
]

const DUMMY_RESERVASI = [
  // Dari seed.js (Agustus 2026)
  { id: 'r1', nama_tamu: 'Budi Santoso',  nomor_kamar: '101', tipe: 'Standard', harga: 300000, tanggal_checkin: new Date(2026,7,1),  tanggal_checkout: new Date(2026,7,3),  status: 'Check In' },
  { id: 'r2', nama_tamu: 'Siti Aminah',   nomor_kamar: '102', tipe: 'Deluxe',   harga: 500000, tanggal_checkin: new Date(2026,7,2),  tanggal_checkout: new Date(2026,7,5),  status: 'Check In' },
  { id: 'r3', nama_tamu: 'Andi Wijaya',   nomor_kamar: '103', tipe: 'Standard', harga: 300000, tanggal_checkin: new Date(2026,7,4),  tanggal_checkout: new Date(2026,7,6),  status: 'Check In' },
  // Bulan ini (dinamis)
  { id: 'r4', nama_tamu: 'Dewi Lestari',  nomor_kamar: '104', tipe: 'Deluxe',   harga: 500000, tanggal_checkin: d(Y,M,3),  tanggal_checkout: d(Y,M,6),  status: 'Check In' },
  { id: 'r5', nama_tamu: 'Rudi Hartono',  nomor_kamar: '105', tipe: 'Standard', harga: 300000, tanggal_checkin: d(Y,M,7),  tanggal_checkout: d(Y,M,10), status: 'Check In' },
  { id: 'r6', nama_tamu: 'Mega Putri',    nomor_kamar: '108', tipe: 'Suite',    harga: 900000, tanggal_checkin: d(Y,M,10), tanggal_checkout: d(Y,M,14), status: 'Check In' },
  { id: 'r7', nama_tamu: 'Hendra Kusuma', nomor_kamar: '106', tipe: 'Deluxe',   harga: 500000, tanggal_checkin: d(Y,M,14), tanggal_checkout: d(Y,M,16), status: 'Check In' },
  { id: 'r8', nama_tamu: 'Rina Wahyuni',  nomor_kamar: '102', tipe: 'Deluxe',   harga: 500000, tanggal_checkin: d(Y,M,TODAY.getDate()), tanggal_checkout: d(Y,M,TODAY.getDate()+2), status: 'Check In' },
  { id: 'r9', nama_tamu: 'Budi Santoso',  nomor_kamar: '109', tipe: 'Standard', harga: 300000, tanggal_checkin: d(Y,M,TODAY.getDate()-1), tanggal_checkout: d(Y,M,TODAY.getDate()+1), status: 'Check In' },
]

export default {
  name: 'Dashboard',
  data() {
    const now = new Date()
    return {
      loading: false,
      // Stats (dihitung dari dummy)
      stats: {},
      allReservasi: DUMMY_RESERVASI,
      allKamar: DUMMY_KAMAR,
      // Calendar state
      calendarYear: now.getFullYear(),
      calendarMonth: now.getMonth(), // 0-indexed
      selectedDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      activeKamarTab: 'semua',
    }
  },
  computed: {
    // ── Stats ────────────────────────────────
    todayDate() {
      return new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    occupancyRate() {
      const total = this.allKamar.length
      if (!total) return 0
      return Math.round((this.allKamar.filter(k => k.status === 'Terisi').length / total) * 100)
    },
    statCards() {
      return [
        { key: 'kamar', label: 'Total Kamar', value: this.allKamar.length, hint: 'Keseluruhan kamar hotel', color: 'purple', icon: 'fa-solid fa-bed', pct: '100%' },
        { key: 'tamu',  label: 'Total Tamu',  value: 5,                    hint: 'Tamu terdaftar',          color: 'emerald', icon: 'fa-solid fa-users', pct: '70%' },
        { key: 'res',   label: 'Total Reservasi', value: this.allReservasi.length, hint: 'Reservasi tercatat', color: 'sky', icon: 'fa-solid fa-calendar-check', pct: '55%' },
      ]
    },
    // ── Kamar tabs ───────────────────────────
    kamarTabs() {
      return [
        { label: 'Semua',  value: 'semua',  count: this.allKamar.length },
        { label: 'Kosong', value: 'Kosong', count: this.allKamar.filter(k => k.status === 'Kosong').length },
        { label: 'Terisi', value: 'Terisi', count: this.allKamar.filter(k => k.status === 'Terisi').length },
      ]
    },
    filteredKamarList() {
      if (this.activeKamarTab === 'semua') return this.allKamar
      return this.allKamar.filter(k => k.status === this.activeKamarTab)
    },
    // ── Calendar ─────────────────────────────
    monthName() {
      return new Date(this.calendarYear, this.calendarMonth, 1)
        .toLocaleDateString('id-ID', { month: 'long' })
    },
    calendarCells() {
      const firstDay = new Date(this.calendarYear, this.calendarMonth, 1).getDay() // 0=Sun
      const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate()
      const daysInPrev  = new Date(this.calendarYear, this.calendarMonth, 0).getDate()
      const today = new Date(); today.setHours(0,0,0,0)
      const cells = []

      // Prev month filler
      for (let i = firstDay - 1; i >= 0; i--) {
        const dt = new Date(this.calendarYear, this.calendarMonth - 1, daysInPrev - i)
        cells.push({ day: daysInPrev - i, date: dt, isCurrentMonth: false, isToday: false })
      }
      // Current month
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(this.calendarYear, this.calendarMonth, d)
        cells.push({ day: d, date: dt, isCurrentMonth: true, isToday: dt.getTime() === today.getTime() })
      }
      // Next month filler (fill to complete grid of 42)
      const rem = 42 - cells.length
      for (let d = 1; d <= rem; d++) {
        const dt = new Date(this.calendarYear, this.calendarMonth + 1, d)
        cells.push({ day: d, date: dt, isCurrentMonth: false, isToday: false })
      }
      return cells
    },
    selectedDateLabel() {
      if (!this.selectedDate) return 'Pilih Tanggal'
      return this.selectedDate.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    },
    selectedDayEvents() {
      if (!this.selectedDate) return []
      return this.getEventsForDate(this.selectedDate)
    },
  },
  mounted() {
    // Compute stats from dummy
    this.stats = {
      total_kamar: this.allKamar.length,
      total_tamu: 5,
      total_reservasi: this.allReservasi.length,
      kamar_kosong: this.allKamar.filter(k => k.status === 'Kosong').length,
      kamar_terisi: this.allKamar.filter(k => k.status === 'Terisi').length,
    }
  },
  methods: {
    // ── Calendar helpers ──────────────────────
    prevMonth() {
      if (this.calendarMonth === 0) { this.calendarMonth = 11; this.calendarYear-- }
      else this.calendarMonth--
    },
    nextMonth() {
      if (this.calendarMonth === 11) { this.calendarMonth = 0; this.calendarYear++ }
      else this.calendarMonth++
    },
    goToToday() {
      const now = new Date()
      this.calendarYear  = now.getFullYear()
      this.calendarMonth = now.getMonth()
      this.selectedDate  = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    },
    selectDate(date) {
      this.selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    },
    isSameDay(a, b) {
      if (!a || !b) return false
      return a.getFullYear() === b.getFullYear() &&
             a.getMonth()    === b.getMonth()    &&
             a.getDate()     === b.getDate()
    },
    getEventsForDate(date) {
      if (!date) return []
      const events = []
      this.allReservasi.forEach(r => {
        const cin  = new Date(r.tanggal_checkin);  cin.setHours(0,0,0,0)
        const cout = new Date(r.tanggal_checkout); cout.setHours(0,0,0,0)
        const d    = new Date(date);               d.setHours(0,0,0,0)
        if (cin.getTime()  === d.getTime()) events.push({ ...r, type: 'checkin' })
        if (cout.getTime() === d.getTime()) events.push({ ...r, type: 'checkout' })
      })
      return events
    },
    // ── Format helpers ────────────────────────
    formatDateShort(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    },
    formatDateFull(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    },
    calcNight(cin, cout) {
      const a = new Date(cin); const b = new Date(cout)
      const diff = Math.ceil(Math.abs(b - a) / 86400000)
      return diff > 0 ? diff : 1
    },
    formatHarga(h) {
      if (h >= 1000000) return 'Rp ' + (h/1000000).toFixed(1).replace('.0','') + 'jt'
      if (h >= 1000)    return 'Rp ' + (h/1000).toFixed(0) + 'rb'
      return 'Rp ' + h
    },
  }
}
</script>

<style scoped>
.dashboard { animation: fadeUp 0.4s ease both; }
@keyframes fadeUp {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}

/* ─── Header ────────────────────── */
.header-date {
  display:flex; align-items:center; gap:8px;
  font-size:.85rem; color:var(--text-muted);
  background:var(--bg-card); border:1px solid var(--border-color);
  border-radius:var(--radius-md); padding:10px 16px; white-space:nowrap;
}
.dot-xs { font-size:.45rem; }

/* ─── Stats Grid ────────────────── */
.stats-grid {
  display:grid; grid-template-columns:repeat(3,1fr);
  gap:20px; margin-bottom:20px;
}
.stat-card {
  border-radius:var(--radius-lg); overflow:hidden;
  border:1px solid var(--border-color); background:var(--bg-card);
  transition:var(--transition);
}
.stat-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,.4); }
.stat-card-inner { display:flex; align-items:flex-start; justify-content:space-between; padding:24px; gap:16px; }
.stat-label  { font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--text-muted); margin:0 0 8px; }
.stat-value  { font-size:2.6rem; font-weight:800; color:var(--text-primary); line-height:1; margin:0 0 6px; letter-spacing:-.04em; }
.stat-hint   { font-size:.78rem; color:var(--text-muted); margin:0; }
.stat-icon-wrap { width:56px; height:56px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0; }
.stat-icon-wrap.purple  { background:rgba(139,92,246,.15); color:var(--accent-primary); }
.stat-icon-wrap.emerald { background:rgba(16,185,129,.15); color:var(--emerald); }
.stat-icon-wrap.sky     { background:rgba(14,165,233,.15); color:var(--sky); }
.stat-progress { height:3px; background:rgba(255,255,255,.05); }
.stat-progress-bar { height:100%; border-radius:2px; transition:width 1.2s cubic-bezier(.4,0,.2,1); }
.stat-progress-bar.purple  { background:linear-gradient(90deg,var(--accent-primary),#6d28d9); }
.stat-progress-bar.emerald { background:linear-gradient(90deg,var(--emerald),#059669); }
.stat-progress-bar.sky     { background:linear-gradient(90deg,var(--sky),#0284c7); }

/* ─── Room Status ───────────────── */
.room-status-grid {
  display:grid; grid-template-columns:repeat(3,1fr);
  gap:20px; margin-bottom:24px;
}
.room-status-card {
  background:var(--bg-card); border:1px solid var(--border-color);
  border-radius:var(--radius-lg); padding:22px;
  display:flex; align-items:center; gap:16px;
  transition:var(--transition); position:relative; overflow:hidden;
}
.room-status-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.room-status-card.available::before { background:linear-gradient(90deg,var(--emerald),#34d399); }
.room-status-card.occupied::before  { background:linear-gradient(90deg,var(--rose),#fb7185); }
.room-status-card.rate::before      { background:linear-gradient(90deg,var(--gold),var(--gold-light)); }
.room-status-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-card); }
.room-status-icon { width:48px; height:48px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
.available .room-status-icon { background:rgba(16,185,129,.12); color:var(--emerald); }
.occupied  .room-status-icon { background:rgba(244,63,94,.12);  color:var(--rose); }
.rate      .room-status-icon { background:rgba(245,158,11,.12); color:var(--gold); }
.room-status-info { flex:1; }
.room-status-label { font-size:.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.06em; margin:0 0 4px; }
.room-status-value { font-size:2rem; font-weight:800; color:var(--text-primary); margin:0; letter-spacing:-.03em; }
.room-status-badge { font-size:.72rem; font-weight:600; padding:4px 10px; border-radius:20px; display:flex; align-items:center; gap:5px; white-space:nowrap; }
.available-badge { background:rgba(16,185,129,.12); color:var(--emerald); border:1px solid rgba(16,185,129,.2); }
.occupied-badge  { background:rgba(244,63,94,.12);  color:var(--rose);    border:1px solid rgba(244,63,94,.2); }
.occupancy-ring-wrap { width:48px; height:48px; flex-shrink:0; }
.occupancy-svg { width:100%; height:100%; }

/* ═══════════════════════════════════
   CALENDAR SECTION
═══════════════════════════════════ */
.calendar-section {
  display:grid;
  grid-template-columns: 380px 1fr;
  gap:20px;
  margin-bottom:24px;
  align-items:start;
}

/* ─── Calendar Card ─────────────── */
.calendar-card { padding:0; overflow:hidden; }

.cal-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:20px 20px 16px;
  border-bottom:1px solid var(--border-color);
}
.cal-nav-btn {
  width:32px; height:32px;
  display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,.04);
  border:1px solid var(--border-color);
  border-radius:8px;
  color:var(--text-secondary);
  cursor:pointer;
  transition:var(--transition);
  font-size:.8rem;
}
.cal-nav-btn:hover { background:rgba(139,92,246,.15); border-color:rgba(139,92,246,.3); color:var(--accent-primary); }
.cal-title { display:flex; flex-direction:column; align-items:center; }
.cal-month { font-size:1rem; font-weight:700; color:var(--text-primary); line-height:1.2; text-transform:capitalize; }
.cal-year  { font-size:.78rem; color:var(--text-muted); }

.cal-days-header {
  display:grid; grid-template-columns:repeat(7,1fr);
  padding:10px 12px 4px;
}
.cal-days-header span {
  text-align:center; font-size:.7rem; font-weight:700;
  color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em;
}

.cal-grid {
  display:grid; grid-template-columns:repeat(7,1fr);
  padding:4px 12px 12px; gap:2px;
}

.cal-cell {
  position:relative; min-height:46px;
  display:flex; flex-direction:column; align-items:center;
  padding:6px 2px 4px;
  border-radius:8px;
  cursor:pointer;
  transition:var(--transition);
  user-select:none;
}
.cal-cell:hover:not(.other-month) { background:rgba(255,255,255,.05); }
.cal-cell.other-month { opacity:.3; cursor:default; }

.cal-day-num {
  font-size:.82rem; font-weight:500;
  color:var(--text-primary); line-height:1;
}
.cal-cell.other-month .cal-day-num { color:var(--text-muted); }

/* Today highlight */
.cal-cell.today { background:rgba(139,92,246,.12); border:1px solid rgba(139,92,246,.3); }
.cal-cell.today .cal-day-num { color:var(--accent-primary); font-weight:800; }

/* Selected */
.cal-cell.selected { background:linear-gradient(135deg,rgba(139,92,246,.25),rgba(109,40,217,.2)); border:1px solid rgba(139,92,246,.5); }
.cal-cell.selected .cal-day-num { color:#c4b5fd; font-weight:700; }

/* Has event */
.event-dots { display:flex; gap:3px; margin-top:4px; justify-content:center; }
.event-dot {
  width:5px; height:5px; border-radius:50%;
}
.dot-checkin  { background:var(--emerald); }
.dot-checkout { background:var(--rose); }

/* Legend */
.cal-legend {
  display:flex; gap:16px; justify-content:center;
  padding:12px 16px;
  border-top:1px solid var(--border-color);
}
.legend-item { display:flex; align-items:center; gap:6px; font-size:.72rem; color:var(--text-muted); }
.legend-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.legend-today-box {
  width:14px; height:14px; border-radius:4px;
  background:rgba(139,92,246,.2); border:1px solid rgba(139,92,246,.4);
  flex-shrink:0;
}

/* ─── Detail Card ───────────────── */
.detail-card { padding:0; overflow:hidden; }

.detail-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:20px; border-bottom:1px solid var(--border-color); gap:12px; flex-wrap:wrap;
}
.detail-title-wrap { display:flex; align-items:center; gap:12px; }
.detail-icon {
  width:42px; height:42px; border-radius:12px;
  background:rgba(14,165,233,.12); color:var(--sky);
  display:flex; align-items:center; justify-content:center;
  font-size:1rem; flex-shrink:0;
}
.detail-title   { font-size:.95rem; font-weight:700; color:var(--text-primary); margin:0 0 2px; }
.detail-subtitle { font-size:.75rem; color:var(--text-muted); margin:0; }

.go-today-btn {
  display:flex; align-items:center; gap:6px;
  padding:7px 14px;
  background:rgba(139,92,246,.1);
  border:1px solid rgba(139,92,246,.25);
  border-radius:8px;
  color:var(--accent-primary);
  font-size:.78rem; font-weight:600;
  cursor:pointer; transition:var(--transition);
  white-space:nowrap;
  font-family:'Inter',sans-serif;
}
.go-today-btn:hover { background:rgba(139,92,246,.2); }

.detail-empty {
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; padding:60px 20px; gap:12px;
}
.detail-empty-icon {
  width:56px; height:56px; border-radius:50%;
  background:rgba(255,255,255,.04);
  display:flex; align-items:center; justify-content:center;
  font-size:1.4rem; color:var(--text-muted);
}
.detail-empty p    { font-size:.9rem; color:var(--text-secondary); font-weight:500; margin:0; }
.detail-empty span { font-size:.78rem; color:var(--text-muted); }

.detail-events {
  display:flex; flex-direction:column; gap:0;
  overflow-y:auto; max-height:360px;
}

/* Event Card */
.event-card {
  display:flex;
  border-bottom:1px solid var(--border-color);
  transition:var(--transition);
}
.event-card:last-child { border-bottom:none; }
.event-card:hover { background:rgba(255,255,255,.02); }

.event-type-bar {
  width:3px; flex-shrink:0;
}
.event-checkin  .event-type-bar { background:var(--emerald); }
.event-checkout .event-type-bar { background:var(--rose); }

.event-body { flex:1; padding:16px; }
.event-top  { display:flex; align-items:center; gap:12px; margin-bottom:12px; }

.event-avatar {
  width:40px; height:40px; border-radius:50%;
  background:linear-gradient(135deg,var(--accent-primary),#6d28d9);
  display:flex; align-items:center; justify-content:center;
  font-size:1rem; font-weight:700; color:white; flex-shrink:0;
}
.event-main { flex:1; min-width:0; }
.event-guest {
  font-size:.9rem; font-weight:700; color:var(--text-primary);
  margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.event-room {
  font-size:.75rem; color:var(--text-muted); margin:0;
  display:flex; align-items:center; gap:5px;
}
.event-tipe {
  background:rgba(14,165,233,.1); color:var(--sky);
  padding:1px 6px; border-radius:4px; font-size:.68rem; font-weight:600;
}

.event-type-badge {
  display:flex; align-items:center; gap:6px;
  padding:5px 10px; border-radius:20px;
  font-size:.75rem; font-weight:600; white-space:nowrap;
  flex-shrink:0;
}
.badge-checkin  { background:rgba(16,185,129,.12); color:var(--emerald); border:1px solid rgba(16,185,129,.2); }
.badge-checkout { background:rgba(244,63,94,.12);  color:var(--rose);    border:1px solid rgba(244,63,94,.2); }

.event-dates { display:flex; flex-direction:column; gap:6px; }
.event-date-item {
  display:flex; align-items:center; gap:8px;
  font-size:.78rem; color:var(--text-muted);
}
.event-date-item i { width:14px; text-align:center; color:var(--text-muted); font-size:.75rem; }
.event-date-item span { color:var(--text-secondary); }

/* ─── Bottom Grid ───────────────── */
.bottom-grid {
  display:grid; grid-template-columns:1fr 1fr;
  gap:20px; margin-bottom:24px;
}
.section-card { display:flex; flex-direction:column; }
.section-card-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:20px 20px 16px; border-bottom:1px solid var(--border-color); gap:12px;
}
.section-card-title { display:flex; align-items:center; gap:12px; }
.section-card-title h3 { font-size:.95rem; font-weight:700; color:var(--text-primary); margin:0 0 2px; }
.section-card-title p  { font-size:.75rem; color:var(--text-muted); margin:0; }
.section-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:.9rem; flex-shrink:0; }
.section-icon.sky    { background:rgba(14,165,233,.15); color:var(--sky); }
.section-icon.purple { background:rgba(139,92,246,.15); color:var(--accent-primary); }
.view-all-link { display:inline-flex; align-items:center; gap:6px; font-size:.78rem; font-weight:600; color:var(--accent-primary); text-decoration:none; transition:var(--transition); white-space:nowrap; }
.view-all-link:hover { color:#a78bfa; gap:8px; }
.section-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; gap:10px; }
.section-empty .empty-state-icon { width:52px; height:52px; background:rgba(139,92,246,.08); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem; color:var(--accent-primary); }
.section-empty p { font-size:.85rem; color:var(--text-muted); margin:0; }

/* Reservasi List */
.reservasi-list { display:flex; flex-direction:column; overflow-y:auto; max-height:300px; }
.reservasi-item { display:flex; align-items:center; gap:12px; padding:13px 20px; transition:var(--transition); border-bottom:1px solid var(--border-color); }
.reservasi-item:last-child { border-bottom:none; }
.reservasi-item:hover { background:rgba(255,255,255,.02); }
.res-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--accent-primary),#6d28d9); display:flex; align-items:center; justify-content:center; font-size:.9rem; font-weight:700; color:white; flex-shrink:0; }
.res-info { flex:1; min-width:0; }
.res-name   { font-size:.875rem; font-weight:600; color:var(--text-primary); margin:0 0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.res-detail { font-size:.75rem; color:var(--text-muted); margin:0; display:flex; align-items:center; gap:5px; }
.res-tipe   { background:rgba(14,165,233,.1); color:var(--sky); padding:1px 6px; border-radius:4px; font-size:.68rem; font-weight:600; }
.res-dates  { flex-shrink:0; text-align:right; }
.res-date-range { font-size:.72rem; color:var(--text-muted); margin:0 0 5px; display:flex; align-items:center; gap:4px; justify-content:flex-end; }

/* Kamar filter */
.kamar-filter-tabs { display:flex; gap:6px; padding:14px 20px 12px; border-bottom:1px solid var(--border-color); }
.filter-tab { display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:20px; font-size:.78rem; font-weight:600; cursor:pointer; border:1px solid var(--border-color); background:transparent; color:var(--text-muted); transition:var(--transition); font-family:'Inter',sans-serif; }
.filter-tab:hover { color:var(--text-primary); background:rgba(255,255,255,.04); }
.filter-tab.active { background:rgba(139,92,246,.15); border-color:rgba(139,92,246,.3); color:var(--accent-primary); }
.tab-count { background:rgba(255,255,255,.08); border-radius:10px; padding:1px 7px; font-size:.68rem; }
.filter-tab.active .tab-count { background:rgba(139,92,246,.2); color:var(--accent-primary); }
.kamar-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(90px,1fr)); gap:10px; padding:16px; overflow-y:auto; max-height:280px; }
.kamar-tile { border-radius:var(--radius-md); padding:12px 10px; border:1px solid var(--border-color); position:relative; overflow:hidden; transition:var(--transition); cursor:default; }
.kamar-tile:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.3); }
.tile-kosong { background:rgba(16,185,129,.06); border-color:rgba(16,185,129,.15); }
.tile-terisi { background:rgba(244,63,94,.06);  border-color:rgba(244,63,94,.15); }
.tile-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
.tile-number { font-size:.85rem; font-weight:700; color:var(--text-primary); }
.tile-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.dot-green { background:var(--emerald); box-shadow:0 0 6px rgba(16,185,129,.6); }
.dot-red   { background:var(--rose);    box-shadow:0 0 6px rgba(244,63,94,.6); }
.tile-tipe  { font-size:.68rem; color:var(--text-muted); font-weight:500; margin:0 0 4px; text-transform:uppercase; letter-spacing:.04em; }
.tile-harga { font-size:.72rem; font-weight:600; color:var(--text-secondary); margin:0; }
.tile-status-bar { position:absolute; bottom:0; left:0; right:0; height:2px; }
.bar-green { background:linear-gradient(90deg,var(--emerald),#34d399); }
.bar-red   { background:linear-gradient(90deg,var(--rose),#fb7185); }

/* Quick Actions */
.section-title { font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:14px; letter-spacing:-.01em; }
.quick-actions-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.quick-action-item { display:flex; align-items:center; gap:12px; padding:16px 18px; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); text-decoration:none; color:var(--text-secondary); font-size:.875rem; font-weight:500; transition:var(--transition); }
.quick-action-item:hover { background:var(--bg-card-hover); border-color:rgba(139,92,246,.25); color:var(--text-primary); transform:translateX(4px); }
.quick-action-item:hover .qa-arrow { transform:translateX(3px); color:var(--accent-primary); }
.qa-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:.9rem; flex-shrink:0; }
.qa-icon.purple  { background:rgba(139,92,246,.15); color:var(--accent-primary); }
.qa-icon.emerald { background:rgba(16,185,129,.15); color:var(--emerald); }
.qa-icon.sky     { background:rgba(14,165,233,.15); color:var(--sky); }
.qa-arrow { margin-left:auto; font-size:.75rem; color:var(--text-muted); transition:all .2s ease; }

/* ─── Responsive ────────────────── */
@media (max-width:1280px) {
  .calendar-section { grid-template-columns:1fr; }
}
@media (max-width:1024px) {
  .stats-grid        { grid-template-columns:repeat(2,1fr); }
  .room-status-grid  { grid-template-columns:repeat(2,1fr); }
  .bottom-grid       { grid-template-columns:1fr; }
  .quick-actions-grid { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:640px) {
  .stats-grid         { grid-template-columns:1fr; }
  .room-status-grid   { grid-template-columns:1fr; }
  .quick-actions-grid { grid-template-columns:1fr; }
  .header-date        { display:none; }
  .stat-value         { font-size:2rem; }
  .cal-cell           { min-height:38px; }
  .cal-day-num        { font-size:.75rem; }
}
</style>
