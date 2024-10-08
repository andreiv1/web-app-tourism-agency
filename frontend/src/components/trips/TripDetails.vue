<template>
  <v-row justify="center">
    <v-col cols="12" md="11" xl="8">
      <div class="d-flex justify-space-between align-center">
        <!-- Left side: Title -->
        <div :class="getTitleClass" v-if="!isLoading">{{ trip.title }}</div>
        <v-skeleton-loader v-else type="article" width="100%"></v-skeleton-loader>

        <!-- Right side: Favorite and Share icons -->
        <div class="mb-2" v-if="!isLoading">
          <!-- Add to Favorite (Heart) icon -->
          <v-btn class="mr-3" icon @click="handleFavorite">
            <!-- <v-icon color="red">mdi-heart</v-icon> -->
            <v-icon :color="userTrip.isFavorite ? 'red' : 'grey-darken-1'">mdi-heart</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="text-h6" v-if="!isLoading">{{ showDate }}</div>
      <v-row class="mt-2">
        <!-- Column 1-->
        <v-col cols="12" md="8">
          <v-card>
            <v-skeleton-loader v-if="isLoading" height="300px"></v-skeleton-loader>
            <v-img v-else :src="image" class="align-end h-25 w-100" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              cover>
            </v-img>
          </v-card>
        </v-col>

        <!-- Column 2 -->
        <v-col cols="12" md="4">
          <v-card>
            <template v-if="isLoading">
              <v-skeleton-loader type="list-item-three-line"></v-skeleton-loader>
            </template>
            <template v-else>
              <v-card-title>
                <div>
                  <span class="text-h4 font-weight-bold">
                    <v-icon class="mb-1" icon="mdi-cash"></v-icon>
                    {{ trip.price }}
                    {{ trip.currency }}
                  </span>
                </div>
              </v-card-title>
              <v-card-text class="text-left flex-column">
                <div class="text-p2 font-weight-bold text-medium-emphasis mb-2">
                  <v-icon icon="mdi-calendar" class="mr-1"></v-icon>
                  <b>Days: </b> {{ calculateDays }}
                </div>
                <div class="text-p2 font-weight-bold text-medium-emphasis mb-2">
                  <v-icon icon="mdi-account-multiple-outline" class="mr-1"></v-icon>
                  <b>Group: </b>{{
                    trip.minParticipants
                  }}
                  persons
                </div>
                <div class="text-p2 font-weight-bold text-medium-emphasis mb-2">
                  <v-icon icon="mdi-map-marker" class="mr-1"></v-icon>
                  <b>Departure: </b> {{ trip.departure }}
                </div>
                <div class="text-p2 font-weight-bold text-medium-emphasis mb-2">
                  <v-icon icon="mdi-map-marker-star" class="mr-1"></v-icon>
                  <b>Destinations: </b>
                  <ul class="ml-10">
                    <li v-for="(destination, index) in trip.destinations" :key="index">
                      {{ destination }}
                    </li>
                  </ul>
                </div>
                <div class="text-p2 font-weight-bold text-medium-emphasis mb-2">
                  <v-icon icon="mdi-wallet-travel" class="mr-2"></v-icon>
                  <b>Transport: </b>
                  <div>
                    <v-chip v-for="transport in trip.transport" :key="transport" class="mr-1 mt-1">
                      <v-icon :icon="transportIcons[transport]"></v-icon>
                      {{ transport }}
                    </v-chip>
                  </div>

                </div>
                <v-spacer></v-spacer>
                <v-row class="ml-1 mr-1 mt-5 mb-1">
                  <v-btn color="red" width="100%" :disabled="this.userTrip.isJoined" @click="joinTrip">{{ joinMessage
                  }}</v-btn>
                </v-row>
              </v-card-text>
            </template>
          </v-card>

          <div v-if="user.type === 'admin'">
            <router-link :to="'/admin/trips/edit/' + trip.id">
              <v-btn class="mt-3" v-show="true" prepend-icon="mdi-file-edit" width="100%">
                Edit trip
              </v-btn>
            </router-link>
          </div>

        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row justify="center">
    <v-col cols="12" md="11" xl="8">
      <v-row class="mt-2" v-if="trip.description !== undefined">
        <v-col cols="12" md="8">
          <div class="text-h5 font-weight-bold">Description</div>
          <v-card class="elevation-2 mt-2" outlined fluid>
            <v-card-text>
              <div class="text-p2 text-wrap text-medium-emphasis" v-html="trip.description">
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-2" v-if="trip.itinerary !== undefined">
        <v-col cols="12" md="8">
          <div class="text-h5 font-weight-bold">Itinerary</div>
          <v-timeline side="end">
            <v-timeline-item size="large" dot-color="red" v-for="(tripDay, tripDate) in trip.itinerary" width="100%">
              <template v-slot:icon>
                <v-icon color="white" icon="mdi-walk"></v-icon>
              </template>

              <v-card class="elevation-2" outlined>
                <v-card-title>
                  <div class="text-p2 font-weight-bold text-medium-emphasis text-wrap">
                    {{ tripDate }}
                  </div>
                  <div class="text-h6 font-weight-bold text-wrap">
                    {{ tripDay.title }}
                  </div>
                  <div class="text-p2 text-wrap text-medium-emphasis" v-html="tripDay.description">
                  </div>
                </v-card-title>


                <v-card-text>
                  <span class="text-h6 mt-5" v-if="tripDay.objectives.length > 0">
                    <v-icon icon="mdi-map-marker-circle"></v-icon> Objectives
                  </span>
                  <ul class="ml-15">
                    <li v-for="(obj, objIdx) in tripDay.objectives" :key="objIdx" v-html="obj">
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { getDate, getImage } from '@/utils/tripsUtils'
import { toast } from "vue3-toastify"

export default {
  name: 'TripDetails',
  props: ['id'],
  data() {
    return {
      trip: {
        title: "",
        description: undefined,
        startDate: new Date(),
        endDate: new Date(),
        price: 0,
        currency: "",
        departure: "",
        destinations: [],
        transport: [],
        featuredImage: "",
        itinerary: undefined,
      },
      userTrip: {
        isFavorite: false,
        isJoined: false,
      },
      transportIcons: {
        'plane': 'mdi-airplane',
        'bus': 'mdi-bus',
        'ship': 'mdi-ferry',
      },
      isLoading: true
    }
  },
  created() {
    this.isLoading = true
    this.fetchItem(this.id)
      .then((response) => {
        this.trip = response.data.result
        if (response.data.user) {
          this.userTrip = response.data.user
        }
        this.isLoading = false
      })
      .catch((err) => {
        //redirect to not found
        this.$router.push('/not-found')
      })
  },
  computed: {
    ...mapState('auth', ['user']),
    btnDisabled() {
      return !this.isLogged
    },
    getTitleClass() {
      const { lg, md, sm, xs } = this.$vuetify.display

      sm ? console.log("SM") : console.log("XS")
      if (sm) return ['text-h5', 'w-75']
      else {
        if(xs) return ['text-h6', 'w-75']
        else
          return ['text-h4', 'w-75']
      }
    },
    calculateDays() {
      const start = new Date(this.trip.startDate)
      const end = new Date(this.trip.endDate)
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    image() {
      return getImage(this.trip.featuredImage)
    },
    showDate() {
      return getDate(this.trip.startDate, this.trip.endDate)
    },

    joinMessage() {
      if (this.userTrip.isJoined) {
        return 'You are already joined'
      }
      return 'Join'
    }

  },
  methods: {
    ...mapActions('trips', ['fetchItem', 'addToFavorite', 'userJoinTrip']),
    ...mapGetters('auth', ['isLogged']),
    handleFavorite() {
      console.log("Handle")
      this.addToFavorite(this.id)
        .then((response) => {
          this.userTrip.isFavorite = !this.userTrip.isFavorite
        })
        .catch((err) => {
          if (err.response.status === 401) {
            toast.error("You must be logged in!")
            return
          }
          toast.error("Error saving favorite!")
        })
    },
    joinTrip() {
      this.userJoinTrip(this.id)
        .then((response) => {
          this.userTrip.isJoined = true
  
          toast.success("You joined the trip!")
        })
        .catch((err) => {
          if (err.response.status === 401) {
            toast.error("You must be logged in!")
            return
          }
          toast.error("Error joining the trip!")
        })
    },

  },
}
</script>