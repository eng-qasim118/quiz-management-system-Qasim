<!-- <template>
    <div>
      <h2>Results</h2>
      <div class="container">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <button @click="viewResults(student.id)" class="btn btn-info">
                  View Results
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { getStudentsApi } from '../../services/apiServices'; // Adjust the path to your API service
  import { useRouter } from 'vue-router'; // Import useRouter for navigation

  const students = ref([]); // Create a reactive variable to hold student data
  const router = useRouter(); // Initialize the router

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await getStudentsApi(); // Call the API function
      if (response.data) {
        students.value = response.data.data; // Set students data from the API response
      }
    } catch (error) {
      console.error('Error fetching students:', error.response ? error.response.data : error.message);
      alert(`Failed to fetch students: ${error.message}`);
    }
  };

  // Function to view results for a specific student
  const viewResults = (studentId) => {
    // Navigate to the results page for the selected student
    router.push({ name: 'ViewResults', params: { id: studentId } });
  };

  // Fetch students when the component is mounted
  onMounted(fetchStudents);
  </script>

  <style>
  .container {
    margin-top: 20px;
  }

  /* Optional: Add styles for the table */
  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .table th {
    background-color: #f2f2f2;
    text-align: left;
  }

  /* Add styles for the view button */
  .btn {
    cursor: pointer;
  }
  </style> -->

  <template>
    <div>
      <h2>Results</h2>
      <div class="container">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <button
                  @click="viewResults(student.id)"
                  class="btn btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#quizResultsModal"
                >
                  View Results
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal for displaying quiz results -->
        <div class="modal fade" id="quizResultsModal" tabindex="-1" aria-labelledby="quizResultsModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-black" id="quizResultsModalLabel">Quiz Results</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <div v-if="quizzes.length > 0">
                  <ul class="list-group">
                    <li v-for="quiz in quizzes" :key="quiz.id" class="list-group-item">
                      <strong>{{ quiz.quiz.quiz_name }}</strong>
                      <p>Status: {{ quiz.attempt ? 'Attempted' : 'Not Attempted' }}</p>
                      <p>Marks Obtained: {{ quiz.marks_obtained !== null ? quiz.marks_obtained : 'N/A' }}</p>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <p>No quizzes assigned or attempted.</p>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { getStudentsApi, getUserAssignedQuizByUserIdApi } from '../../services/apiServices'; // Adjust the path to your API service

  const students = ref([]);
  const quizzes = ref([]); // To hold assigned quizzes

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await getStudentsApi();
      if (response.data) {
        students.value = response.data.data;
      }
    } catch (error) {
      console.error('Error fetching students:', error.response ? error.response.data : error.message);
      alert(`Failed to fetch students: ${error.message}`);
    }
  };

  // Function to view results and fetch assigned quizzes for a specific student
  const viewResults = async (studentId) => {
    try {
      // Call the API to get assigned quizzes for the selected student
      const response = await getUserAssignedQuizByUserIdApi(studentId);
      if (response.data) {
        quizzes.value = response.data; // Store assigned quizzes in the reactive variable
      }
    } catch (error) {
      console.error('Error fetching assigned quizzes:', error.response ? error.response.data : error.message);
      alert(`Failed to fetch assigned quizzes: ${error.message}`);
    }
  };

  // Function to clear quizzes when the modal is closed
  const closeModal = () => {
    quizzes.value = []; // Clear quizzes when modal is closed
  };

  // Fetch students when the component is mounted
  onMounted(fetchStudents);
  </script>

  <style>
  .container {
    margin-top: 20px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .table th {
    background-color: #f2f2f2;
    text-align: left;
  }

  .btn {
    cursor: pointer;
  }

  /* Optional: Style for the quizzes list */
  ul {
    list-style-type: none;
    padding: 0;
  }
  </style>

