<template>
  <header class="navbar-modern">
    <!-- Hamburger -->
    <button class="hamburger-btn" @click="$emit('toggle-sidebar')" id="nav-menu-toggle" aria-label="Toggle Sidebar">
      <i class="fa-solid fa-bars"></i>
    </button>

    <!-- Breadcrumb / Page Name -->
    <div class="nav-breadcrumb">
      <span class="breadcrumb-home">HotelEase</span>
      <i class="fa-solid fa-chevron-right breadcrumb-sep"></i>
      <span class="breadcrumb-current">{{ currentPage }}</span>
    </div>

    <!-- Right side -->
    <div class="nav-actions">
      <!-- Date/Time -->
      <div class="nav-datetime">
        <i class="fa-regular fa-clock"></i>
        <span>{{ currentTime }}</span>
      </div>

      <!-- Divider -->
      <div class="nav-divider"></div>

      <!-- User Dropdown -->
      <div class="nav-user dropdown">
        <button class="user-btn dropdown-toggle" data-bs-toggle="dropdown" id="nav-user-dropdown">
          <div class="user-avatar-sm">
            <i class="fa-solid fa-user-tie"></i>
          </div>
          <span class="user-name-sm">Admin</span>
          <i class="fa-solid fa-chevron-down caret-icon"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end dropdown-dark-modern">
          <li>
            <div class="dropdown-user-info">
              <div class="dropdown-avatar">
                <i class="fa-solid fa-user-tie"></i>
              </div>
              <div>
                <p class="dropdown-user-name">Administrator</p>
                <p class="dropdown-user-email">admin@hotelease.com</p>
              </div>
            </div>
          </li>
          <li><hr class="dropdown-divider-modern"></li>
          <li><a class="dropdown-item-modern" href="#"><i class="fa-solid fa-user"></i> Profil Saya</a></li>
          <li><a class="dropdown-item-modern" href="#"><i class="fa-solid fa-gear"></i> Pengaturan</a></li>
          <li><hr class="dropdown-divider-modern"></li>
          <li><a class="dropdown-item-modern danger" href="#"><i class="fa-solid fa-right-from-bracket"></i> Keluar</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  emits: ['toggle-sidebar'],
  data() {
    return {
      currentTime: ''
    }
  },
  computed: {
    currentPage() {
      const names = {
        '/': 'Dashboard',
        '/kamar': 'Manajemen Kamar',
        '/tamu': 'Manajemen Tamu',
        '/reservasi': 'Manajemen Reservasi'
      }
      return names[this.$route?.path] || 'Dashboard'
    }
  },
  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      })
    }
  }
}
</script>

<style scoped>
.navbar-modern {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  height: var(--navbar-height);
  background: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  z-index: 900;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Hamburger ─────────────────── */
.hamburger-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.9rem;
}
.hamburger-btn:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
  color: var(--accent-primary);
}

/* ─── Breadcrumb ────────────────── */
.nav-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  flex: 1;
}
.breadcrumb-home {
  color: var(--text-muted);
  font-weight: 500;
}
.breadcrumb-sep {
  font-size: 0.6rem;
  color: var(--text-muted);
}
.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 600;
}

/* ─── Nav Actions ───────────────── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.nav-datetime {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 6px 12px;
  font-variant-numeric: tabular-nums;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: var(--border-color);
}

/* ─── User ──────────────────────── */
.user-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 6px 12px 6px 8px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}
.user-btn:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.25);
}
.user-btn::after { display: none; } /* Remove BS dropdown arrow */

.user-avatar-sm {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}

.user-name-sm {
  font-size: 0.85rem;
  font-weight: 600;
}

.caret-icon {
  font-size: 0.6rem;
  color: var(--text-muted);
  transition: transform 0.2s;
}
.user-btn[aria-expanded="true"] .caret-icon {
  transform: rotate(180deg);
}

/* ─── Dropdown ──────────────────── */
.dropdown-dark-modern {
  background: var(--bg-card) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  border-radius: var(--radius-lg) !important;
  padding: 8px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
  min-width: 220px !important;
  margin-top: 8px !important;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}
.dropdown-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.dropdown-user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.dropdown-user-email {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 0;
}

.dropdown-divider-modern {
  border-color: var(--border-color) !important;
  margin: 6px 0 !important;
}

.dropdown-item-modern {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.15s ease;
}
.dropdown-item-modern i {
  width: 16px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.dropdown-item-modern:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
}
.dropdown-item-modern.danger { color: var(--rose); }
.dropdown-item-modern.danger i { color: var(--rose); }
.dropdown-item-modern.danger:hover { background: rgba(244, 63, 94, 0.08); }

/* ─── Responsive ────────────────── */
@media (max-width: 768px) {
  .navbar-modern {
    left: 0;
    padding: 0 16px;
  }
  .nav-datetime { display: none; }
  .nav-divider { display: none; }
  .user-name-sm { display: none; }
  .breadcrumb-home { display: none; }
  .breadcrumb-sep { display: none; }
}

@media (max-width: 480px) {
  .navbar-modern { padding: 0 12px; gap: 10px; }
}
</style>
