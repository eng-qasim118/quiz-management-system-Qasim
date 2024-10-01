<!-- <template>
    <div>
      <h1>View Quizzes</h1>
      <div class="container">

        <div class="text-end mb-3">
          <button @click="navigateToCreateQuiz" class="btn btn-primary">Create Quiz</button>
        </div>

        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quiz Name</th>
              <th>Duration (minutes)</th>
              <th>Total Marks</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.id">
              <td>{{ quiz.id }}</td>
              <td>{{ quiz.quiz_name }}</td>
              <td>{{ quiz.duration }}</td>
              <td>{{ quiz.total_marks }}</td>
              <td>{{ formatDate(quiz.created_at) }}</td>
              <td>
                <i class="fa-solid fa-trash-can text-danger delete-icon" @click="deleteQuiz(quiz.id)" title="Delete"></i>
                <i class="fa-solid fa-pen-to-square text-primary edit-icon" @click="editQuiz(quiz.id)" title="Edit"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { getQuizzesApi } from '../../services/apiServices'; // Import your API function
  import { useRouter } from 'vue-router'; // Import useRouter for navigation

  const quizzes = ref([]);
  const router = useRouter();

  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzesApi();
      if (response.data) {
        quizzes.value = response.data; // Set quizzes data
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Navigate to Create Quiz component
  const navigateToCreateQuiz = () => {
    router.push({ name: 'CreateQuiz' }); // Change this to the actual name of your Create Quiz route
  };

  // Placeholder function for deleting a quiz
  const deleteQuiz = (id) => {
    // Implement your delete logic here
    console.log(`Deleting quiz with id: ${id}`);
  };

  // Placeholder function for editing a quiz
  const editQuiz = (id) => {
    // Implement your edit logic here
    console.log(`Editing quiz with id: ${id}`);
  };

  // Fetch quizzes when the component is mounted
  onMounted(fetchQuizzes);
  </script>

  <style>
  .container {
    margin-top: 20px;
  }

  /* Add padding for the icons */
  .delete-icon, .edit-icon {
    margin-left: 10px;
    cursor: pointer;
    font-size: 20px;
  }

  /* Color styles for the icons */
  .text-danger {
    color: red; /* Red color for delete icon */
  }

  .text-primary {
    color: blue; /* Blue color for edit icon */
  }
  </style> -->

  <!-- <template>
    <div>
      <h1>View Quizzes</h1>
      <div class="container">

        <div class="text-end mb-3">
          <button @click="navigateToCreateQuiz" class="btn btn-primary">Create Quiz</button>
        </div>

        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quiz Name</th>
              <th>Duration (minutes)</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.id">
              <td>{{ quiz.id }}</td>


              <td v-if="editMode === quiz.id">
                <input type="text" v-model="quiz.quiz_name" />
              </td>
              <td v-else>{{ quiz.quiz_name }}</td>


              <td v-if="editMode === quiz.id">
                <input type="number" v-model="quiz.duration" />
              </td>
              <td v-else>{{ quiz.duration }}</td>

              <td>{{ formatDate(quiz.created_at) }}</td>
              <td>

                <i v-if="editMode !== quiz.id"
                   class="fa-solid fa-pen-to-square text-primary edit-icon"
                   @click="editQuiz(quiz.id)" title="Edit"></i>


                <i v-if="editMode === quiz.id"
                   class="fa-solid fa-check text-success submit-icon"
                   @click="submitEdit(quiz)" title="Submit"></i>


                <i class="fa-solid fa-trash-can text-danger delete-icon"
                   @click="deleteQuiz(quiz.id)" title="Delete"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { getQuizzesApi, updateQuiz } from '../../services/apiServices'; // Import your API functions
  import { useRouter } from 'vue-router'; // Import useRouter for navigation

  const quizzes = ref([]);
  const router = useRouter();
  const editMode = ref(null); // Track which quiz is in edit mode

  // Format date function to display the date in the desired format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch quizzes from the API
  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzesApi();
      if (response.data) {
        quizzes.value = response.data; // Set quizzes data
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
      alert(`Failed to fetch quizzes: ${error.message}`);
    }
  };

  // Navigate to Create Quiz component
  const navigateToCreateQuiz = () => {
    router.push({ name: 'CreateQuiz' });
  };

  // Function to enable edit mode for a specific quiz
  const editQuiz = (id) => {
    editMode.value = id; // Set the editMode to the quiz ID being edited
  };

  // Submit the edited quiz details
  const submitEdit = async (quiz) => {
    try {
      const { id, quiz_name, duration } = quiz;

      // Validate inputs
      if (!quiz_name || !duration) {
        alert('Quiz name and duration are required.');
        return;
      }

      // Call the updated updateQuiz function with separate parameters
      const response = await updateQuiz(id, quiz_name, duration);
      console.log('Quiz updated successfully:', response);

      // Exit edit mode after submitting the changes
      editMode.value = null;

      // Optionally, refresh the quizzes list after updating
      await fetchQuizzes();
    } catch (error) {
      console.error('Error updating quiz:', error.response ? error.response.data : error.message);
      alert(`Failed to update quiz: ${error.message}`);
    }
  };

  // Delete quiz function (Assuming it's implemented)
  const deleteQuiz = async (quiz_id) => {
    try {
      // Implement your deleteQuiz API call here
      // Example:
      // await deleteQuizApi(quiz_id);
      console.log(`Quiz with ID ${quiz_id} deleted successfully.`);
      await fetchQuizzes(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting quiz:', error.response ? error.response.data : error.message);
      alert(`Failed to delete quiz: ${error.message}`);
    }
  };

  // Fetch quizzes when the component is mounted
  onMounted(fetchQuizzes);
  </script>

  <style>
  .container {
    margin-top: 20px;
  }

  /* Add padding for the icons */
  .delete-icon, .edit-icon, .submit-icon {
    margin-left: 10px;
    cursor: pointer;
    font-size: 20px;
  }

  /* Color styles for the icons */
  .text-danger {
    color: red; /* Red color for delete icon */
  }

  .text-primary {
    color: blue; /* Blue color for edit icon */
  }

  .text-success {
    color: green; /* Green color for submit icon */
  }
  </style> -->

  <template>
    <div>
      <h1>View Quizzes</h1>
      <div class="container">
        <!-- Create Quiz Button -->
        <div class="text-end mb-3">
          <button @click="navigateToCreateQuiz" class="btn btn-primary">Create Quiz</button>
        </div>

        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quiz Name</th>
              <th>Duration (minutes)</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.id">
              <td>{{ quiz.id }}</td>

              <!-- Editable Quiz Name Field -->
              <td v-if="editMode === quiz.id">
                <input type="text" v-model="quiz.quiz_name" />
              </td>
              <td v-else>{{ quiz.quiz_name }}</td>

              <!-- Editable Duration Field -->
              <td v-if="editMode === quiz.id">
                <input type="number" v-model="quiz.duration" />
              </td>
              <td v-else>{{ quiz.duration }}</td>

              <td>{{ formatDate(quiz.created_at) }}</td>
              <td>
                <!-- Edit Icon -->
                <i v-if="editMode !== quiz.id"
                   class="fa-solid fa-pen-to-square text-primary edit-icon"
                   @click="editQuiz(quiz.id)" title="Edit"></i>

                <!-- Submit Icon -->
                <i v-if="editMode === quiz.id"
                   class="fa-solid fa-check text-success submit-icon"
                   @click="submitEdit(quiz)" title="Submit"></i>

                <!-- Delete Icon -->
                <i class="fa-solid fa-trash-can text-danger delete-icon"
                   @click="deleteQuiz(quiz.id)" title="Delete"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { getQuizzesApi, updateQuiz, deleteQuizApi } from '../../services/apiServices'; // Import your API functions
  import { useRouter } from 'vue-router'; // Import useRouter for navigation

  const quizzes = ref([]);
  const router = useRouter();
  const editMode = ref(null); // Track which quiz is in edit mode

  // Format date function to display the date in the desired format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch quizzes from the API
  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzesApi();
      if (response.data) {
        quizzes.value = response.data; // Set quizzes data
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
      alert(`Failed to fetch quizzes: ${error.message}`);
    }
  };

  // Navigate to Create Quiz component
  const navigateToCreateQuiz = () => {
    router.push({ name: 'CreateQuiz' });
  };

  // Function to enable edit mode for a specific quiz
  const editQuiz = (id) => {
    editMode.value = id; // Set the editMode to the quiz ID being edited
  };

  // Submit the edited quiz details
  const submitEdit = async (quiz) => {
    try {
      const { id, quiz_name, duration } = quiz;

      // Validate inputs
      if (!quiz_name || !duration) {
        alert('Quiz name and duration are required.');
        return;
      }

      // Call the updated updateQuiz function with separate parameters
      const response = await updateQuiz(id, quiz_name, duration);
      console.log('Quiz updated successfully:', response);

      // Exit edit mode after submitting the changes
      editMode.value = null;

      // Optionally, refresh the quizzes list after updating
      await fetchQuizzes();
    } catch (error) {
      console.error('Error updating quiz:', error.response ? error.response.data : error.message);
      alert(`Failed to update quiz: ${error.message}`);
    }
  };

  // Delete quiz function
  const deleteQuiz = async (quiz_id) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuizApi(quiz_id); // Call the API to delete the quiz
        console.log(`Quiz with ID ${quiz_id} deleted successfully.`);
        await fetchQuizzes(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting quiz:', error.response ? error.response.data : error.message);
        alert(`Failed to delete quiz: ${error.message}`);
      }
    }
  };

  // Fetch quizzes when the component is mounted
  onMounted(fetchQuizzes);
  </script>

  <style>
  .container {
    margin-top: 20px;
  }

  /* Add padding for the icons */
  .delete-icon, .edit-icon, .submit-icon {
    margin-left: 10px;
    cursor: pointer;
    font-size: 20px;
  }

  /* Color styles for the icons */
  .text-danger {
    color: red; /* Red color for delete icon */
  }

  .text-primary {
    color: blue; /* Blue color for edit icon */
  }

  .text-success {
    color: green; /* Green color for submit icon */
  }
  </style>
