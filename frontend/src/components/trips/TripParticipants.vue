<template>
    <v-data-table-virtual :items="participants" :headers="headers" :loading="isLoading">
        <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="viewUser(item.id)">mdi-eye</v-icon>
            <v-icon small class="mr-2" @click="removeUser(item.id)">mdi-delete</v-icon>
        </template>
    </v-data-table-virtual>
</template>

<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: "TripParticipants",
    props: ['id'],
    data() {
        return {
            isLoading: false,
            headers: [
                {title: 'First Name', key: 'firstName', sortable: false},
                {title: 'Last Name', key: 'lastName', sortable: false},
                {title: 'Join Date', key: 'joinDate', sortable: false},
                {title: 'Actions', key: 'actions', sortable: false}
            ],
            participants: [],
            info: {
                current: 0,
                min: 0,
                max: 0
            }
        }
    },
    methods: {
      ...mapActions('trips', ['fetchParticipants', 'deleteParticipant']),
      viewUser(id) {
        this.$router.push(`/admin/users/edit/${id}`)
      },
      removeUser(id) {
        this.deleteParticipant({tripId: this.id, userId: id})
            .then((response) => {
                this.getParticipants()
                toast.success(`Participant deleted successfully`)
            })
            .catch((error) => {
               toast.error(`This participant can't be deleted`)
            });
      },
      getParticipants() {
        if(this.id === undefined) return;
        this.isLoading = true
        this.fetchParticipants(this.id)
            .then((response) => {
                this.participants = response.data.result
                this.info = response.data.info
                this.isLoading = false
            })
            .catch((error) => {
               
            });
      }
    },
    created() {
        this.getParticipants()
    }
}
</script>