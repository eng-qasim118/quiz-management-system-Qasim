<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-primary sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Quiz System</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!isAuthenticated">
              <a class="nav-link text-white" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <i class="fa-regular fa-circle-user"></i>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-black" id="loginModalLabel">Login</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Login Form -->
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="email" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password" v-model="password" />
              </div>
              <p v-if="error" class="text-danger">{{ error }}</p>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from 'vuex'; // Import Vuex store
import { apiLogin } from '../services/apiServices';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter(); // Initialize Vue Router
const store = useStore(); // Initialize Vuex store

// Computed property to check authentication status
const isAuthenticated = computed(() => {
  return localStorage.getItem('token') !== null;
});

// Login function
async function login() {
  try {
    const response = await apiLogin({
      email: email.value,
      password: password.value,
    });

    console.log('Full API response:', response); // Log the full response for debugging

    // Check if response.data exists and has the expected fields
    if (response && response.data) {
      const access_token = response.data.access_token; // Access the token directly
      const userRole = response.data.role || 'admin'; // Default to 'admin' if role is not provided
      const permissions = response.data.permissions || []; // Handle permissions if available

      // Check if access_token is defined
      if (access_token) {
        // Store token and other details in localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('permissions', JSON.stringify(permissions));

        // Commit to Vuex store
        store.commit('setAuth', {
          isAuthenticated: true,
          role: userRole,
          permissions: permissions,
        });

        console.log('Updated Vuex state:', store.state);

        // Redirect to the dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Login failed: No access token found');
      }
    } else {
      throw new Error('Login failed: Invalid response structure');
    }
  } catch (error) {
    console.error('Login failed:', error);
    error.value = 'Invalid credentials or server error';
  }
}


</script>

<style scoped>
.navbar-brand {
  color: rgb(255, 255, 255);
  font-size: 25px;
  font-weight: bold;
}
.fa-regular{
  font-size: 25px;
  color: white;
}
</style>
