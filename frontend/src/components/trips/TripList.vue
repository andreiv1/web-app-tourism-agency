<template>
    <v-row>
        <v-col v-if="isLoading" cols="12" sm="6" md="6" lg="4" v-for="index in 6" :key="index">
            <v-skeleton-loader height="320" type="image, list-item-two-line" />
        </v-col>
        <v-col v-else cols="12" sm="6" md="6" lg="4" v-for="trip in items" :key="trip.id">
            <TripCard :trip="trip" height="100%" />
        </v-col>
    </v-row>
</template>

<script>
import TripCard from './TripCard.vue';

export default {
    name: 'TripList',
    components: {
        TripCard
    },
    props: {
        items: {
            type: Object,
            required: true
        },
        isLoading: {
            type: Boolean,
        }

    },
}
</script>