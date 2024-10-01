<!-- <template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Create Quiz</h1>
    <div class="card p-4">
      <form @submit.prevent="createQuiz">

        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Duration (mins)</th>
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  v-model="quizName"
                  type="text"
                  class="form-control"
                  placeholder="Enter quiz name"
                  required
                />
              </td>
              <td>
                <input
                  v-model="duration"
                  type="number"
                  class="form-control"
                  placeholder="Enter duration"
                  required
                />
              </td>
              <td>
                <input
                  v-model="totalMarks"
                  type="number"
                  class="form-control"
                  placeholder="Enter total marks"
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>


        <div v-for="(question, index) in questions" :key="index" class="mb-4">
          <h5>Question {{ index + 1 }}</h5>
          <input
            v-model="question.question"
            type="text"
            class="form-control mb-2"
            placeholder="Enter question"
            required
          />


          <div class="row">
            <div
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              class="col-md-6 mb-2"
            >
              <div class="input-group">
                <input
                  v-model="question.options[optIndex]"
                  type="text"
                  class="form-control"
                  placeholder="Option"
                  required
                />
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="removeOption(index, optIndex)"
                >
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>
          </div>


          <button
            type="button"
            class="btn btn-primary mb-2"
            @click="addOption(index)"
          >
            Add Option
          </button>

          <div class="mb-3">
            <label for="correctAnswer" class="form-label">Correct Answer</label>
            <input
              v-model="question.correct_answer"
              type="text"
              class="form-control"
              placeholder="Correct Answer"
              required
            />
          </div>
        </div>


        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-outline-primary me-2 mr-4"
            @click="addQuestion"
          >
            Add Question
          </button>

          <button type="submit" class="btn btn-primary">
            Create Quiz
          </button>
        </div>
      </form>
    </div>

    <p v-if="message" class="mt-3 alert alert-info">{{ message }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { createQuizApi } from '../../services/apiServices'; // Ensure correct path and export

const quizName = ref('');
const duration = ref('');
const totalMarks = ref('');
const questions = ref([
  {
    question: '',
    options: ['', ''], // Start with two empty options
    correct_answer: '',
  },
]);
const message = ref('');

// Function to add a new question
const addQuestion = () => {
  questions.value.push({
    question: '',
    options: ['', ''],
    correct_answer: '',
  });
};

// Function to add a new option to a specific question
const addOption = (index) => {
  questions.value[index].options.push('');
};

// Function to remove an option from a specific question
const removeOption = (questionIndex, optionIndex) => {
  questions.value[questionIndex].options.splice(optionIndex, 1);
};

// Function to create quiz
const createQuiz = async () => {
  console.log('createQuiz function triggered');

  const quizData = {
    quiz_name: quizName.value,
    duration: parseInt(duration.value, 10),
    total_marks: parseInt(totalMarks.value, 10),
    questions: questions.value,
  };

  console.log('Quiz Data:', quizData);

  // Basic Validation
  const valid = quizData.quiz_name && !isNaN(quizData.duration) && !isNaN(quizData.total_marks) &&
                quizData.questions.length > 0 && quizData.questions.every(q =>
                  q.question.trim() !== '' &&
                  q.options.length >= 2 &&
                  q.options.every(opt => opt.trim() !== '') &&
                  q.correct_answer.trim() !== ''
                );

  if (!valid) {
    message.value = 'Please fill out all fields correctly.';
    return;
  }

  try {
    const response = await createQuizApi(quizData);
    console.log('API Response:', response);

    if (response.status === 201 || response.status === 200) {
      message.value = 'Quiz created successfully!';
      resetForm();
    } else {
      message.value = 'Failed to create quiz. Please try again.';
    }
  } catch (error) {
    console.error('Error creating quiz:', error);
    message.value = 'Failed to create quiz. Please try again.';
  }
};

// Function to reset the form
const resetForm = () => {
  quizName.value = '';
  duration.value = '';
  totalMarks.value = '';
  questions.value = [
    {
      question: '',
      options: ['', ''],
      correct_answer: '',
    },
  ];
  message.value = '';
};
</script>

 -->

 <template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Create Quiz</h1>
    <div class="card p-4">
      <form @submit.prevent="createQuiz">
        <!-- Quiz Details -->
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Duration (mins)</th>
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  v-model="quizName"
                  type="text"
                  class="form-control"
                  placeholder="Enter quiz name"
                  required
                />
              </td>
              <td>
                <input
                  v-model="duration"
                  type="number"
                  class="form-control"
                  placeholder="Enter duration"
                  required
                />
              </td>
              <td>
                <input
                  v-model="totalMarks"
                  type="number"
                  class="form-control"
                  placeholder="Enter total marks"
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Questions Section -->
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="mb-4 question-container"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5>Question {{ index + 1 }}</h5>
            <!-- Show "Remove Question" button only if it's not the first question -->
            <button
              v-if="index !== 0"
              type="button"
              class="btn btn-danger btn-sm"
              @click="removeQuestion(index)"
              :aria-label="'Remove Question ' + (index + 1)"
            >
              <i class="fas fa-trash-alt"></i> Remove
            </button>
          </div>

          <input
            v-model="question.question"
            type="text"
            class="form-control mb-2"
            placeholder="Enter question"
            required
          />

          <!-- Display options in two columns -->
          <div class="row">
            <div
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              class="col-md-6 mb-2"
            >
              <div class="input-group">
                <input
                  v-model="question.options[optIndex]"
                  type="text"
                  class="form-control"
                  placeholder="Option"
                  required
                />
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="removeOption(index, optIndex)"
                  :aria-label="'Remove Option ' + (optIndex + 1)"
                >
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Add option button -->
          <button
            type="button"
            class="btn btn-primary mb-2"
            @click="addOption(index)"
          >
            Add Option
          </button>

          <div class="mb-3">
            <label for="correctAnswer" class="form-label">Correct Answer</label>
            <input
              v-model="question.correct_answer"
              type="text"
              class="form-control"
              placeholder="Correct Answer"
              required
            />
          </div>
        </div>

        <!-- Buttons Section -->
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-outline-primary me-2 mr-3"
            @click="addQuestion"
          >
            Add Question
          </button>

          <button type="submit" class="btn btn-primary">
            Create Quiz
          </button>
        </div>
      </form>
    </div>

    <p v-if="message" class="mt-3 alert alert-info">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createQuizApi } from '../../services/apiServices'; // Ensure correct path and export

const quizName = ref('');
const duration = ref('');
const totalMarks = ref('');
const questions = ref([
  {
    question: '',
    options: ['', ''], // Start with two empty options
    correct_answer: '',
  },
]);
const message = ref('');

// Function to add a new question
const addQuestion = () => {
  questions.value.push({
    question: '',
    options: ['', ''],
    correct_answer: '',
  });
};

// Function to remove a question by index
const removeQuestion = (index) => {
  if (questions.value.length > 1) {
    questions.value.splice(index, 1);
    // Optional: Reorder question numbering if needed
    // Not necessary as index is used dynamically in template
  } else {
    // Optionally, prevent removing the last remaining question
    message.value = 'At least one question is required.';
  }
};

// Function to add a new option to a specific question
const addOption = (index) => {
  questions.value[index].options.push('');
};

// Function to remove an option from a specific question
const removeOption = (questionIndex, optionIndex) => {
  if (questions.value[questionIndex].options.length > 2) {
    questions.value[questionIndex].options.splice(optionIndex, 1);
  } else {
    // Optionally, prevent removing options below the minimum required
    message.value = 'Each question must have at least two options.';
  }
};

// Function to create quiz
const createQuiz = async () => {
  console.log('createQuiz function triggered');

  const quizData = {
    quiz_name: quizName.value.trim(),
    duration: parseInt(duration.value, 10),
    total_marks: parseInt(totalMarks.value, 10),
    questions: questions.value.map((q) => ({
      question: q.question.trim(),
      options: q.options.map((opt) => opt.trim()),
      correct_answer: q.correct_answer.trim(),
    })),
  };

  console.log('Quiz Data:', quizData);

  // Basic Validation
  const valid =
    quizData.quiz_name &&
    !isNaN(quizData.duration) &&
    !isNaN(quizData.total_marks) &&
    quizData.questions.length > 0 &&
    quizData.questions.every(
      (q) =>
        q.question !== '' &&
        q.options.length >= 2 &&
        q.options.every((opt) => opt !== '') &&
        q.correct_answer !== '' &&
        q.options.includes(q.correct_answer)
    );

  if (!valid) {
    message.value =
      'Please ensure all fields are filled correctly and that each correct answer exists in the options.';
    console.warn('Validation Failed:', 'Form data is incomplete or invalid.');
    return;
  }

  try {
    const response = await createQuizApi(quizData);
    console.log('API Response:', response);

    if (response.status === 201 || response.status === 200) {
      message.value = 'Quiz created successfully!';
      resetForm();
    } else {
      message.value = 'Failed to create quiz. Please try again.';
      console.warn('Unexpected Response Status:', response.status);
    }
  } catch (error) {
    console.error('Error creating quiz:', error);
    if (error.response) {
      // Server responded with a status other than 2xx
      message.value = `Error: ${
        error.response.data.message || 'Failed to create quiz.'
      }`;
    } else if (error.request) {
      // No response received
      message.value = 'No response from server. Please try again later.';
    } else {
      // Other errors
      message.value = `Error: ${error.message}`;
    }
  }
};

// Function to reset the form
const resetForm = () => {
  quizName.value = '';
  duration.value = '';
  totalMarks.value = '';
  questions.value = [
    {
      question: '',
      options: ['', ''],
      correct_answer: '',
    },
  ];
  message.value = '';
};
</script>

<style scoped>
/* Optional: Add any necessary styles here */

/* Style the "Remove Question" button to be smaller and more subtle */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Ensure that the trash icon is properly aligned within the button */
.btn-danger i {
  margin-right: 0.25rem;
}

/* Optional: Add hover effects or transitions for better UX */
.btn-danger:hover {
  opacity: 0.8;
}

/* Optional: Style the question container for better spacing */
.question-container {
  border: 1px solid #dee2e6;
  padding: 1rem;
  border-radius: 0.25rem;
}

/* Optional: Adjust the width of buttons on smaller screens */
@media (max-width: 576px) {
  .d-flex.justify-content-end {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-outline-primary,
  .btn-primary {
    width: 100%;
    margin-bottom: 10px;
  }

  .btn-primary:last-child {
    margin-bottom: 0;
  }
}
</style>

