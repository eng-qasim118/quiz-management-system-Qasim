<template>
    <div>
      <section class="vh-50">
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
              <div class="card shadow-2-strong" style="border-radius: 1rem;">
                <div class="card-body p-5 text-center">
                  <h3 class="mb-5">Set Your Password</h3>

                  <!-- Email Field -->
                  <div class="form-outline mb-4">
                    <input v-model="email" type="email" class="form-control form-control-lg" placeholder="Email" />
                  </div>

                  <!-- Password Field -->
                  <div class="form-outline mb-4">
                    <input v-model="password" type="password" class="form-control form-control-lg" placeholder="New Password" />
                  </div>

                  <!-- Confirm Password Field -->
                  <div class="form-outline mb-4">
                    <input v-model="password_confirmation" type="password" class="form-control form-control-lg" placeholder="Confirm Password" />
                  </div>

                  <!-- Token Field -->
                  <div class="form-outline mb-4">
                    <input v-model="token" type="text" class="form-control form-control-lg" placeholder="Token" />
                  </div>

                  <!-- Submit Button -->
                  <button @click="setPassword" class="btn btn-primary btn-lg btn-block">Set Password</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>

    <script setup>
  import { ref } from 'vue';
  import { setPasswordApi } from '../services/apiServices'; // Import API service for setting password

  // Form fields using Vue Composition API
  const email = ref('');
  const password = ref('');
  const password_confirmation = ref('');
  const token = ref('');

  // Function to send POST request for setting password using the API service
  const setPassword = async () => {
    try {
      // Basic password confirmation validation
      if (password.value !== password_confirmation.value) {
        alert('Passwords do not match!');
        return;
      }

      // Call the API service to set the new password
      const response = await setPasswordApi({
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
        token: token.value,
      });

      // Check for successful response
      if (response.status === 200) {
        alert('Password set successfully');
        // Clear the form after success
        email.value = '';
        password.value = '';
        password_confirmation.value = '';
        token.value = '';
      }
    } catch (error) {
      console.error('Error setting password:', error);
      alert('Failed to set password. Please try again.');
    }
  };
  </script>
