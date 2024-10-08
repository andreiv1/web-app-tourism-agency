<template>
    <v-form>
        <v-row>
            <v-col cols="12">
                <h3 class="mb-2">Details</h3>
                <v-text-field v-model="user.firstName" label="First Name" disabled
                    prepend-inner-icon="mdi-account"></v-text-field>
                <v-text-field v-model="user.lastName" label="Last Name" disabled
                    prepend-inner-icon="mdi-account"></v-text-field>
                <v-text-field prepend-inner-icon="mdi-calendar" label="Birth Date" type="date" v-model="user.birthDate"
                    disabled></v-text-field>
                <v-text-field :prepend-inner-icon="genderIcon" v-model="gender" label="Gender" disabled></v-text-field>
                <v-text-field prepend-inner-icon="mdi-account-multiple" v-model="user.type" label="Type"
                    disabled></v-text-field>
                <p>Above fields can be modified only by our support team.</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <h3 class="mb-2">Contact</h3>
                <v-text-field prepend-inner-icon="mdi-phone" v-model="user.phoneNumber" label="Phone Number"
                    :rules="[rules.numberRequired, rules.numberLength, rules.numberPrefix]"></v-text-field>
                <v-text-field prepend-inner-icon="mdi-email" v-model="user.email" label="Email"
                    :rules="[rules.email]"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <h3 class="mb-1">Change password</h3>
                <v-text-field prepend-inner-icon="mdi-lock" v-model="password" label="Password" type="password"
                    :rules="[rules.password]"></v-text-field>
                <v-text-field prepend-inner-icon="mdi-lock" v-model="confirmPassword" label="Confirm Password"
                    type="password" :rules="[v => v === this.password || 'Passwords do not match']"></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" class="d-flex justify-end">
                <v-btn color="red" @click="handleSubmit">Update Profile</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
  
<script>
import { mapActions, mapMutations } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'UserProfileForm',
    data() {
        return {
            user: {
                birthDate: '',
                dateAdded: '',
                firstName: '',
                lastName: '',
                email: '',
                gender: '',
                phoneNumber: '',
                type: ''
            },
            oldUser: {},
            password: '',
            confirmPassword: '',
            rules: {
                password: v => (!v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/.test(v)) || 'Password must contain at least 5 characters, one uppercase letter and one number if completed',
                email: v => (!v || (v.length > 1 && /.+@.+\..+/.test(v))) || 'E-mail must be valid if completed',
                numberRequired: v => !!v || 'Phone number is required',
                numberPrefix: v => /^\+\d{2,}$/.test(v) || 'Phone number must contain a prefix (+40)',
                numberLength: v => /^\+\d{10,}$/.test(v) || 'Phone number must contain at least 10 digits',
            },

        };
    },
    created() {
        this.fetchProfile()
            .then((res) => {
                this.oldUser = {
                    email: res.data.user.email,
                    phoneNumber: res.data.user.phoneNumber,
                }
                this.user = res.data.user;
            })
            .catch((err) => {

            });
    },
    computed: {
        gender() {
            return this.user.gender === 'M' ? 'Male' : 'Female';
        },
        genderIcon() {
            return this.user.gender === 'M' ? 'mdi-gender-male' : 'mdi-gender-female';
        },
    },
    methods: {
        ...mapActions('users', ['fetchProfile', 'updateProfile']),
        handleSubmit() {
            console.log(this.user)
            console.log(this.oldUser)

            const data = {}
            if (this.user.phoneNumber !== this.oldUser.phoneNumber) {
                data.phoneNumber = this.user.phoneNumber;
            }
            if (this.user.email !== this.oldUser.email) {
                data.email = this.user.email;
            }
            if (this.password.length > 0) {
                data.password = this.password;
            }

            // if no changes, do not send request
            if (Object.keys(data).length === 0) {
                console.log(data)
                toast.info('No changes detected');
                return;
            }
            this.updateProfile({data})
                .then((res) => {
                    toast.success('Profile updated successfully');
                    this.oldUser = {
                        email: this.user.email,
                        phoneNumber: this.user.phoneNumber,
                    }
                })
                .catch((err) => {
                    toast.error('There was an error updating your profile');
                });
        }
    },
};
</script>
  