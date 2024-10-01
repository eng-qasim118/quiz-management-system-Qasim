// import { createRouter, createWebHistory } from 'vue-router';
// import store from '@/store'; // Import the store directly, assuming your store is set up

// import StudentPage from '@/views/StudentPage.vue';
// import DashboardPage from '@/views/DashboardPage.vue';

// const routes = [{
//         path: '/',
//         name: 'StudentPage',
//         component: StudentPage,
//     },
//     {
//         path: '/dashboard',
//         name: 'Dashboard',
//         component: DashboardPage,
//         // meta: { requiresAuth: true }, // Uncomment this if you want to enable role-based auth later
//     }, ,
//     {
//         path: '/admin-dashboard',
//         name: 'AdminDashboard',
//         component: () =>
//             import ('@/views/AdminDashboard.vue'),
//         meta: { requiresAuth: true, role: 'admin' },
//         children: [{
//                 path: '',
//                 name: 'AddManager',
//                 component: () =>
//                     import ('../components/admin/AddManager.vue'), // Adjust the path as necessary
//             }, {
//                 path: 'add-manager',
//                 name: 'AddManager',
//                 component: () =>
//                     import ('../components/admin/AddManager.vue'), // Adjust the path as necessary
//             },
//             {
//                 path: 'assign-quiz',
//                 name: 'AssignQuiz',
//                 component: () =>
//                     import ('../components/admin/AssignQuiz.vue'), // Adjust the path as necessary
//             },
//             {
//                 path: 'view-quizzes',
//                 name: 'ViewQuizzes',
//                 component: () =>
//                     import ('../components/admin/ViewQuizzes.vue'), // Adjust the path as necessary
//             },
//             {
//                 path: 'view-requests',
//                 name: 'ViewRequests',
//                 component: () =>
//                     import ('../components/admin/ViewRequests.vue'), // Adjust the path as necessary
//             },
//         ],
//     },
//     {
//         path: '/manager-dashboard',
//         name: 'ManagerDashboard',
//         component: () =>
//             import ('@/views/ManagerDashboard.vue'),
//         meta: { requiresAuth: true, role: 'manager' },
//     },
//     {
//         path: '/student-dashboard',
//         name: 'StudentDashboard',
//         component: () =>
//             import ('@/views/StudentDashboard.vue'),
//         meta: { requiresAuth: true, role: 'student' },
//     },
//     // Other routes...
// ];

// const router = createRouter({
//     history: createWebHistory(
//         import.meta.env.BASE_URL),
//     routes,
// });

// // Navigation guard for role-based access
// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token');
//     const role = store.getters.getUserRole; // Use the store directly, no useStore() here

//     if (to.meta.requiresAuth && !token) {
//         next({ name: 'Login' });
//         return;
//     }

//     if (to.meta.role && to.meta.role !== role) {
//         next({ name: 'Unauthorized' });
//         return;
//     }

//     next();
// });

// export default router;


// import { createRouter, createWebHistory } from 'vue-router';
// import store from '@/store';

// import StudentPage from '@/views/StudentPage.vue';
// import DashboardPage from '@/views/DashboardPage.vue';

// const routes = [{
//         path: '/',
//         name: 'StudentPage',
//         component: StudentPage,
//     },
//     {
//         path: '/dashboard',
//         name: 'Dashboard',
//         component: DashboardPage,
//         meta: { requiresAuth: true },
//         children: [{
//                 path: '',
//                 name: 'DashboardHome',
//                 component: () =>
//                     import ('../components/admin/AddUser.vue'),
//                 meta: { role: 'admin' },
//             },
//             {
//                 path: '',
//                 name: 'AssignQuizzes',
//                 component: () =>
//                     import ('../components/student/AssignQuizzes.vue'),
//                 meta: { role: 'student' },
//             },
//             {
//                 path: 'add-user',
//                 name: 'AddUser', // Ensure unique name
//                 component: () =>
//                     import ('../components/admin/AddUser.vue'),
//                 meta: { role: 'admin' },
//             },
//             {
//                 path: 'create-quiz',
//                 name: 'CreateQuiz',
//                 component: () =>
//                     import ('../components/admin/CreateQuiz.vue'),
//                 meta: { role: 'admin' },
//             },
//             {
//                 path: 'assign-quiz',
//                 name: 'AssignQuiz',
//                 component: () =>
//                     import ('../components/admin/AssignQuiz.vue'),
//                 meta: { role: 'admin' },
//             },
//             {
//                 path: 'view-quizzes',
//                 name: 'ViewQuizzes',
//                 component: () =>
//                     import ('../components/admin/ViewQuizzes.vue'),
//                 meta: { role: 'admin' },
//             },
//             {
//                 path: 'view-requests',
//                 name: 'ViewRequests',
//                 component: () =>
//                     import ('../components/admin/ViewRequests.vue'),
//                 meta: { role: 'admin' },
//             },
//             {
//                 path: 'quizzes',
//                 name: 'AssignQuizzes',
//                 component: () =>
//                     import ('../components/student/AssignQuizzes.vue'),
//                 meta: { role: 'student' },
//             },
//         ],
//     },
//     {
//         path: '/set-password',
//         name: 'SetPassword',
//         component: () =>
//             import ('../views/SetPassword.vue'),
//     }
// ];

// const router = createRouter({
//     history: createWebHistory(
//         import.meta.env.BASE_URL),
//     routes,
// });

// // Navigation guard for role-based access
// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token');
//     const role = localStorage.getItem('userRole'); // Get the role from local storage

//     // Redirect to login if not authenticated
//     if (to.meta.requiresAuth && !token) {
//         next({ name: 'Login' });
//     } else {
//         next(); // Proceed to the next route
//     }
// });
// export default router;


import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

import StudentPage from '@/views/StudentPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';

const routes = [{
        path: '/',
        name: 'StudentPage',
        component: StudentPage,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
        children: [{
                path: 'quizzes',
                name: 'AssignQuizzes',
                component: () =>
                    import ('../components/student/AssignQuizzes.vue'),
                meta: { role: 'student' },
            },

            {
                path: 'quizzes-result',
                name: 'QuizzesResult',
                component: () =>
                    import ('../components/student/QuizzesResult.vue'),
                meta: { role: 'student' },
            },
            {
                path: 'add-user',
                name: 'AddUser',
                component: () =>
                    import ('../components/admin/AddUser.vue'),
                meta: { role: 'admin' },
            },
            {
                path: 'create-quiz',
                name: 'CreateQuiz',
                component: () =>
                    import ('../components/admin/CreateQuiz.vue'),
                meta: { role: 'admin' },
            },
            {
                path: 'assign-quiz',
                name: 'AssignQuiz',
                component: () =>
                    import ('../components/admin/AssignQuiz.vue'),
                meta: { role: 'admin' },
            },
            {
                path: 'view-quizzes',
                name: 'ViewQuizzes',
                component: () =>
                    import ('../components/admin/ViewQuizzes.vue'),
                meta: { role: 'admin' },
            },
            {
                path: 'view-requests',
                name: 'ViewRequests',
                component: () =>
                    import ('../components/admin/ViewRequests.vue'),
                meta: { role: 'admin' },
            },
            {
                path: 'view-results',
                name: 'ViewResults',
                component: () =>
                    import ('../components/admin/ViewResults.vue'),
                meta: { role: 'admin' },
            },
        ],
    },
    {
        path: '/set-password',
        name: 'SetPassword',
        component: () =>
            import ('../views/SetPassword.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes,
});

// Navigation guard for role-based redirection
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole'); // Get the role from local storage

    // Redirect to login if not authenticated
    if (to.meta.requiresAuth && !token) {
        return next({ name: 'Login' });
    }

    // Check if the user is navigating to the dashboard and redirect based on role
    if (to.name === 'Dashboard') {
        if (role === 'admin') {
            // Redirect admin to add-user
            return next({ name: 'AddUser' });
        } else if (role === 'student') {
            // Redirect student to assign-quizzes
            return next({ name: 'AssignQuizzes' });
        }
    }

    next(); // Proceed to the next route
});

export default router;