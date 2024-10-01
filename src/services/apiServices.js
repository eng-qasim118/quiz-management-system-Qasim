// src/services/api.js

import axios from 'axios';

const BASE_URL = 'http://192.168.15.44:8000/api'; //'http://192.168.15.90:8000/api';                   //'http://localhost:3000';                                   // Base URL for the API

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUserApi = async(name, email, cv) => {
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (cv) {
            formData.append('cv', cv);
        }

        const response = await axios.post(`${BASE_URL}/submit`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error for handling in the calling function
    }
};

export const apiLogin = async(credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error; // Re-throw for further handling
    }
};

export const registerUser = async(data) => {
    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
            throw new Error('No authentication token found.'); // Error handling for missing token
        }

        const response = await apiClient.post('/register/user', data, {
            headers: {
                Authorization: `Bearer ${token}`, // Set the Authorization header with the token
            },
        });

        console.log('Register user response:', response.data); // Log the response to verify
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error registering user:', error); // Log the error for debugging
        throw error; // Re-throw the error for further handling
    }
};

export const getUsersByRole = async(role = null) => {
    try {
        let url = `${BASE_URL}/get-users-by-role`;
        if (role) {
            url += `?role=${encodeURIComponent(role)}`;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found.'); // Corrected: Check for the token
        }

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Get users response:', response.data); // Log the response to inspect it
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error fetching users by role:', error); // Log the error for debugging
        throw error; // Re-throw the error for further handling
    }
};
export const setPasswordApi = async(data) => {
    try {
        const response = await apiClient.post('/user/set-password', data);
        return response.data;
    } catch (error) {
        console.error('Error setting password:', error);
        throw error; // Re-throw the error for further handling
    }
};

export const getSubmissions = async() => {
    try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
            throw new Error('No authentication token found.');
        }

        // Make the request with the token in the Authorization header
        const response = await apiClient.get('/get-submissions', {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the request headers
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching submissions:', error);
        throw error; // Re-throw for further handling
    }
};

export const acceptSubmissionApi = async(submissionId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${BASE_URL}/accept/submissions`, { id: submissionId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error('Error accepting submission:', error);
        throw error; // Re-throw the error for further handling
    }
};

export const rejectSubmissionApi = async(submissionId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${BASE_URL}/reject/submissions`, { id: submissionId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error('Error rejecting submission:', error);
        throw error; // Re-throw the error for further handling
    }
};


export const assignQuizToUserApi = async(payload) => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token'); // Adjust the key based on how you store the token

        // Set the headers for the request
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`, // Use Bearer token authentication
                'Content-Type': 'application/json', // Ensure the content type is set to JSON
            },
        };

        // Send the POST request with payload and config
        const response = await axios.post(`${BASE_URL}/assign/quizzes`, payload, config);

        return response.data;
    } catch (error) {
        console.error('Error assigning quiz:', error.response ? error.response.data : error.message);
        throw error; // Re-throw the error for handling in the calling function
    }
};


export const createQuizApi = async(quizData) => {
    try {
        // Retrieve the admin token from localStorage
        const adminToken = localStorage.getItem('token'); // Change this key to your actual token key

        const response = await axios.post(`${BASE_URL}/create/quiz`, quizData, {
            headers: {
                'Authorization': `Bearer ${adminToken}`, // Set the token in the Authorization header
                'Content-Type': 'application/json', // Set the content type
            },
        });
        return response; // Return the response
    } catch (error) {
        throw error; // Rethrow the error for handling in the component
    }
};


export const getStudentsApi = async() => {
    try {

        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.get(`${BASE_URL}/get-students`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};


export const getQuizzesApi = async() => {
    try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        // Make GET request with the token in the headers
        const response = await axios.get(`${BASE_URL}/get-quiz`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Return the data from the response
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};


export const getUserAssignedQuizApi = async() => {
    try {
        // Retrieve the authentication token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(`${BASE_URL}/get/student-assigned/quiz`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {

        console.error('Error fetching assigned quizzes:', error);
        throw error;
    }
};


export const getUserAssignedQuizByUserIdApi = async(userId) => {
    try {
        // Retrieve the authentication token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found.');
        }

        // Construct the API URL with the userId parameter
        const response = await axios.get(`${BASE_URL}/get/student-assigned/quiz?user_id=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching assigned quizzes for user:', error);
        throw error;
    }
};


export const getQuizQuestionsApi = async(quizId) => {
    try {
        // Get the authentication token if needed (adjust if your API doesn't require this)
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found.');
        }

        // Send the GET request to fetch quiz questions based on the quizId
        const response = await axios.get(`${BASE_URL}/get/quiz/questions/${quizId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach token for authorization
            },
        });

        // Return the data from the response
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};



export const submitQuizOptions = async(quizData) => {
    try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        // Make sure the token exists before making the request
        if (!token) {
            throw new Error('No token found');
        }

        // Set up the headers with the token
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Send the POST request to the /submit/quiz/options endpoint
        const response = await axios.post(`${BASE_URL}/submit/quiz/options`, quizData, { headers });

        // Handle success response
        return response.data;
    } catch (error) {
        // Handle error
        console.error('Error submitting quiz options:', error);
        throw error;
    }
};

export const updateQuiz = async(quiz_id, quiz_name, duration) => {
    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        // Set up the headers with the token
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        // Validate required fields
        if (!quiz_id || !quiz_name || !duration) {
            throw new Error('quiz_id, quiz_name, and duration are required');
        }

        // Construct the URL with query parameters
        const url = `${BASE_URL}/update-quiz/${quiz_id}`;
        const params = {
            quiz_name,
            duration,
        };

        // Make the PUT request with query parameters and no body
        const response = await axios.put(url, null, { headers, params });

        // Return the response data
        return response.data;
    } catch (error) {
        // Enhanced error logging
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Error updating quiz:', error.response.data);
            throw new Error(error.response.data.message || 'Failed to update quiz');
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
            throw new Error('No response from server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
            throw new Error(error.message);
        }
    }
};

export const deleteQuizApi = async(quiz_id) => {
    try {
        const token = localStorage.getItem('token'); // Assuming you're using a token for authorization

        if (!token) {
            throw new Error('No token found');
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const url = `${BASE_URL}/delete-quiz/${quiz_id}`;

        // Make DELETE request
        const response = await axios.delete(url, { headers });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error deleting quiz:', error.response.data);
            throw new Error(error.response.data.error || 'Failed to delete quiz');
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response from server');
        } else {
            console.error('Error:', error.message);
            throw new Error(error.message);
        }
    }
};