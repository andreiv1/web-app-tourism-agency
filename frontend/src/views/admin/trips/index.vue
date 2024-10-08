<template>
    <v-row>
        <v-col cols="12">
            <h1>Trips</h1>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-card-actions class="d-flex justify-space-between ml-3 mr-3">
                    <router-link to="/admin/trips/add">
                        <v-btn color="red" text>
                            Add Trip
                        </v-btn>
                    </router-link>

                    <v-btn color="red" text :loading="isGenerating" @click="generateFake">
                        Generate Fake Trips
                    </v-btn>
                </v-card-actions>
                <v-card-text>
                    <TripTable :items="trips" />
                </v-card-text>
            </v-card>

        </v-col>
    </v-row>
</template>

<script>
import TripTable from '@/components/trips/TripTable.vue';
import { mapActions, mapState } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'AdminTrips',
    components: {
        TripTable
    },
    data() {
        return {
            trips: [],
            isGenerating: false,
        }
    },

    methods: {
        ...mapActions('trips', ['generateTrips', 'fetchAdminItems']),
        generateFake() {
            this.isGenerating = true;
            this.generateTrips()
                .then((response) => {
                    toast.success('Fake trips generated successfully');
                    this.isGenerating = false;
                    this.fetchAdminItems()
                        .then((response) => {
                    
                        })
                        .catch((err) => {
                            toast.error('Failed to fetch trips');
                        });
                })
                .catch((err) => {
                    toast.error('Failed to generate fake trips');
                    this.isGenerating = false;
                });
        }
    }
}
</script>