`<template>
    <div class="container mt-4">
      <h1 class="text-center mb-4">Assign Quiz</h1>
      <div class="card p-4">
        <!-- Student Table -->
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.id }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <input
                  type="checkbox"
                  v-model="selectedStudents"
                  :value="student.id"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Dropdown for Quizzes -->
        <div class="mb-3">
          <label for="quizSelect" class="form-label">Select Quiz</label>
          <select v-model="selectedQuiz" class="form-select custom-select" id="quizSelect" required>
            <option value="" disabled>Select a quiz</option>
            <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">{{ quiz.quiz_name }}</option>
          </select>
        </div>

        <!-- Assign Quiz Button -->
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary" @click="assignQuiz">Assign Quiz</button>
        </div>

        <!-- Success/Error Message -->
        <p v-if="message" class="mt-3 alert" :class="messageClass">{{ message }}</p>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { getQuizzesApi, getStudentsApi, assignQuizToUserApi } from '../../services/apiServices'; // Make sure to import your assign quiz API function

  // Define refs for storing API response data
  const students = ref([]);
  const quizzes = ref([]);
  const selectedStudents = ref([]);
  const selectedQuiz = ref('');
  const message = ref('');
  const messageClass = ref('alert-info');

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await getStudentsApi();
      students.value = response.data.data; // Ensure this is correct based on the API structure
    console.log(response.data);
    } catch (error) {
      message.value = 'Failed to fetch students.';
      messageClass.value = 'alert-danger';
      console.error('Error fetching students:', error);
    }
  };

  // Fetch quizzes from the API
  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzesApi(); // Fetch quizzes using the API function
      quizzes.value = data.data; // Correctly accessing the quizzes data
    } catch (error) {
      message.value = 'Failed to fetch quizzes.';
      messageClass.value = 'alert-danger';
      console.error('Error fetching quizzes:', error);
    }
  };

  // Assign quiz function
  const assignQuiz = async () => {
    if (selectedStudents.value.length === 0 || !selectedQuiz.value) {
        message.value = 'Please select at least one student and a quiz.';
        messageClass.value = 'alert-warning';
        return;
    }

    try {

        const payload = {
            user_ids: [...selectedStudents.value], // Convert to a plain array
            quiz_id: selectedQuiz.value, // Send selected quiz ID
        };


        console.log('Assigning quiz with payload:', payload);

        // Call the API to assign the quiz with the new payload structure
        const response = await assignQuizToUserApi(payload);

        // Handle success based on API response structure
        if (response && response.success) {
            message.value = 'Quiz assigned successfully!';
            messageClass.value = 'success-alert'; // Custom class for green background and text
        } else {
            message.value = response.message || 'Failed to assign quiz. Please try again.';
            messageClass.value = 'alert-danger'; // Keep the red background for error
        }
    } catch (error) {
        message.value = 'Error assigning quiz.';
        messageClass.value = 'alert-danger'; // Keep red background for any caught errors
        console.error('Error assigning quiz:', error);
    }
};

  // Fetch students and quizzes on component mount
  onMounted(() => {
    fetchStudents();
    fetchQuizzes();
  });
  </script>
`
  <style scoped>
  /* Optional styling for the dropdown */
  .custom-select {
    appearance: none;
    background-color: #f1f1f1;
    padding: 6px;
    font-size: 1rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
  }

  .custom-select:focus {
    background-color: #e0e0e0;
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
  }

  /* Custom success message styling */
  .success-alert {
    color: white;
    background-color: green;
    border: 1px solid green;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
