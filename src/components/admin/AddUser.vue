<template>
  <div>
    <!-- Add User Button -->
    <button
      type="button"
      class="btn btn-primary mb-3"
      data-bs-toggle="modal"
      data-bs-target="#addUserModal"
    >
      Add User
    </button>

    <!-- Role Filter -->
    <div class="mb-3">
      <label for="filterRole" class="form-label">Filter by Role:</label>
      <select
        class="form-select"
        id="filterRole"
        v-model="filterRole"
        @change="fetchUsers"
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="supervisor">Supervisor</option>
        <option value="manager">Manager</option>
      </select>
    </div>

    <!-- Add User Modal -->
    <div
      class="modal fade"
      id="addUserModal"
      tabindex="-1"
      aria-labelledby="addUserModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addUserModalLabel">Add User</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Add User Form -->
            <form @submit.prevent="addUser">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="name"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select class="form-select" id="role" v-model="role" required>
                  <option value="" disabled>Select role</option>
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="container py-2">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.role }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button  class="btn btn-warning btn-sm">
                Edit
              </button>
              <button  class="btn btn-danger btn-sm">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No Users Found -->
      <div v-if="users.length === 0" class="alert alert-info">
        No users found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { registerUser, getUsersByRole } from '../../services/apiServices';

// Reactive variables for the form
const name = ref('');
const email = ref('');
const role = ref('');

// Reactive variable for role filter
const filterRole = ref('');

// Reactive variable to store users
const users = ref([]);

// Function to fetch users by role
const fetchUsers = async () => {
  try {
    const response = await getUsersByRole(filterRole.value || null); // Handle empty filter case
    console.log('API Response:', JSON.stringify(response, null, 2)); // Log response to inspect structure

    // Check if response and the expected data structure exist
    if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
      users.value = response.data.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || filterRole.value || 'All',
      }));
    } else {
      // If response doesn't contain expected data, set users to an empty array
      users.value = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error.response?.data?.message || error.message); // More specific error logging
    alert('Failed to fetch users. Please try again.');
  }
};

// Fetch all users on component mount
onMounted(() => {
  fetchUsers();
});


// Add User function using the registerUser API endpoint
const addUser = async () => {
  if (name.value && email.value && role.value) {
    const userData = {
      name: name.value,
      email: email.value,
      role: role.value,
    };

    try {
      // Call the registerUser API function
      const result = await registerUser(userData);

      // If successful, close the modal and refresh the users list
      if (result) {
        // Reset form fields
        name.value = '';
        email.value = '';
        role.value = '';

        // Hide the modal using Bootstrap's modal instance
        const modalElement = document.getElementById('addUserModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        } else {
          // If modal instance is not found, create one and hide it
          const newModal = new window.bootstrap.Modal(modalElement);
          newModal.hide();
        }

        // Refresh the users list
        fetchUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user. Please try again.');
    }
  } else {
    alert('Please fill in all fields.');
  }
};



// Delete User function

</script>

<style scoped>
/* Optional: Add any custom styles here */
</style>
