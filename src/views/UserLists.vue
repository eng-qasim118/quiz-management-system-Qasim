<template>
    <div>
        <h1>User List</h1>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }}
                <button @click="editUser(user)">Edit</button>
            </li>
        </ul>
        <input v-model="newUserName" placeholder="Add new user" />
        <button @click="addUser">Add User</button>
        <input v-model="editUserName" v-if="editingUser" placeholder="Edit user" />
        <button @click="updateUser" v-if="editingUser">Update User</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            users: [],
            newUserName: '',
            editingUser: null,
            editUserName: ''
        };
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await axios.get('http://localhost:3000/users');
                this.users = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async addUser() {
            try {
                const response = await axios.post('http://localhost:3000/users', {
                    name: this.newUserName
                });
                this.users.push(response.data);
                this.newUserName = '';
            } catch (error) {
                console.error('Error adding user:', error);
            }
        },
        editUser(user) {
            this.editingUser = user.id;
            this.editUserName = user.name;
        },
        async updateUser() {
            try {
                const response = await axios.put(`http://localhost:3000/users/${this.editingUser}`, {
                    name: this.editUserName
                });
                const userIndex = this.users.findIndex(user => user.id === this.editingUser);
                this.users[userIndex] = response.data;
                this.editingUser = null;
                this.editUserName = '';
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    }
};
</script>
