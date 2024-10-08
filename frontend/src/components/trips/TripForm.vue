<template>
  <v-form @submit.prevent="submitForm" v-model="isFormValid" ref="form">
    <v-row justify="center">
      <!-- Column 1-->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <v-text-field class="mb-4" label="Trip Title" v-model="trip.title" prepend-inner-icon="mdi-earth"
              :rules="validation.title" />
            <v-textarea class="mb-4" label="Description" v-model="trip.description"
              prepend-inner-icon="mdi-text-box-outline" rows="4" :rules="validation.description" />
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field type="number" label="Price" v-model="trip.price" :prefix="trip.currency"
                  prepend-inner-icon="mdi-cash" :rules="validation.price" />
              </v-col>
              <v-col cols="12" md="4">
                <v-select label="Currency" :items="currencies" v-model="trip.currency"
                  prepend-inner-icon="mdi-currency-eur" />
              </v-col>
            </v-row>
            <v-row>

            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-select label="Transportation" :items="transport" v-model="trip.transport"
                  prepend-inner-icon="mdi-plane-car" multiple chips dense />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="Departure" prepend-inner-icon="mdi-map-marker-check-outline" v-model="trip.departure"
                  :rules="validation.departure" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field type="number" label="Minimum Participants" v-model="trip.minParticipants"
                  prepend-inner-icon="mdi-account-multiple-outline" :rules="validation.minParticipants" />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field type="number" label="Maximum Participants" v-model="trip.maxParticipants"
                  prepend-inner-icon="mdi-account-multiple-outline" :rules="validation.maxParticipants" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-radio-group v-model="tripType" inline @change="handleTripTypeChange">
                  <v-radio label="Single Day Trip" value="singleDay" />
                  <v-radio class="ml-5" label="Multi Day Trip" value="multiDay" />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="tripType == 'singleDay'">
              <v-col cols="12" md="3">
                <v-text-field label="Date" type="date" v-model="trip.startDate" @change="handleDateChange"
                  prepend-inner-icon="mdi-calendar" :rules="validation.startDate" />
              </v-col>
            </v-row>
            <v-row v-if="tripType == 'multiDay'">
              <v-col cols="12" md="3">
                <v-text-field label="Start Date" type="date" v-model="trip.startDate" @change="handleDateChange"
                  prepend-inner-icon="mdi-calendar" :rules="validation.startDateMulti" />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field label="End Date" type="date" v-model="trip.endDate" @change="handleDateChange"
                  prepend-inner-icon="mdi-calendar" :rules="validation.endDate" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="text-h6 mb-2 font-weight-bold">
                  Destinations
                </p>
                <v-text-field v-for="(destination, index) in trip.destinations" :key="index"
                  v-model="trip.destinations[index]" :label="'Destination #' + (index + 1)"
                  prepend-inner-icon="mdi-map-marker-check" :rules="validation.destination">
                  <template v-slot:append>
                    <v-icon icon="mdi-arrow-up" color="green" @click="moveDestinationUp(index)" />
                    <v-icon class="ml-2" icon="mdi-arrow-down" color="green" @click="moveDestinationDown(index)" />
                    <v-icon class="ml-2" icon="mdi-delete" color="red" @click="removeDestination(index)" />
                  </template>
                </v-text-field>
                <v-btn @click="trip.destinations.push('')">Add destination</v-btn>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>

      <!-- Column 2-->
      <v-col cols="12" md="4" sm="12">
        <!--       Actions-->
        <v-row class="mb-1">
          <v-col cols="12" md="12" sm="12" lg="12">
            <router-link :to="`/trip/${this.id}`" target="_blank">
              <v-btn v-show="true" prepend-icon="mdi-eye" width="100%">
                View this trip
              </v-btn>
            </router-link>
          </v-col>
          <!-- <v-col cols="12" md="12" sm="12" lg="6">
            <v-btn v-show="true" prepend-icon="mdi-delete" color="red" width="100%">
              Delete
            </v-btn>
          </v-col> -->
        </v-row>
        <!--      Featured Image-->
        <v-card>
          <v-card-text>
            <v-file-input label="Featured Image" prepend-inner-icon="mdi-paperclip" prepend-icon=""
              @change="onFileChange"></v-file-input>
            <v-card class="mx-auto" height="300px" :image="featuredImageUrl">
            </v-card>
          </v-card-text>
        </v-card>


        <!-- Participants -->
        <v-card class="mt-3">
          <v-card-text>
            <v-card-title>
              <div class="text-h6 font-weight-bold">
                Participants
              </div>
              <TripParticipants :id="id" />
            </v-card-title>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <div class="text-h6 font-weight-bold">
              Itinerary
            </div>
          </v-card-title>
          <v-card-text v-if="trip.startDate == ''">
            <p>Please add date.</p>
          </v-card-text>
          <v-card-text v-else>
            <v-row>
              <v-col md="12" xl="8">
                <v-expansion-panels v-model="expandItineraryDays">
                  <v-expansion-panel v-for="(day, dayIndex) in trip.itinerary" :key="dayIndex" :value="dayIndex">
                    <v-expansion-panel-title>
                      <template v-slot:default="{ expanded }">
                        <v-row no-gutters>
                          <v-col cols="4" class="d-flex justify-start">
                            {{ dayIndex }}
                          </v-col>
                          <v-col cols="8" class="text-grey">
                            <v-fade-transition leave-absolute>
                              <span v-if="expanded" key="0">
                                Fill details for this day
                              </span>
                              <span v-else key="1">
                                {{ day.title }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                        </v-row>
                      </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-text-field placeholder="Day Title" v-model="day.title"
                        :rules="validation.itineraryItemTitle"></v-text-field>
                      <v-textarea placeholder="Day Description" rows="2" v-model="day.description"
                        :rules="validation.itineraryItemDescription"></v-textarea>

                      <p class="text-h6 mb-2 font-weight-bold">
                        Objectives
                      </p>
                      <v-text-field v-for="(objective, index) in day.objectives" :key="index"
                        v-model="day.objectives[index]" :label="'Objective #' + (index + 1)"
                        prepend-inner-icon="mdi-map-marker-star" :rules="validation.itineraryItemObjective">
                        <template v-slot:append>
                          <v-icon icon="mdi-arrow-up" color="green" @click="moveObjectiveUp(day, index)" />
                          <v-icon class="ml-2" icon="mdi-arrow-down" color="green"
                            @click="moveObjectiveDown(day, index)" />
                          <v-icon class="ml-2" icon="mdi-delete" color="red" @click="removeObjective(day, index)" />

                        </template>
                      </v-text-field>
                      <v-btn @click="day.objectives.push('')">Add Objective</v-btn>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-btn color="red" type="submit" :disabled="!isFormValid">{{ btnText }}</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import TripParticipants from "./TripParticipants.vue";
import { toast } from "vue3-toastify";
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TripForm',
  components: {
    TripParticipants
  },
  props: ['id'],
  data() {
    return {
      trip: {
        title: '',
        description: '',
        price: '',
        currency: 'RON',
        transport: [],
        departure: '',
        minParticipants: '',
        maxParticipants: '',
        startDate: '',
        endDate: '',
        destinations: [''],
        itinerary: {},
      },
      isFormValid: true,
      validation: {
        "title": [
          v => !!v || 'Title is required',
          v => (v && v.length > 5) || 'Title must be more than 5 characters',
          v => (v && v.length < 100) || 'Title must be less than 100 characters'
        ],
        "description": [
          v => !!v || 'Description is required',
          v => (v && v.length > 10) || 'Description must be more than 10 characters',
          v => (v && v.length < 1000) || 'Description must be less than 1000 characters'
        ],
        "departure": [
          v => !!v || 'Departure is required',
          v => (v && v.length > 2) || 'Departure must be more than 2 characters'
        ],
        "price": [
          v => !!v || 'Price is required',
          v => (v && v > 0) || 'Price must be more than 0'
        ],
        "minParticipants": [
          v => !!v || 'Minimum participants is required',
          v => (v && v > 0) || 'Minimum participants must be more than 0'
        ],
        "maxParticipants": [
          v => !!v || 'Maximum participants is required',
          v => (v && v > 0) || 'Maximum participants must be more than 0'
        ],
        "startDate": [
          v => !!v || 'Start date is required',
        ],
        "startDateMulti": [
          v => !!v || 'Start date is required',
          v => (v != '' && v < this.trip.endDate) || 'Start date must be less than end date'
        ],
        "endDate": [
          v => !!v || 'End date is required',
          v => (v != '' && v > this.trip.startDate) || 'End date must be greater than start date'
        ],
        "destination": [
          v => !!v || 'Destination is required',
        ],
        "itineraryItemTitle": [
          v => !!v || 'Title is required',
        ],
        "itineraryItemDescription": [
          v => !!v || 'Description is required',
          v => (v && v.length > 10) || 'Description must be more than 10 characters'
        ],
        "itineraryItemObjective": [
          v => !!v || 'Objective is required',
        ]
      },
      currencies: ['RON', 'EUR'],
      transport: ['bus', 'plane', 'ship'],
      tripType: 'singleDay',
      selectedItineraryDay: '',
      expandItineraryDays: [],
      featuredImageFile: null,
      featuredImageUrl: "/assets/placeholder.webp",

    }
  },
  created() {
    this.fetchTrip();
  },
  computed: {
    mode() {
      return this.id ? "edit" : "add"
    },
    btnText() {
      return this.id ? "Update Trip" : "Add new Trip"
    },
  },

  methods: {
    ...mapActions('trips', ['fetchItem', 'addItem', 'editItem']),
    fetchTrip() {
      if (this.id !== undefined) {
        this.fetchItem(this.id)
          .then((response) => {
            this.trip = {
              title: response.data.result.title,
              description: response.data.result.description,
              price: response.data.result.price,
              currency: response.data.result.currency,
              transport: response.data.result.transport,
              departure: response.data.result.departure,
              minParticipants: response.data.result.minParticipants,
              maxParticipants: response.data.result.maxParticipants,
              startDate: response.data.result.startDate,
              endDate: response.data.result.endDate,
              destinations: response.data.result.destinations,
              itinerary: response.data.result.itinerary
            }
            if(response.data.result.featuredImage){
              this.featuredImageUrl = response.data.result.featuredImage;
            }
          })
          .catch((error) => {
            this.$router.push('/not-found')
          })
      }
    },

    /**
     * Handle featured image
     */

    onFileChange(e) {
      this.featuredImageFile = e.target.files[0];

      if (this.featuredImageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          this.featuredImageUrl = reader.result;
        };
        reader.readAsDataURL(this.featuredImageFile);
      } else {
        this.featuredImageUrl = "/assets/placeholder.webp";
      }
    },

    /**
     * Handle field change
     */

    handleTripTypeChange() {
      this.trip.endDate = '';
    },
    handleDateChange() {
      const startDate = new Date(this.trip.startDate);
      let endDate = new Date(this.trip.endDate);
      if (this.trip.endDate == '') {
        endDate = new Date(startDate);
      }

      // Clear existing itinerary
      const oldItinerary = this.trip.itinerary;
      this.trip.itinerary = {};

      // Iterate through each day between start and end date
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        if (formattedDate in oldItinerary) {
          this.trip.itinerary[formattedDate] = oldItinerary[formattedDate];
        } else {
          this.trip.itinerary[formattedDate] = {
            title: "",
            description: "",
            objectives: ['']
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.selectedDate = Object.keys(this.trip.itinerary)[2];
    },

    /**
     * Handle the form movable fields
     */
    async removeDestination(index) {
      if (this.trip.destinations.length - 1 === 0) {
        toast.error("You must have at least one destination.")
        return
      }
      this.trip.destinations.splice(index, 1);
      await this.$refs.form.validate()
    },
    async moveDestinationUp(index) {
      if (index > 0) {
        let temp = this.trip.destinations[index];
        this.trip.destinations[index] = this.trip.destinations[index - 1];
        this.trip.destinations[index - 1] = temp;
      }
      await this.$refs.form.validate()
    },
    async moveDestinationDown(index) {
      if (index < this.trip.destinations.length - 1) {
        let temp = this.trip.destinations[index];
        this.trip.destinations[index] = this.trip.destinations[index + 1];
        this.trip.destinations[index + 1] = temp;
      }
      await this.$refs.form.validate()
    },
    async removeObjective(day, index) {
      day.objectives.splice(index, 1);
      await this.$refs.form.validate()
    },
    moveObjectiveUp(day, index) {
      if (index > 0) {
        let temp = day.objectives[index];
        day.objectives[index] = day.objectives[index - 1];
        day.objectives[index - 1] = temp;
      }
    },
    moveObjectiveDown(day, index) {
      if (index < day.objectives.length - 1) {
        let temp = day.objectives[index];
        day.objectives[index] = day.objectives[index + 1];
        day.objectives[index + 1] = temp;
      }
    },

    expandItinerary() {
      const startDate = new Date(this.trip.startDate);
      let endDate = new Date(this.trip.endDate);
      if (this.trip.endDate == '') {
        endDate = new Date(startDate);
      }
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        this.expandItineraryDays.push(formattedDate);
      }
    },

    unexpandItinerary() {
      this.expandItineraryDays = [];
    },

    /**
     * Submit
     */

    submitForm() {
      if (this.trip.endDate === '') {
        delete this.trip.endDate;
      }

      if(this.featuredImageFile) {
        this.trip.imageUri = this.featuredImageUrl;
      }

      if (this.id) {
        //Update
        this.editItem({ id: this.id, trip: this.trip })
          .then((response) => {
            toast.success("Trip updated successfully")
          })
          .catch((error) => {
            toast.error("Error updating trip")
          })
      } else {
        //Add
        this.addItem(this.trip)
          .then((response) => {
            toast.success("Trip added successfully")
            this.$router.push('/admin/trips')
          })
          .catch((error) => {
            toast.error("Error adding trip")
          })
      }
    }

  }
}
</script>