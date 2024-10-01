
<template>
  <div class="start-quiz container mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h2>{{ quizName }}</h2>
        <p>Duration: {{ duration }} minutes</p>
      </div>
      <div class="card-body">
        <div v-if="questions.length > 0">
          <div class="question-block mb-4">
            <h4>
              Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}:
            </h4>
            <p>{{ currentQuestion.question }}</p>
            <div class="list-group">
              <label
                v-for="(option, optionIndex) in currentQuestion.options"
                :key="optionIndex"
                class="list-group-item list-group-item-action"
                :class="{
                  active: answers[currentQuestion.id] === option,
                }"
                @mouseover="hoveredOption = option"
                @mouseleave="hoveredOption = null"
              >
                <input
                  type="radio"
                  :name="`question-${currentQuestionIndex}`"
                  :value="option"
                  v-model="answers[currentQuestion.id]"
                  class="form-check-input me-2"
                />
                {{ option }}
              </label>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="d-flex justify-content-between">
            <button
              class="btn btn-outline-primary"
              @click="prevQuestion"
              :disabled="currentQuestionIndex === 0"
            >
              Previous
            </button>
            <div>
              <button
                v-if="!isLastQuestion"
                class="btn btn-primary me-2"
                @click="nextQuestion"
              >
                Next
              </button>
              <button
                v-else
                class="btn btn-success"
                @click="submitQuiz"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading quiz questions...</span>
          </div>
          <p class="mt-2">Loading quiz questions...</p>
        </div>
      </div>
      <div class="card-footer text-muted d-flex justify-content-between align-items-center">
        <div v-if="isRecording" class="recording-indicator d-flex align-items-center">
          <span class="me-2">
            <i class="bi bi-record-circle-fill text-danger"></i> Recording...
          </span>
        </div>
        <button class="btn btn-secondary" @click="closeQuiz">Close Quiz</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, defineEmits } from 'vue';
import { getQuizQuestionsApi, submitQuizOptions } from '../../services/apiServices';

// Define props and emits
const props = defineProps(['quizId', 'mediaStream']);
const emit = defineEmits(['close']);

// Reactive references
const quizName = ref('');
const duration = ref(0);
const questions = ref([]);
const answers = ref({});
const currentQuestionIndex = ref(0);
const mediaRecorder = ref(null);
const recordedChunks = ref([]);
const isRecording = ref(false);
const hoveredOption = ref(null); // For hover effects

// Computed properties
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

// Fetch quiz questions from API
const fetchQuizQuestions = async () => {
  try {
    const quizData = await getQuizQuestionsApi(props.quizId);
    if (quizData && Array.isArray(quizData.data)) {
      quizName.value = quizData.quiz_name || 'Your Quiz Title';
      duration.value = quizData.duration || 10;

      questions.value = quizData.data.map(question => ({
        id: question.id,
        question: question.question,
        options: question.options
      }));
      await startVideoRecording(); // Start recording after loading questions
    } else {
      console.error('Unexpected response structure:', quizData);
      alert('Failed to load quiz questions.');
    }
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    alert('An error occurred while loading quiz questions.');
  }
};

// Start video recording using the provided mediaStream
const startVideoRecording = () => {
  return new Promise((resolve, reject) => {
    if (!props.mediaStream) {
      console.error('No media stream provided.');
      reject(new Error('No media stream provided.'));
      return;
    }

    try {
      mediaRecorder.value = new MediaRecorder(props.mediaStream);

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.value.push(event.data);
        }
      };

      mediaRecorder.value.onstart = () => {
        isRecording.value = true;
        console.log('Video recording started.');
      };

      mediaRecorder.value.onstop = () => {
        isRecording.value = false;
        console.log('Video recording stopped.');
      };

      mediaRecorder.value.start();
      resolve();
    } catch (error) {
      console.error('Error initializing MediaRecorder:', error);
      alert('Unable to start video recording.');
      reject(error);
    }
  });
};

// Stop video recording and handle the recorded data
const stopVideoRecording = () => {
  return new Promise((resolve, reject) => {
    if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
      mediaRecorder.value.onstop = async () => {
        const blob = new Blob(recordedChunks.value, { type: 'video/webm' });

        // Upload video to server (if needed)
        const formData = new FormData();
        formData.append('video', blob, `quiz_recording_${props.quizId}.webm`);

        try {
          const response = await uploadVideo(formData); // Replace with your actual API call
          console.log('Video uploaded successfully:', response);
          resolve();
        } catch (error) {
          console.error('Failed to upload video:', error);
          reject(error);
        }
      };
      mediaRecorder.value.stop();
    } else {
      console.warn('MediaRecorder is not active.');
      resolve();
    }
  });
};

// Function to handle video upload (replace this with actual upload logic)
const uploadVideo = async (formData) => {
  // Make API call to upload video
  return await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
};

// Cleanup on component unmount
onBeforeUnmount(() => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
  }
  // Stop the mediaStream tracks to release the camera and microphone
  if (props.mediaStream) {
    props.mediaStream.getTracks().forEach(track => track.stop());
  }
});

// Quiz navigation methods
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// Submit quiz function
const submitQuiz = async () => {
  try {
    await stopVideoRecording(); // Stop recording and handle the video

    const payload = {
      quiz_id: props.quizId,
      options: { ...answers.value }
    };

    const response = await submitQuizOptions(payload);
    console.log('Quiz submitted successfully:', response);

    if (response.message === 'Quiz answers submitted successfully') {
      alert('Your quiz was submitted successfully!');
      emit('close'); // Notify parent to close the modal
    }
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    alert('There was an error submitting the quiz. Please try again.');
  }
};

// Function to close the quiz manually
const closeQuiz = () => {
  if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
    emit('close');
  }
};

// Initialize on component mount
onMounted(() => {
  if (props.mediaStream) {
    fetchQuizQuestions();
  } else {
    console.error('Media stream not provided to StartQuiz component.');
    alert('Unable to access media stream.');
    emit('close'); // Close the modal if no stream is provided
  }
});
</script>

<style scoped>
/* Enhanced styles for the StartQuiz component */

/* Question Options Hover Effect */
.list-group-item {
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.list-group-item:hover {
  background-color: #e7f1ff;
  color: #0d6efd;
}

/* Active Option Styling */
.list-group-item.active {
  background-color: #0d6efd;
  color: white;
}

/* Recording Indicator */
.recording-indicator {
  font-weight: bold;
}

/* Custom Button Hover Effects */
.btn-primary:hover,
.btn-success:hover,
.btn-outline-primary:hover {
  filter: brightness(90%);
}

/* Adjust radio button alignment */
.form-check-input {
  margin-top: 0.3rem;
}

/* Close button alignment in footer */
.card-footer .btn-secondary {
  float: right;
}
</style>
