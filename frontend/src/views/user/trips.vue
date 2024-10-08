<template>
<!--    <h1>Upcoming trips</h1>-->
<!--    <h1>Previous joined trips</h1>-->
  <v-container>
    <v-row>
      <h1>Upcoming joined trips</h1>
    </v-row>
    <v-row>
      <TripList :items="upcoming"/>
    </v-row>
    <v-row v-if="upcoming.length === 0 && !this.isLoading">
      <p>You haven't joined any upcoming trips yet.</p>
    </v-row>
    <v-row class="mt-10" v-if="previous.length > 0">
      <h1>Previous joined trips</h1>
    </v-row>
    <v-row v-if="previous.length > 0">
      <TripList :items="previous"/>
    </v-row>
  </v-container>
</template>

<script>
import TripList from "@/components/trips/TripList.vue";
import {mapActions} from "vuex";
export default {
    name: 'UserTrips',
  components: {TripList},
  data() {
    return {
      isLoading: false,
      upcoming: [],
      previous: []
    }
  },
  created() {
    this.isLoading = true
    this.fetchMyTrips()
        .then((res) => {

          this.upcoming = res.data.upcoming
          this.previous = res.data.previous
          this.isLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.isLoading = false
        })
  },
  methods: {
      ...mapActions('users', ['fetchMyTrips'])
  }
}
</script>