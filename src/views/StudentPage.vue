<template>
  <div class="container-fluid">
    <TopNav />
    <div class="card bg-light row2">
      <article class="card-body mx-auto" style="max-width: 400px">
        <h4 class="card-title mt-3 text-center">Student Form</h4>

        <form @submit.prevent="registerUser">
          <div class="form-group input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fa fa-user"></i></span>
            </div>
            <input
              class="form-control"
              placeholder="Full name"
              type="text"
              v-model="name"
            />
          </div>

          <div class="form-group input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fa fa-envelope"></i></span>
            </div>
            <input
              class="form-control"
              placeholder="Email address"
              type="email"
              v-model="email"
            />
          </div>

          <div class="form-group input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fa fa-file"></i></span>
            </div>
            <input
              name="cv"
              class="form-control"
              placeholder="Upload CV"
              type="file"
              @change="handleFileUpload"
            />
            <p v-if="file">Selected file: {{ cv.name }}</p>
          </div>


          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block">
              Create Account
            </button>
          </div>
          <p class="text-center">Have an account? <a href="">Log In</a></p>
        </form>
      </article>
    </div>
    <BottomFooter/>
  </div>
</template>

<!-- <script setup>
import TopNav from '@/components/TopNav.vue';
import BottomFooter from '@/components/BottomFooter.vue';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // For navigation after successful registration

const name = ref('');
const email = ref('');
const cv = ref(null); // Define 'file'
const message = ref(''); // Message for success or error
const router = useRouter(); // Initialize router for navigation

// File upload handler
const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    cv.value = selectedFile; // Correct assignment to 'file'
  }
};

const registerUser = async () => {
  try {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('email', email.value);
    if (cv.value) {
      formData.append('cv', cv.value);
    }

    const response = await axios.post('http://192.168.15.90:8000/api/student/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('User registered:', response.data);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard'); // Navigate to dashboard
    }

    // Success message
    message.value = 'Registration successful!';

    // Optionally, reset form fields
    name.value = '';
    email.value = '';
    cv.value = null;
  } catch (error) {
    // Improved error logging
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    message.value = 'Registration failed'; // Show error message
  }
};

</script> -->
<script setup>
import TopNav from '@/components/TopNav.vue';
import BottomFooter from '@/components/BottomFooter.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // For navigation after successful registration
import { registerUserApi } from '../services/apiServices'; // Import the API service

const name = ref('');
const email = ref('');
const cv = ref(null); // Define 'file'
const message = ref(''); // Message for success or error
const router = useRouter(); // Initialize router for navigation

// File upload handler
const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    cv.value = selectedFile; // Correct assignment to 'file'
  }
};

const registerUser = async () => {
  try {
    // Use the service function to register the user
    const response = await registerUserApi(name.value, email.value, cv.value);

    console.log('User registered:', response);

    if (response.token) {
      localStorage.setItem('token', response.token);
      router.push('/dashboard'); // Navigate to dashboard
    }

    // Success message
    message.value = 'Registration successful!';

    // Optionally, reset form fields
    name.value = '';
    email.value = '';
    cv.value = null;
  } catch (error) {
    message.value = 'Registration failed'; // Show error message
  }
};

</script>

<style scoped>
.row2{
  padding: 95px 0px 90px 0px;
  background: rgb(255,251,251);
  background: radial-gradient(circle, rgba(255,251,251,1) 50%, rgba(225,225,225,1) 100%);
}
.divider-text {
  position: relative;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.divider-text span {
  padding: 7px;
  font-size: 12px;
  position: relative;
  z-index: 2;
}
.divider-text:after {
  content: '';
  position: absolute;
  width: 100%;
  border-bottom: 1px solid #ddd;
  top: 55%;
  left: 0;
  z-index: 1;
}
.btn-facebook {
  background-color: #405D9D;
  color: #fff;
}
.btn-twitter {
  background-color: #42AEEC;
  color: #fff;
}
</style>
