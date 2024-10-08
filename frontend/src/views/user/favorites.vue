<template>
  <v-container>
    <v-row>
      <h1>Favorites</h1>
    </v-row>
    <v-row>
      <TripList :items="favorites" />
    </v-row>
    <v-row v-if="favorites.length === 0 && !isLoading">
      <div>
        <h3>You have no trip added to favorites.</h3>
        <p>When viewing a trip details, you can add it to favorites by clicking <v-btn class="mr-3" icon :disabled="true">
            <v-icon color="grey-darken-1">mdi-heart</v-icon>
          </v-btn></p>

        <router-link to="/trips">
          <v-btn color="red" class="mt-5">Browse trips</v-btn>
        </router-link>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import TripList from "@/components/trips/TripList.vue";

export default {
  name: 'UserFavorites',
  components: { TripList },
  data() {
    return {
      isLoading: false,
      favorites: []
    }
  },
  created() {
    this.isLoading = true
    this.fetchFavorites().then((res) => {
      console.log('Favorites fetched')
      console.log(res)
      this.favorites = res.data.result
      this.isLoading = false
    }).catch((err) => {
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions('users', ['fetchFavorites']),
  }
}
</script>