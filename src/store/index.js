import { createStore } from 'vuex';
import { apiLogin } from '../services/apiServices'; // Import the login API function

export default createStore({
    state: {
        isAuthenticated: false,
        userRole: null, // 'admin', 'manager', or 'student'
        permissions: [], // Store user permissions
    },
    mutations: {
        setAuth(state, payload) {
            state.isAuthenticated = payload.isAuthenticated;
            state.userRole = payload.role; // Store user role
            state.permissions = payload.permissions || []; // Store permissions
        },
    },
    actions: {
        async login({ commit }, { email, password }) {
            try {
                // Use the login API function from apiServices
                const response = await apiLogin(email, password);
                console.log('Full API response:', response);

                // Extract token and user role from the response
                const data = response.data.data.token || {}; // Adjusted based on your response structure
                const access_token = data.access_token;
                const token_type = data.token_type;

                if (access_token) {
                    // Store token in localStorage
                    const token = `${token_type} ${access_token}`;
                    localStorage.setItem('token', token);

                    // Get the user role, defaulting to 'admin' if not set
                    const userRole = response.data.data.role ? response.data.data.role[0] : 'admin'; // Adjusted for role array
                    const permissions = response.data.data.permissions || []; // Get permissions from response

                    // Commit to Vuex store
                    commit('setAuth', { isAuthenticated: true, role: userRole, permissions });

                    console.log('Vuex store updated: ', { isAuthenticated: true, role: userRole, permissions });

                    // Redirect to the single dashboard route
                    this.$router.push('/dashboard'); // Ensure this is accessible in your context
                } else {
                    throw new Error('Login failed: No access token found');
                }
            } catch (error) {
                console.error('Login failed:', error);
                throw new Error('Invalid credentials or server error');
            }
        },

        logout({ commit }) {
            commit('setAuth', { isAuthenticated: false, role: null, permissions: [] }); // Reset permissions on logout
            localStorage.removeItem('token');
        },
    },

    getters: {
        getUserRole: (state) => state.userRole,
        isAuthenticated: (state) => state.isAuthenticated,
        getUserPermissions: (state) => state.permissions, // Optional getter for permissions
    },
});