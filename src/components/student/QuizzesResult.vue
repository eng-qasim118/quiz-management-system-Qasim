<template>
    <div>
      <h1>Submitted Quiz Results</h1>
      <table v-if="quizzes.length > 0">
        <thead>
          <tr>
            <th>Quiz Name</th>
            <th>Total Marks</th>
            <th>Marks Obtained</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quiz in quizzes" :key="quiz.id">
            <td>{{ quiz.quiz.quiz_name }}</td>
            <td>{{ quiz.quiz.total_marks }}</td>
            <td>{{ quiz.marks_obtained }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No quiz results found.</p>
    </div>
  </template>

  <script>
  import { ref, onMounted } from 'vue';
  import { getUserAssignedQuizApi } from '../../services/apiServices'; // Adjust the import path as necessary

  export default {
    setup() {
      const quizzes = ref([]);

      const fetchQuizResults = async () => {
        try {
          const response = await getUserAssignedQuizApi();
          if (response && response.data) {
            quizzes.value = response.data; // Directly assigning the fetched data
          }
        } catch (error) {
          console.error('Error fetching quiz results:', error);
        }
      };

      onMounted(() => {
        fetchQuizResults();
      });

      return {
        quizzes
      };
    }
  };
  </script>

  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
  </style>
