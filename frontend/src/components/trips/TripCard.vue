<template>
    <v-card class="w-100 d-flex flex-column">
        <v-img class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" cover :src="image">
            <div class="d-flex justify-end mb-2 mr-2">
                <div class="text-right bg-white py-1 px-2">
                    <span class="text-h8 font-weight-bold">
                        <v-icon icon="mdi-cash"></v-icon>
                        {{ trip.price }} {{ trip.currency }}</span>
                </div>
            </div>
        </v-img>
        <v-card-title class="text-h5 text-wrap font-weight-medium">{{ trip.title }}</v-card-title>
        <v-card-subtitle class="mt-2">
        </v-card-subtitle>
        <v-card-text>
            <div>
                <v-icon class="mr-1 mb-1" icon="mdi-calendar"></v-icon> {{ showDate }}
            </div>
            <div>
                <v-icon class="mr-1 mb-1" icon="mdi-map-marker"></v-icon> {{ destinations }}
            </div>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-text>
            <v-row class="justify-end mb-1 mr-1">
                <router-link :to="`/trip/${trip.id}`">
                    <v-btn color="red">View details</v-btn>
                </router-link>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { getImage, getDate } from '@/utils/tripsUtils'
export default {
    name: 'TripCard',
    props: {
        trip: {
            type: Object,
            required: true
        }
    },
    computed: {
        image() {
            return getImage(this.trip.featuredImage)
        },
        showDate() {
            return getDate(this.trip.startDate, this.trip.endDate)
        },
        destinations() {
            return this.trip.destinations.join(', ')
        }
    }
}
</script>
<style>

</style>