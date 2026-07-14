<template>
  <div class="d-flex" id="wrapper">
    <Sidebar />
    
    <div id="page-content-wrapper" class="w-100">
      <Navbar />
      <div class="container-fluid p-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    Navbar
  }
}
</script>

<style>
#wrapper {
  overflow-x: hidden;
  min-height: 100vh;
}
#page-content-wrapper {
  background-color: #f8f9fa;
}
</style>
