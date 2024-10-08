<template>
    <v-row>
        <v-col cols="12">
            <h1>Users</h1>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-actions class="d-flex justify-space-between ml-3 mr-3">
                    <router-link to="/admin/users/add">
                        <v-btn color="red" text>
                            Add User
                        </v-btn>
                    </router-link>

                    <v-btn color="red" text :loading="isGenerating" @click="generateFake">
                        Generate Fake Users
                    </v-btn>
                </v-card-actions>
                <v-card-text>
                    <UserTable />
                </v-card-text>
            </v-card>

        </v-col>
    </v-row>
</template>

<script>
import UserTable from '@/components/users/UserTable.vue';
import { mapActions, mapState } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'AdminUsers',
    components: {
        UserTable
    },
    data: () => (
        {
            isGenerating: false,
        }
    ),
    methods: {
        ...mapActions('users', ['generateUsers', 'fetchItems']),
        generateFake() {
            this.isGenerating = true;
            this.generateUsers()
                .then((response) => {
                    toast.success('Fake users generated successfully. Default password: "parola".');
                    this.isGenerating = false;
                    this.fetchItems()
                        .then((response) => {
                            
                        })
                        .catch((err) => {
                            toast.error('Failed to fetch users');
                        });
                })
                .catch((err) => {
                    toast.error('Failed to generate fake users');
                    this.isGenerating = false;
                })

        }
    }
}
</script>