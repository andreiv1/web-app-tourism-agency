<template>
    <TripDetails :id="tripId"/>
</template>

<script>
import TripDetails from '@/components/trips/TripDetails.vue';

import { mapActions } from 'vuex';
export default {
    name: 'TripView',
    components: {
        TripDetails
    },
    computed:{
        tripId(){
            return this.$route.params.id;
        }
    }

}
</script>