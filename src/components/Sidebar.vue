<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <i class="fa-solid fa-hotel"></i>
      </div>
      <div class="logo-text">
        <span class="logo-name">HotelEase</span>
        <span class="logo-tagline">Management System</span>
      </div>
    </div>

    <!-- Navigation Label -->
    <div class="nav-section-label">Menu Utama</div>

    <!-- Navigation Links -->
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" exact-active-class="active">
        <span class="nav-icon">
          <i class="fa-solid fa-gauge-high"></i>
        </span>
        <span class="nav-label">Dashboard</span>
        <span class="nav-indicator"></span>
      </router-link>

      <router-link to="/kamar" class="nav-item" active-class="active">
        <span class="nav-icon">
          <i class="fa-solid fa-bed"></i>
        </span>
        <span class="nav-label">Kamar</span>
        <span class="nav-indicator"></span>
      </router-link>

      <router-link to="/tamu" class="nav-item" active-class="active">
        <span class="nav-icon">
          <i class="fa-solid fa-users"></i>
        </span>
        <span class="nav-label">Tamu</span>
        <span class="nav-indicator"></span>
      </router-link>

      <router-link to="/reservasi" class="nav-item" active-class="active">
        <span class="nav-icon">
          <i class="fa-solid fa-calendar-check"></i>
        </span>
        <span class="nav-label">Reservasi</span>
        <span class="nav-indicator"></span>
      </router-link>
    </nav>

    <!-- Bottom Section -->
    <div class="sidebar-footer">
      <div class="sidebar-footer-user">
        <div class="user-avatar">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div class="user-info">
          <span class="user-name">Administrator</span>
          <span class="user-role">Super Admin</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isOpen: { type: Boolean, default: true }
  },
  emits: ['close']
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Subtle gradient overlay */
.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%);
  pointer-events: none;
}

/* ─── Logo ──────────────────────── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--accent-primary), #6d28d9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.logo-name {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.logo-tagline {
  display: block;
  font-size: 0.68rem;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 0.04em;
}

/* ─── Section Label ─────────────── */
.nav-section-label {
  padding: 20px 20px 8px;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ─── Navigation ────────────────── */
.sidebar-nav {
  flex: 1;
  padding: 4px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.04);
  opacity: 0;
  border-radius: var(--radius-md);
  transition: opacity 0.2s ease;
}

.nav-item:hover::before { opacity: 1; }
.nav-item:hover {
  color: var(--text-primary);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.15));
  color: var(--accent-primary);
  border: 1px solid rgba(139, 92, 246, 0.2);
}
.nav-item.active .nav-icon {
  color: var(--accent-primary);
}

.nav-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.nav-item:hover .nav-icon {
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-primary);
}

.nav-item.active .nav-icon {
  background: rgba(139, 92, 246, 0.2);
}

.nav-label {
  flex: 1;
  letter-spacing: 0.01em;
}

.nav-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-primary);
  opacity: 0;
  transition: opacity 0.2s ease;
}
.nav-item.active .nav-indicator { opacity: 1; }

/* ─── Footer ────────────────────── */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}

.sidebar-footer-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.user-name {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.user-role {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* ─── Responsive ────────────────── */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
