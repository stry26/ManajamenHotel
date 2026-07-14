<template>
  <div class="bg-dark text-white border-end" id="sidebar-wrapper">
    <div class="sidebar-heading text-center py-4 fs-4 fw-bold border-bottom border-secondary">
      <i class="fa-solid fa-hotel text-warning me-2"></i>HotelEase
    </div>
    <div class="list-group list-group-flush mt-3">
      <router-link to="/" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3 ps-4">
        <i class="fa-solid fa-gauge me-3"></i>Dashboard
      </router-link>
      <router-link to="/kamar" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3 ps-4">
        <i class="fa-solid fa-bed me-3"></i>Kamar
      </router-link>
      <router-link to="/tamu" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3 ps-4">
        <i class="fa-solid fa-users me-3"></i>Tamu
      </router-link>
      <router-link to="/reservasi" class="list-group-item list-group-item-action bg-dark text-white border-0 py-3 ps-4">
        <i class="fa-solid fa-book me-3"></i>Reservasi
      </router-link>
    </div>
  </div>
</template>

<style scoped>
#sidebar-wrapper {
  min-height: 100vh;
  width: 250px;
  transition: margin .25s ease-out;
}
.list-group-item.router-link-active {
  background-color: #0d6efd !important;
  font-weight: bold;
}
.list-group-item:hover:not(.router-link-active) {
  background-color: #343a40 !important;
}
</style>
