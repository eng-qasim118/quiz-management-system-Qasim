
  <template>
    <div>

      <nav id="sidebar" class="bg-light border-right d-flex flex-column">
  <div class="sidebar-header">
    <h4 class="pt-3">Admin Dashboard</h4>
  </div>
  <ul class="list-unstyled components flex-grow-1">
    <li>
      <router-link to="/dashboard/view-results" class="nav-link">View Results</router-link>
    </li>

  </ul>
  <div > <!-- Optional margin to separate the button from the nav -->
    <button class="btn btn-danger w-100" @click="signOut">
      <i class="fa-solid fa-right-from-bracket"></i> Sign Out
    </button>
  </div>
</nav>

      <div class="content">

        <div class="row justify-content-center">
        <div class="col-lg-2 col-md-3 col-sm-6">
          <div class="card text-center mb-4">
            <div class="card-body">
              <i class="fa-solid fa-user-plus fa-2x mb-3"></i>
              <router-link to="/dashboard/add-user" class="card-title"><h5>Add User</h5></router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6">
          <div class="card text-center mb-4">
            <div class="card-body">
              <i class="fa-solid fa-pen-to-square fa-2x mb-3"></i>
              <router-link to="/dashboard/create-quiz" class="card-title"><h5>Create Quiz</h5></router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6">
          <div class="card text-center mb-4">
            <div class="card-body">
              <i class="fa-solid fa-tasks fa-2x mb-3"></i>
              <router-link to="/dashboard/assign-quiz" class="card-title"><h5>Assign Quiz</h5></router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6">
          <div class="card text-center mb-4">
            <div class="card-body">
              <i class="fa-solid fa-list-alt fa-2x mb-3"></i>
              <router-link to="/dashboard/view-quizzes" class="card-title"><h5>View Quizzez</h5></router-link>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-6">
          <div class="card text-center mb-4">
            <div class="card-body">
              <i class="fa-solid fa-envelope-open-text fa-2x mb-3"></i>
              <router-link to="/dashboard/view-requests" class="card-title"><h5>View Requests</h5></router-link>
            </div>
          </div>
        </div>
      </div>

        <router-view /> <!-- This is where the child components will be rendered -->
      </div>
    </div>
  </template>

  <script setup>
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';


  const router = useRouter();
  const store = useStore();

  const signOut = () => {
    // Perform any necessary cleanup here
    store.dispatch('logout'); // Call the logout action in Vuex
    localStorage.removeItem('token'); // Clear the token from localStorage
    router.push('/'); // Redirect to the login page
  };
  </script>

  <style scoped>
  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden; /* Prevent scrolling the body */
  }

  #sidebar {
    position: fixed;
    top: 60px; /* Adjust based on TopNav height */
    left: 0;
    bottom: 0;
    width: 250px;
    background: #f8f9fa; /* Light background */
    z-index: 100;
    overflow-y: auto; /* Allow scrolling in sidebar */
  }

  .content {
    margin-left: 250px; /* Adjust this to match the width of the sidebar */
    padding: 20px;
    position: relative; /* Allow stacking context for content */
    top: 3px; /* Adjust based on TopNav height */
    height: calc(100vh - 60px); /* Fill available height minus TopNav */
    overflow-y: auto; /* Allow scrolling in content area */
  }

  .sidebar-header {
    padding: 10px;
    border-bottom: 1px solid #ddd; /* Optional: Add border for header separation */
  }

  .nav-link {
    padding: 10px 15px;
  }

  .btn-danger {
    width: 100%; /* Make sign out button full width */
    margin: 10px 0; /* Add margin for spacing */
  }

  .card {
  border-left: 4px solid #007bff; /* Left border with primary color */
  border-right: 4px solid #007bff; /* Right border with primary color */
  border-radius: 0.5rem; /* Light radius for rounding */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Add subtle shadow */
}
.card .card-body {
  padding: 20px;
}
.card-title {
  font-weight: bold;
  color: black;
}

.card-title h5{
  font-size: 16px;
}
  </style>
