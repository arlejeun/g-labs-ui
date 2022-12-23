<script setup lang="ts">

import { useUserStore } from '@/stores/user'
import { useMsal } from '@/composables/useMsal'
import { loginRequest } from '@/plugins/msal/msalConfig'

const { instance } = useMsal();

const store = useUserStore()
const { avatarUrl, username, userEmail, isRegistering, isActive, localization, isMobile } = storeToRefs(store)
const isAuthenticated = useIsAuthenticated();
const { logout } = store

// const { width } = useWindowSize()
// const isMobile = computed(() => width.value < 1200)
const isDark = useDark({ valueDark: 'dark-mode', valueLight: 'light-mode' })
const toggleDark = useToggle(isDark)

const isRegistrationPending = computed(() => isRegistering && isAuthenticated.value)

function mockSignIn() {
  instance.loginRedirect(loginRequest);
  //fetchUser()
}

async function mockSignOut() {
  await logout()
  //router.push('/')
  instance.logoutRedirect();
}

</script>

<template>
  <header class="navbar-light header-sticky">
    <!-- Logo Nav START -->
    <nav class="navbar navbar-expand-xl pt-0" :class="{ 'bg-primary': !isDark }">
      <div class="container">
        <!-- Logo START -->
        <router-link class="navbar-brand" to="/">
          <img class="light-mode-item navbar-brand-item" src="@/assets/images/genesys_monogram_detail.svg" alt="logo">
          <img class="dark-mode-item navbar-brand-item" src="@/assets/images/genesys_monogram_detail.svg" alt="logo">
        </router-link>
        <!-- Logo END -->

        <!-- Responsive navbar toggler -->
        <button class="navbar-toggler ms-auto mx-3 me-md-0 p-0 p-sm-2" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-animation white">
            <span />
            <span />
            <span />
          </span>
        </button>

        <!-- Main navbar START -->
        <div id="navbarCollapse" class="navbar-collapse collapse">
          <ul class="navbar-nav navbar-nav-scroll" :class="{ 'bg-secondary': isMobile }" v-show="isActive">
            <!-- Nav item Listing -->
            <li class="nav-item dropdown">
              <router-link class="nav-link text-white fw-bolder" to="/workshops">
                Workshops
              </router-link>
            </li>

            <li class="nav-item dropdown">
              <router-link class="nav-link text-white fw-bolder" to="/environments">
                Environments
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <router-link class="nav-link text-white fw-bolder" to="/demos">
                My Space
              </router-link>
            </li>
            <!-- <li class="nav-item dropdown">
              <router-link
                class="nav-link text-white fw-bolder"
                to="/auth"
              >
                Auth
              </router-link>
            </li> -->
            <li class="nav-item dropdown">
              <router-link class="nav-link text-white fw-bolder" to="/admin">
                Administration
              </router-link>

            </li>

            <!-- <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="listingMenu" data-bs-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">Listings</a>
              <ul class="dropdown-menu" aria-labelledby="listingMenu">
                <li class="dropdown-submenu dropend">
                  <a class="dropdown-item dropdown-toggle" href="#">Hotel</a>
                  <ul class="dropdown-menu" data-bs-popper="none">
                    <li> <a class="dropdown-item" href="index.html">Hotel Home</a></li>
                    <li> <a class="dropdown-item" href="index-hotel-chain.html">Hotel Chain</a></li>
                    <li> <a class="dropdown-item" href="index-resort.html">Hotel Resort</a></li>
                    <li> <a class="dropdown-item" href="hotel-grid.html">Hotel Grid</a></li>
                    <li> <a class="dropdown-item" href="hotel-list.html">Hotel List</a></li>
                    <li> <a class="dropdown-item" href="hotel-detail.html">Hotel Detail</a></li>
                    <li> <a class="dropdown-item" href="room-detail.html">Room Detail</a></li>
                    <li> <a class="dropdown-item" href="hotel-booking.html">Hotel Booking</a></li>
                  </ul>
                </li>

                <li class="dropdown-submenu dropend">
                  <a class="dropdown-item dropdown-toggle" href="#">Flight</a>
                  <ul class="dropdown-menu" data-bs-popper="none">
                    <li> <a class="dropdown-item" href="index-flight.html">Flight Home</a></li>
                    <li> <a class="dropdown-item" href="flight-list.html">Flight List</a></li>
                    <li> <a class="dropdown-item" href="flight-detail.html">Flight Detail</a></li>
                    <li> <a class="dropdown-item" href="flight-booking.html">Flight Booking</a></li>
                  </ul>
                </li>

                <li class="dropdown-submenu dropend">
                  <a class="dropdown-item dropdown-toggle" href="#">Tour</a>
                  <ul class="dropdown-menu" data-bs-popper="none">
                    <li> <a class="dropdown-item" href="index-tour.html">Tour Home</a></li>
                    <li> <a class="dropdown-item" href="tour-grid.html">Tour Grid</a></li>
                    <li> <a class="dropdown-item" href="tour-detail.html">Tour Detail</a></li>
                    <li> <a class="dropdown-item" href="tour-booking.html">Tour Booking</a></li>
                  </ul>
                </li>

                <li class="dropdown-submenu dropend">
                  <a class="dropdown-item dropdown-toggle" href="#">Cab</a>
                  <ul class="dropdown-menu" data-bs-popper="none">
                    <li> <a class="dropdown-item" href="index-cab.html">Cab Home</a></li>
                    <li> <a class="dropdown-item" href="cab-list.html">Cab List</a></li>
                    <li> <a class="dropdown-item" href="cab-detail.html">Cab Detail</a></li>
                    <li> <a class="dropdown-item" href="cab-booking.html">Cab Booking</a></li>
                  </ul>
                </li>

                <!-->
          </ul>
        </div>
        <!-- Main navbar END -->

        <!-- Profile and Notification START -->
        <ul v-if="isActive" class="nav flex-row align-items-center list-unstyled ms-xl-auto">
          <!-- Notification dropdown START -->
          <!-- <li class="nav-item ms-0 ms-md-3 dropdown">
            <a
              class="nav-link p-0"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-bs-auto-close="outside"
            >
              <i class="bi bi-bell fa-fw fs-5 text-white" />
            </a>
            <span class="notif-badge animation-blink" />

            <div class="dropdown-menu dropdown-animation dropdown-menu-end dropdown-menu-size-md p-0 shadow-lg">
              <div class="card bg-transparent">
                <div class="card-header bg-transparent d-flex justify-content-between align-items-center border-bottom">
                  <h6 class="m-0">
                    Notifications <span class="badge bg-danger bg-opacity-10 text-danger ms-2">4
                      new</span>
                  </h6>
                  <a
                    class="small"
                    href="#"
                  >Clear all</a>
                </div>

                <div class="card-body p-0">
                  <ul class="list-group list-group-flush list-unstyled p-2">
                    <li>
                      <a
                        href="#"
                        class="list-group-item list-group-item-action rounded notif-unread border-0 mb-1 p-3"
                      >
                        <h6 class="mb-2">New! Booking flights from New York ✈️</h6>
                        <p class="mb-0 small">Find the flexible ticket on flights around the world. Start searching
                          today</p>
                        <span>Wednesday</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="list-group-item list-group-item-action rounded border-0 mb-1 p-3"
                      >
                        <h6 class="mb-2">Sunshine saving are here 🌞 save 30% or more on a stay</h6>
                        <span>15 Nov 2022</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="card-footer bg-transparent text-center border-top">
                  <a
                    href="#"
                    class="btn btn-sm btn-link mb-0 p-0"
                  >See all incoming activity</a>
                </div>
              </div>
            </div>
          </li> -->
          <!-- Notification dropdown END -->

          <!-- Profile dropdown START -->
          <li class="nav-item ms-3 dropdown">
            <!-- Avatar -->
            <a id="profileDropdown" class="avatar avatar-xs p-0" href="#" role="button" data-bs-auto-close="outside"
              data-bs-display="static" data-bs-toggle="dropdown" aria-expanded="false">
              <img class="avatar-img rounded-circle" :src="avatarUrl" alt="avatar">
            </a>

            <!-- Profile dropdown START -->
            <ul class="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3"
              aria-labelledby="profileDropdown">
              <!-- Profile info -->
              <li class="px-3 mb-3">
                <div class="d-flex align-items-center">
                  <!-- Avatar -->
                  <div class="avatar me-3">
                    <img class="avatar-img rounded-circle shadow" :src="avatarUrl" alt="avatar">
                  </div>
                  <div>
                    <a class="h6 mt-2 mt-sm-0" href="#">{{ username }}</a>
                    <!-- <p class="small m-0">
                      {{userEmail}}
                    </p> -->
                  </div>
                </div>
              </li>

              <!-- Links -->
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <router-link class="dropdown-item" to="/account/profile">
                  <i class="bi bi-bookmark-check fa-fw me-2" />My
                  Profile
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/account/customer">
                  <i class="bi bi-gear fa-fw me-2" />Customer Record
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/account/organizations">
                  <i class="bi bi-boxes fa-fw me-2" />Organizations
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/account/feedback">
                  <i class="bi bi-info-circle fa-fw me-2" />Feedback / Issues
                </router-link>
              </li>
              <li>
                <a class="dropdown-item" @click.stop.prevent="mockSignOut"><i class="bi bi-power fa-fw me-2" />Sign
                  Out</a>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>

              <!-- Dark mode switch START -->
              <li>
                <div id="darkModeSwitch" class="modeswitch-wrap">
                  <div class="modeswitch-item" @click="toggleDark()">
                    <div class="modeswitch-icon" />
                  </div>
                  <span>{{ isDark ? 'Dark mode' : 'Light mode' }}</span>
                </div>
              </li>
              <!-- Dark mode switch END -->
            </ul>
            <!-- Profile dropdown END -->
          </li>
          <!-- Profile dropdown END -->

          <!-- Button -->
          <!-- <li class="nav-item ms-3 d-none d-sm-block">
            <a class="btn btn-sm btn-primary-soft mb-0" href="#"><i class="bi bi-lightning-charge"></i> Upgrade now</a>
          </li> -->
        </ul>
        <!-- Profile and Notification START -->

        <ul v-if="!isAuthenticated" class="nav flex-row align-items-center list-unstyled ms-xl-auto">
          <li @click.stop.prevent="mockSignIn" class="nav-item"> <a class="nav-link text-white fw-bolder"><i
                class="bi bi-box-arrow-in-right me-2"></i>Sign In</a></li>
          <!-- Button -->
          <!-- <li class="nav-item ms-3 d-none d-sm-block">
            <a class="btn btn-sm btn-primary-soft mb-0" href="#"><i class="bi bi-lightning-charge"></i> Upgrade now</a>
          </li> -->
        </ul>

        <ul v-if="isAuthenticated && !isActive" class="nav flex-row align-items-center list-unstyled ms-xl-auto">
          <li @click.stop.prevent="mockSignOut" class="nav-item"> <a class="nav-link text-white fw-bolder"><i
                class="bi bi-box-arrow-in-right me-2"></i>Sign Out</a></li>
          <!-- Button -->
          <!-- <li class="nav-item ms-3 d-none d-sm-block">
            <a class="btn btn-sm btn-primary-soft mb-0" href="#"><i class="bi bi-lightning-charge"></i> Upgrade now</a>
          </li> -->
        </ul>

        <select v-model="localization" class="nav flex-row locale-select">
          <option value="en-US">English</option>
          <option value="es-ES">Spanish</option>
          <option value="pt-PT">Portugase</option>
        </select>


      </div>
    </nav>
    <!-- Logo Nav END -->
  </header>
</template>

<style>
.img-logo-next {
  float: left;
  padding: 8px 20px 8px 0;
}

.locale-select {
  margin-left: 30px !important;
}
</style>
