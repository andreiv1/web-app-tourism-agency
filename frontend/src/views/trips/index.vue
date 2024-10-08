<template>
    <v-container>
        <v-row justify="center" fluid>
            <v-col :cols="cols[0]">
                <TripSearchBar />
            </v-col>
            <v-col :cols="cols[1]" class="mb-5">
                <TripSortButton />
            </v-col>
        </v-row>
        <v-row>
            <TripList :items="items" :isLoading="isLoading" />
        </v-row>

        <v-row justify="center" class="mt-5" v-if="items.length > 0">
            <v-col cols="8">
                <TripPagination />
            </v-col>
        </v-row>
        <v-row justify="center" class="mt-5" v-else>
            <v-col cols="8">
                <p class="text-center">
                    <h3>Sorry, no trips found</h3>
                </p>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import TripSortButton from '@/components/trips/TripSortButton.vue';
import TripSearchBar from '@/components/trips/TripSearchBar.vue';
import TripList from '@/components/trips/TripList'

import { mapState, mapActions } from 'vuex';

import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import TripPagination from '@/components/trips/TripPagination.vue';

export default {
    name: 'TripsHome',
    components: {
        TripSortButton,
        TripList,
        TripSearchBar,
        TripPagination
    },
    computed: {
        cols() {
            const { lg, md, sm, xs } = this.$vuetify.display
            return lg ? [10, 2]
                : md ? [8, 4]
                    : sm ? [7, 4]
                        : xs ? [12, 12]
                            : [10, 2]

        },
        ...mapState('trips', ['items', 'isLoading']),
    },
    created() {
        this.fetchItems().then(() => {
    
        }).catch((err) => {
            toast.error("Error. Please retry later.", {
                timeout: 2000
            });
        })

    },
    methods: {
        ...mapActions('trips', ['fetchItems']),
    },
}
</script>
