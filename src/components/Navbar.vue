<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
    <div class="container-fluid">
      <button class="btn btn-outline-secondary d-md-none me-2" id="menu-toggle">
        <i class="fa-solid fa-bars"></i>
      </button>
      
      <div class="ms-auto d-flex align-items-center">
        <div class="dropdown">
          <a class="nav-link dropdown-toggle text-dark fw-semibold" href="#" role="button" data-bs-toggle="dropdown">
            <i class="fa-solid fa-user-circle fs-5 me-1"></i> Admin
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
