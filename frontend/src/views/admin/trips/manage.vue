<template>
    <v-row>
        <v-col cols="12">
            <h1>{{ title }}</h1>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <TripForm :id="id" />
        </v-col>
    </v-row>
</template>

<script>
import TripForm from '@/components/trips/TripForm.vue'
export default {
    name: 'AdminManageTrip',
    components: {
        TripForm
    },

    data() {
        return {
            id: this.$route.params.id
        }
    },
}
</script>