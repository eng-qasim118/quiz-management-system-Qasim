
<template>
  <div>
    <h1>Assigned Quizzes</h1>

    <p v-if="error">{{ error }}</p>

    <table v-if="quizzes.length" class="table table-bordered">
      <thead class="thead-light">
        <tr>
          <th>Quiz Name</th>
          <th>Duration (hours)</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quiz in quizzes" :key="quiz.id">
          <td>{{ quiz.quiz.quiz_name }}</td>
          <td>{{ quiz.quiz.duration }}</td>
          <td>{{ quiz.attempt === 0 ? 'Not Attempted' : 'Attempted' }}</td>
          <td>
            <button
              v-if="quiz.attempt === 0"
              class="btn btn-primary"
              style="background-color: blue; border-color: blue"
              @click="startQuiz(quiz.quiz_id)"
            >
              Start Quiz
            </button>
            <span v-else>Already Attempted</span>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!quizzes.length && !error">No quizzes assigned.</p>

    <!-- Modal for StartQuiz -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn">X</button>
        <StartQuiz :quizId="selectedQuizId" :mediaStream="mediaStream" @close="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserAssignedQuizApi } from '../../services/apiServices';
import StartQuiz from '../student/StartQuiz.vue'; // Ensure correct path

// Reactive references
const quizzes = ref([]);
const error = ref(null);
const selectedQuizId = ref(null);
const showModal = ref(false);
const mediaStream = ref(null); // To store the media stream

// Fetch quizzes on component mount
const fetchAssignedQuizzes = async () => {
  try {
    const response = await getUserAssignedQuizApi();
    quizzes.value = response.data;
  } catch (err) {
    error.value = 'Failed to load assigned quizzes.';
    console.error(err);
  }
};

// Function to request video and audio permissions
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return stream; // Return the media stream if permission is granted
  } catch (error) {
    console.error('Permission denied for video recording:', error);
    return null; // Return null if permission is denied
  }
};

// Function to handle starting the quiz
const startQuiz = async (quizId) => {
  const stream = await startRecording();

  if (stream) {
    mediaStream.value = stream; // Store the media stream
    selectedQuizId.value = quizId;
    showModal.value = true; // Show the modal to start the quiz
  } else {
    alert('Video and audio permissions are required to start the quiz.');
  }
};

// Function to close the modal and stop the media stream
const closeModal = () => {
  showModal.value = false;
  selectedQuizId.value = null;

  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop()); // Stop all tracks when closing
    mediaStream.value = null;
  }
};

onMounted(() => {
  fetchAssignedQuizzes(); // Fetch assigned quizzes on component mount
});
</script>

<style scoped>
/* Add any necessary styles for the modal or quiz table */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 500px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
