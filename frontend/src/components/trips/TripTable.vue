<template>
  <v-container>
    <v-data-table-server :items="adminItems" :items-length="paginationAdmin.total" :loading="loading" :headers="headers"
      :items-per-page-options="itemsPerPageOptions" :footer-props="{ 'items-per-page-options': opts }"
      @update:options="loadItems">
      <template v-slot:item.dateAdded="{ item }">
        {{ item.dateAdded.split('T')[0] }}
      </template>
      <template v-slot:item.participants="{ item }">
        <v-chip :color="getColor(item)">
          {{ item.currentParticipants }} / {{ item.maxParticipants }}
        </v-chip>

      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editRow(item)">mdi-pencil</v-icon>
        <v-icon small @click="delRow(item)">mdi-delete</v-icon>
      </template>
    </v-data-table-server>
  </v-container>

  <v-dialog v-model="deleteDialog" persistent width="auto">
    <v-card>
      <v-card-title class="text-h5">
        This action is ireversibile

      </v-card-title>
      <v-card-text> Are you sure you want to delete this trip:
        <p><strong>Title</strong>: {{ toDeleteTrip?.title }}</p>
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
  name: "TripTable",

  data() {
    return {
      itemsPerPageOptions: [
        { value: 10, title: '10' },
        { value: 25, title: '25' },
        { value: 50, title: '50' },
      ],
      loading: false,
      toDeleteTrip: null,
      deleteDialog: false,
      headers: [
        { title: 'Title', key: 'title', sortable: false, width: '50%' },
        { title: 'Price', key: 'price', sortable: false, width: '5%' },
        { title: 'Start Date', key: 'startDate', sortable: false, width: '10%' },
        { title: 'End Date', key: 'endDate', sortable: false, width: '10%' },
        { title: 'Date Added', key: 'dateAdded', sortable: false, width: '10%' },
        { title: 'Participants', key: 'participants', sortable: false },
        { title: 'Actions', key: 'actions', sortable: false },
      ]
    }
  },

  computed: {
    ...mapState('trips', ['adminItems', 'paginationAdmin']),
  },
  methods: {
    ...mapActions('trips', ['fetchAdminItems', 'deleteItem']),
    getColor(item) {
      const ratio = item.currentParticipants / item.maxParticipants
      if (ratio < 0.5) return 'green'
      else if (ratio < 0.8) return 'orange'
      else return 'red'
    },
    editRow(item) {
      this.$router.push(`/admin/trips/edit/${item.id}`)
    },
    delRow(item) {
      this.toDeleteTrip = item;
      this.deleteDialog = true;
    },
    loadItems({ page, itemsPerPage, sortBy }) {
      console.log(page, itemsPerPage, sortBy)
      this.loading = true;
      this.fetchAdminItems({
        page,
        take: itemsPerPage
      }).then(() => {
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    cancelDelete() {
      this.deleteDialog = false;
    },

    confirmDelete() {
      this.deleteDialog = false;
      this.deleteItem(this.toDeleteTrip.id)
        .then(() => {
          toast.success('Trip deleted successfully');
          this.fetchAdminItems()
            .then(() => {

            })
            .catch(() => {
              toast.error('Failed to fetch trips');
            });
        })
        .catch(() => {
          toast.error('Error deleting trip');
        });

    }
  }
}
</script>