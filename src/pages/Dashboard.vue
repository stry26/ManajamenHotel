<template>
  <div>
    <h2 class="mb-4 fw-bold">Dashboard</h2>
    
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div v-else class="row g-4">
      <div class="col-md-4">
        <div class="card bg-primary text-white h-100 shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title text-uppercase fw-semibold mb-1">Total Kamar</h6>
                <h2 class="display-5 fw-bold mb-0">{{ data.total_kamar }}</h2>
              </div>
              <i class="fa-solid fa-bed fa-3x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card bg-success text-white h-100 shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title text-uppercase fw-semibold mb-1">Total Tamu</h6>
                <h2 class="display-5 fw-bold mb-0">{{ data.total_tamu }}</h2>
              </div>
              <i class="fa-solid fa-users fa-3x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card bg-info text-white h-100 shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title text-uppercase fw-semibold mb-1">Total Reservasi</h6>
                <h2 class="display-5 fw-bold mb-0">{{ data.total_reservasi }}</h2>
              </div>
              <i class="fa-solid fa-book fa-3x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mt-4">
        <div class="card bg-warning text-dark h-100 shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title text-uppercase fw-semibold mb-1">Kamar Kosong</h6>
                <h2 class="display-5 fw-bold mb-0">{{ data.kamar_kosong }}</h2>
              </div>
              <i class="fa-solid fa-door-open fa-3x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mt-4">
        <div class="card bg-danger text-white h-100 shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title text-uppercase fw-semibold mb-1">Kamar Terisi</h6>
                <h2 class="display-5 fw-bold mb-0">{{ data.kamar_terisi }}</h2>
              </div>
              <i class="fa-solid fa-door-closed fa-3x opacity-50"></i>
            </div>
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
      data: {
        total_kamar: 0,
        total_tamu: 0,
        total_reservasi: 0,
        kamar_kosong: 0,
        kamar_terisi: 0
      },
      loading: true
    }
  },
  async mounted() {
    try {
      const response = await api.get('/dashboard');
      this.data = response.data;
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.$swal.fire('Error', 'Gagal memuat data dashboard', 'error');
    } finally {
      this.loading = false;
    }
  }
}
</script>
