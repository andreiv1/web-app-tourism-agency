<template>
  <v-form v-model="isFormValid" @submit.prevent="submitForm">
    <!-- User Details -->
    <v-row>
      <v-col cols="12" lg="6">
        <h3 class="mb-2">Details</h3>
        <v-text-field v-model="user.firstName" label="First Name" prepend-inner-icon="mdi-account"></v-text-field>
        <v-text-field v-model="user.lastName" label="Last Name" prepend-inner-icon="mdi-account"></v-text-field>
        <v-text-field prepend-inner-icon="mdi-calendar" label="Birth Date" type="date"
          v-model="user.birthDate"></v-text-field>
        <v-select :prepend-inner-icon="genderIcon" v-model="user.gender" label="Gender" :items="genders"></v-select>
        <v-select prepend-inner-icon="mdi-account-multiple" v-model="user.type" label="Type" :items="types"></v-select>
      </v-col>
    </v-row>

    <!-- Contact Information -->
    <v-row>
      <v-col cols="12" lg="6">
        <h3 class="mb-2">Contact</h3>
        <v-text-field prepend-inner-icon="mdi-phone" v-model="user.phoneNumber" label="Phone Number"
          clearable></v-text-field>
        <v-text-field prepend-inner-icon="mdi-email" v-model="user.email" label="Email" clearable></v-text-field>
        <v-text-field prepend-inner-icon="mdi-lock" v-model="password" label="Change Password" type="password"
          hint="Leave blank if you don't want to change current password"
          autocomplete="new-password" :rules="[rules.password]" clearable></v-text-field>
      </v-col>
    </v-row>



    <!-- Trips and Favorites -->
    <v-row v-if="id !== undefined">
      <v-col cols="12" lg="6">
        <h3 class="mb-2">Trips</h3>
        <v-data-table v-if="trips.length > 0" :items="trips" :headers="tableHeaders">
          <template #bottom></template>
          <template v-slot:item.title="{ item }">
            <router-link :to="`/admin/trips/edit/${item.id}`">{{ item.title }}</router-link>
          </template>
        </v-data-table>
        <p v-if="trips.length === 0">This user hasn't joined any trips yet.</p>

        <h3 class="mt-5">Favorites</h3>
        <v-data-table v-if="favorites.length > 0" :items="favorites" :headers="tableHeaders">
          <template #bottom></template>
          <template v-slot:item.title="{ item }">
            <router-link :to="`/admin/trips/edit/${item.id}`">{{ item.title }}</router-link>
          </template>
        </v-data-table>
        <p v-if="favorites.length === 0">This user hasn't added any trips to favorites yet.</p>
      </v-col>
    </v-row>

    <!-- Update Profile Button -->
    <v-row>
      <v-col cols="12" class="d-flex justify-end" lg="6">
        <v-btn color="red" type="submit" :disabled="!isFormValid">{{ btnText }}</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
  

<script>
import { toast } from 'vue3-toastify';
import { mapActions } from 'vuex';

export default {
  name: 'UserForm',
  props: ['id'],
  data() {
    return {
      types: ['tourist', 'admin'],
      genders: ['M', 'F'],
      user: {
        birthDate: '',
        dateAdded: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: 'M',
        phoneNumber: '',
        type: 'tourist'
      },
      isFormValid: false,
      password: '',
      tableHeaders: [
        { title: 'Title', key: 'title', sortable: true, width: '50%' },
        { title: 'Start Date', key: 'startDate', sortable: true },
        { title: 'End Date', key: 'endDate', sortable: true },
        { title: 'Price', key: 'price', sortable: true },
      ],

      trips: [],
      favorites: [],
      rules: {
        password: v => (!v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/.test(v)) || 'Password must contain at least 5 characters, one uppercase letter and one number if completed',
      }
    };
  },
  computed: {
    gender() {
      return this.user.gender === 'M' ? 'Male' : 'Female';
    },
    genderIcon() {
      return this.user.gender === 'M' ? 'mdi-gender-male' : 'mdi-gender-female';
    },
    btnText() {
      console.log(this.id)
      return this.id === undefined ? "Add user" : "Update user";
    }
  },
  created() {
    if (this.id === undefined) return;
    this.fetchUser({ id: this.id })
      .then((res) => {
        this.user = res.data.user;
        this.trips = res.data.trips;
        this.favorites = res.data.favorites;
      })
      .catch((err) => {

      });
  },
  methods: {
    ...mapActions('users', ['fetchUser', 'createUser', 'updateUser']),
    submitForm() {
      if (this.id === undefined) {
        //Create
        const data = { ...this.user, password: this.password };
        delete data.dateAdded
        if(data.email === ''){
          delete data.email;
        }
        
        this.createUser({data: data})
          .then((res) => {
            this.$router.push('/admin/users');
          })
          .catch((err) => {
            if(err.response.data !== undefined && err.response.data.message !== undefined)
              toast.error(`Error: ${err.response.data.message}`)
            else
              toast.error('Something went wrong');

          });
      } else {
        //Update
        const data = { ...this.user };
        delete data.dateAdded;
        data.birthDate = new Date(data.birthDate).toISOString().slice(0, 10);
        if (this.password !== '') {
          data.password = this.password;
        }
        if(this.email === ''){
          delete data.email;
        }
        console.log(data)
        this.updateUser({ id: this.id, data: data })
          .then((res) => {
            toast.success('User updated successfully');
          })
          .catch((err) => {
            console.log(err);
            if (err.response.data !== undefined && err.response.data.message !== undefined)
              toast.error(`Error: ${err.response.data.message}`)
            else {
              toast.error('Something went wrong');
            }
          });
      }
    },

  }
}
</script>