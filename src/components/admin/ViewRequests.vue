<template>
  <div>
    <h4>Student Applications</h4>

    <div v-if="isLoading">Loading submissions...</div>
    <div v-else-if="error">
      <p>Error fetching submissions: {{ error }}</p>
    </div>

    <div v-else>
      <!-- Container for filters in one row -->
      <div class="filters-row">
        <div class="filter-item">
          <label for="statusSelect" class="form-label">Filter by Status:</label>
          <select id="statusSelect" class="form-select" v-model="selectedStatus">
            <option value="all">All</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="timeSelect" class="form-label">Filter by Time:</label>
          <select id="timeSelect" class="form-select" v-model="selectedTime">
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>
        </div>
      </div>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>CV File Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in filteredSubmissions" :key="submission.id">
            <td>{{ submission.name }}</td>
            <td>{{ submission.email }}</td>
            <td>{{ submission.cv_path.split('/').pop() }}</td>
            <td>{{ submission.status }}</td>
            <td>
              <button class="btn btn-primary" v-if="submission.status === 'Pending'" @click="openModal(submission)">
                <i class="fas fa-pen-to-square"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h5>Change Submission Status</h5>
          <p><strong>User Name:</strong> {{ currentSubmission.name }}</p>
          <p><strong>Email:</strong> {{ currentSubmission.email }}</p>
          <div class="button-group">
            <button class="btn btn-success" @click="acceptSubmission">Accept</button>
            <button class="btn btn-danger" @click="rejectSubmission">Reject</button>
          </div>
          <div v-if="actionMessage" class="alert alert-info mt-3">{{ actionMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getSubmissions, acceptSubmissionApi, rejectSubmissionApi } from '../../services/apiServices';

const isLoading = ref(true);
const submissions = ref([]);
const selectedStatus = ref('all');
const selectedTime = ref('new'); // New filter for time
const error = ref(null);
const isModalOpen = ref(false);
const currentSubmission = ref({});
const actionMessage = ref("");

// Computed property for filtered submissions based on selectedStatus and selectedTime
const filteredSubmissions = computed(() => {
  let filtered = submissions.value;

  // Filter by Status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(submission => submission.status === selectedStatus.value);
  }

  // Sort by Time (newest or oldest first)
  if (selectedTime.value === 'new') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else {
    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  return filtered;
});

// Fetch submissions from API
const fetchSubmissions = async () => {
  try {
    isLoading.value = true;

    const response = await getSubmissions();
    if (response.data && Array.isArray(response.data)) {
      submissions.value = response.data;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
// Open the modal
const openModal = (submission) => {
  currentSubmission.value = submission; // Set current submission
  isModalOpen.value = true; // Open modal
};

// Close the modal
const closeModal = () => {
  isModalOpen.value = false;
  actionMessage.value = ""; // Reset message
};

// Accept submission
const acceptSubmission = async () => {
  try {
    const token = localStorage.getItem('token');
    await acceptSubmissionApi(currentSubmission.value.id, token);
    actionMessage.value = "Submission accepted!";
    await fetchSubmissions();
  } catch (err) {
    error.value = err.message;
  } finally {
    closeModal();
  }
};

// Reject submission
const rejectSubmission = async () => {
  try {
    const token = localStorage.getItem('token');
    await rejectSubmissionApi(currentSubmission.value.id, token);
    actionMessage.value = "Submission rejected!";
    await fetchSubmissions();
  } catch (err) {
    error.value = err.message;
  } finally {
    closeModal();
  }
};

// Fetch submissions on component mount
onMounted(() => {
  fetchSubmissions();
});
</script>

<style scoped>
.filters-row {
  display: flex;
  gap: 20px; /* Adds space between filters */
  margin-bottom: 20px;
}

.filter-item {
  flex: 1; /* Make each filter take equal space */
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
}

.close {
  color: #000;
  text-align: right;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
