<template>
  <div>
    <TopNav/>
  <div>
    <div v-if="isLoading">
      Loading your dashboard...
    </div>
    <div v-else>
      <div v-if="userRole === 'admin'">
        <AdminDashboard />
      </div>
      <div v-else-if="userRole === 'manager'">
        <ManagerDashboard />
      </div>
      <div v-else>
        <StudentDashboard />
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import AdminDashboard from './AdminDashboard.vue';
import ManagerDashboard from './ManagerDashboard.vue';
import StudentDashboard from './StudentDashboard.vue';
import TopNav from '@/components/TopNav.vue';


// Access Vuex store
const store = useStore();
const isLoading = ref(true);  // Loading state

// Get user role from Vuex
const userRole = computed(() => {
  const roleFromLocalStorage = localStorage.getItem('userRole');
  // Check if userRole is not set in the store, then check localStorage
  return store.getters.getUserRole || roleFromLocalStorage;
});

// Simulate loading process
onMounted(() => {
  // Simulating an async call to fetch user role (if needed)
  setTimeout(() => {
    isLoading.value = false;
    console.log('Current Role:', userRole.value);
  }, 500); // Adjust this timing based on how long your state takes to be ready
});
</script>
