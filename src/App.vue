<template>
  <div id="app-wrapper">
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <!-- Overlay for mobile -->
    <div 
      class="sidebar-overlay" 
      :class="{ active: sidebarOpen }" 
      @click="sidebarOpen = false"
    ></div>
    
    <div class="main-content" :class="{ 'sidebar-expanded': sidebarOpen }">
      <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <div class="page-container">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: { Sidebar, Navbar },
  data() {
    return {
      sidebarOpen: window.innerWidth >= 768
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      if (window.innerWidth >= 768) {
        this.sidebarOpen = true
      } else {
        this.sidebarOpen = false
      }
    }
  }
}
</script>

<style>
/* ─── CSS Design System ───────────────────────────────── */
:root {
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-card: #161d2e;
  --bg-card-hover: #1e2741;
  --bg-input: #1a2235;
  --border-color: rgba(255, 255, 255, 0.07);
  --border-focus: rgba(139, 92, 246, 0.5);

  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --accent-primary: #8b5cf6;
  --accent-secondary: #7c3aed;
  --accent-glow: rgba(139, 92, 246, 0.3);
  
  --gold: #f59e0b;
  --gold-light: #fbbf24;
  --emerald: #10b981;
  --rose: #f43f5e;
  --sky: #0ea5e9;
  --indigo: #6366f1;

  --sidebar-width: 260px;
  --navbar-height: 64px;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 30px rgba(139, 92, 246, 0.2);

  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Reset & Base ────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ─── Scrollbar ───────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

/* ─── Layout ──────────────────────────────────────────── */
#app-wrapper {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.page-container {
  flex: 1;
  padding: 28px 32px;
  margin-top: var(--navbar-height);
}

/* ─── Sidebar Overlay ─────────────────────────────────── */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.sidebar-overlay.active {
  opacity: 1;
}

/* ─── Page Transitions ────────────────────────────────── */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.25s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ─── Cards ───────────────────────────────────────────── */
.card-modern {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: var(--transition);
}
.card-modern:hover {
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: var(--shadow-card), 0 0 0 1px rgba(139, 92, 246, 0.1);
}

/* ─── Stat Cards ──────────────────────────────────────── */
.stat-card {
  border-radius: var(--radius-lg);
  padding: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%);
  pointer-events: none;
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* ─── Buttons ─────────────────────────────────────────── */
.btn-primary-modern {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
  box-shadow: 0 4px 15px var(--accent-glow);
  letter-spacing: 0.01em;
}
.btn-primary-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--accent-glow);
  background: linear-gradient(135deg, #9d6ff5, var(--accent-primary));
}
.btn-primary-modern:active { transform: translateY(0); }

.btn-danger-modern {
  background: rgba(244, 63, 94, 0.12);
  color: var(--rose);
  border: 1px solid rgba(244, 63, 94, 0.2);
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition);
}
.btn-danger-modern:hover {
  background: rgba(244, 63, 94, 0.22);
  border-color: rgba(244, 63, 94, 0.4);
  transform: translateY(-1px);
}

.btn-warning-modern {
  background: rgba(245, 158, 11, 0.12);
  color: var(--gold);
  border: 1px solid rgba(245, 158, 11, 0.2);
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition);
}
.btn-warning-modern:hover {
  background: rgba(245, 158, 11, 0.22);
  border-color: rgba(245, 158, 11, 0.4);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);
}
.btn-ghost:hover {
  background: rgba(255,255,255,0.05);
  color: var(--text-primary);
  border-color: rgba(255,255,255,0.15);
}

/* ─── Form Controls ───────────────────────────────────── */
.form-control-modern,
.form-select-modern {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 10px 14px;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: var(--transition);
  appearance: none;
}
.form-control-modern::placeholder { color: var(--text-muted); }
.form-control-modern:focus,
.form-select-modern:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--bg-input);
}
.form-select-modern {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 12px;
  padding-right: 36px;
  cursor: pointer;
}
.form-select-modern option {
  background: var(--bg-card);
  color: var(--text-primary);
}

.form-label-modern {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ─── Tables ──────────────────────────────────────────── */
.table-modern {
  width: 100%;
  border-collapse: collapse;
}
.table-modern thead tr {
  border-bottom: 1px solid var(--border-color);
}
.table-modern thead th {
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: left;
  background: transparent;
}
.table-modern tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}
.table-modern tbody tr:last-child { border-bottom: none; }
.table-modern tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}
.table-modern tbody td {
  padding: 14px 16px;
  font-size: 0.875rem;
  color: var(--text-primary);
  vertical-align: middle;
}

/* ─── Badges ──────────────────────────────────────────── */
.badge-modern {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.badge-success {
  background: rgba(16, 185, 129, 0.12);
  color: var(--emerald);
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.badge-danger {
  background: rgba(244, 63, 94, 0.12);
  color: var(--rose);
  border: 1px solid rgba(244, 63, 94, 0.2);
}
.badge-info {
  background: rgba(14, 165, 233, 0.12);
  color: var(--sky);
  border: 1px solid rgba(14, 165, 233, 0.2);
}
.badge-warning {
  background: rgba(245, 158, 11, 0.12);
  color: var(--gold);
  border: 1px solid rgba(245, 158, 11, 0.2);
}
.badge-gray {
  background: rgba(148, 163, 184, 0.1);
  color: var(--text-secondary);
  border: 1px solid rgba(148, 163, 184, 0.15);
}

/* ─── Modal ───────────────────────────────────────────── */
.modal-modern .modal-content {
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
  color: var(--text-primary);
}
.modal-modern .modal-header {
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
}
.modal-modern .modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}
.modal-modern .modal-body {
  padding: 24px;
}
.modal-modern .btn-close {
  filter: invert(1) brightness(0.7);
}
.modal-modern .btn-close:hover {
  filter: invert(1) brightness(1);
}

/* ─── Loading Spinner ─────────────────────────────────── */
.spinner-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: var(--text-muted);
  font-size: 0.875rem;
}
.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Page Header ─────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* ─── Search Bar ──────────────────────────────────────── */
.search-wrapper {
  position: relative;
}
.search-wrapper .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 0.85rem;
}
.search-wrapper .form-control-modern {
  padding-left: 36px;
}

/* ─── Empty State ─────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-state-icon {
  width: 64px;
  height: 64px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.5rem;
  color: var(--accent-primary);
}
.empty-state p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* ─── Divider ─────────────────────────────────────────── */
.divider {
  height: 1px;
  background: var(--border-color);
  margin: 20px 0;
}

/* ─── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .sidebar-overlay { display: block; pointer-events: none; }
  .sidebar-overlay.active { pointer-events: all; }

  .main-content {
    margin-left: 0 !important;
  }

  .page-container {
    padding: 20px 16px;
  }

  .page-title { font-size: 1.4rem; }
}

@media (max-width: 480px) {
  .page-container { padding: 16px 12px; }
  .page-header { flex-direction: column; align-items: flex-start; }
}

/* ─── Bootstrap Overrides ─────────────────────────────── */
.modal-backdrop { background-color: rgba(0,0,0,0.7) !important; }
</style>
