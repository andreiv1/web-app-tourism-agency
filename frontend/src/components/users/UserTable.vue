<template>
    <v-container>
        <v-data-table-server :items="items" :items-length="pagination.total" :loading="loading" :headers="headers"
            :items-per-page-options="itemsPerPageOptions" @update:options="loadItems">
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editRow(item)">mdi-pencil</v-icon>
                <v-icon small @click="delRow(item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>
    </v-container>


    <v-dialog v-model="deleteDialog" persistent width="auto">
        <v-card>
            <v-card-title class="text-h5 text-center">
                This action is cannot be undone

            </v-card-title>
            <v-card-text> Are you sure you want to delete this user:
                <p><strong>Name: </strong> {{ toDeleteUser?.firstName }} {{ toDeleteUser?.lastName }}</p>
                <p><strong>Email: </strong> {{ toDeleteUser?.email }}</p>
                <p><strong>Phone: </strong> {{ toDeleteUser?.phoneNumber }}</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-3" variant="text" @click="cancelDelete">
                    Cancel
                </v-btn>
                <v-btn color="red" variant="text" @click="confirmDelete">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: "UserTable",
    data() {
        return {
            itemsPerPageOptions: [
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
            ],
            loading: false,
            toDeleteUser: null,
            deleteDialog: false,
            headers: [
                { title: 'First Name', key: 'firstName', sortable: false, width: '15%' },
                { title: 'Last Name', key: 'lastName', sortable: false, width: '15%' },
                { title: 'Email', key: 'email', sortable: false, width: '20%' },
                { title: 'Phone', key: 'phoneNumber', sortable: false, width: '15%' },
                { title: 'Type', key: 'type', sortable: false, width: '10%' },
                { title: 'Date Added', key: 'dateAdded', sortable: false, width: '15%' },
                { title: 'Actions', key: 'actions', sortable: false },
            ]
        }
    },
    computed: {
        ...mapState('users', ['items', 'pagination'])
    },
    methods: {
        ...mapActions('users', ['fetchItems', 'deleteItem']),
        loadItems({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            this.fetchItems({
                page,
                take: itemsPerPage
            }).then(() => {
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        editRow(item) {
            this.$router.push(`/admin/users/edit/${item.id}`)
        },
        delRow(item) {
            this.toDeleteUser = item;
            this.deleteDialog = true;
        },
        cancelDelete() {
            this.deleteDialog = false;
        },
        confirmDelete() {
            this.deleteDialog = false;

            this.deleteItem(this.toDeleteUser.id)
                .then(() => {
                    toast.success('User deleted successfully');
                    this.fetchItems()
                        .then(() => {

                        })
                        .catch(() => {
                            toast.error('Failed to fetch users');
                        });
                })
                .catch((err) => {
                    console.log(err)
                    toast.error(`Error: ${err.response.data.message}`);
                })


            this.toDeleteUser = null;
        }
    },


}
</script>