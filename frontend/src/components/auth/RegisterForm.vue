<template>
    <v-card class="elevation-6">
        <v-card-text class="">
            <h2 class="text-center mt-4 mb-10">Create an account</h2>
            <v-form class="ml-sm-10 mr-sm-10" @submit.prevent="submitForm" ref="form" v-model="isFormValid">
                <v-row>
                    <v-col cols="12" sm="12" md="12" lg="6">
                        <v-text-field label="First Name" prepend-inner-icon="mdi-account" v-model="user.firstName"
                            :rules="[rules.required, rules.min3, rules.onlyLetters]" />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6">
                        <v-text-field label="Last Name" prepend-inner-icon="mdi-account" v-model="user.lastName"
                            :rules="[rules.required, rules.min3, rules.onlyLetters]" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field type="date" label="Birthdate" prepend-inner-icon="mdi-calendar" v-model="user.birthDate"
                            :rules="[rules.required, rules.birthDate]" />
                    </v-col>
                    <v-col cols="12">
                        <v-label>Gender</v-label>
                        <v-radio-group inline v-model="user.gender" :rules="[rules.gender]">
                            <v-radio label="Male" value="M" class="mr-10" />
                            <v-radio label="Female" value="F" />
                        </v-radio-group>
                    </v-col>
                    <v-col cols="12">      
                        <v-text-field label="Phone Number" prepend-inner-icon="mdi-phone" clearable
                            v-model="user.phoneNumber" :rules="[rules.required, rules.numberPrefix, rules.numberLength]"
                            hint="Phone number including prefix (e.g. +40)"
                            :error-messages="phoneErrMessage" @blur="checkPhone" />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="E-mail" prepend-inner-icon="mdi-email" clearable
                            hint="Email is optional, but recommended" persistent-hint v-model="user.email"
                            :rules="[rules.email]" :error-messages="emailErrMessage" @blur="checkEmail" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field type="password" label="Password" prepend-inner-icon="mdi-lock" clearable
                            hint="Must contain at least 5 characters, one uppercase letter and one number"
                            :rules="[rules.required, rules.password]" persistent-hint v-model="user.password" />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field type="password" label="Confirm Password" prepend-inner-icon="mdi-lock" clearable
                            hint="Please retype your password" persistent-hint v-model="confirmPassword"
                            :rules="[rules.required, v => v === this.user.password || 'Passwords do not match']" />
                    </v-col>
                </v-row>


                <div class="text-center mt-5">
                    <v-btn block class="me-4" color="red" type="submit" :disabled="!isFormValid">Register</v-btn>
                </div>

                <v-card-actions class="d-flex justify-end">
                    <router-link to="/login">
                        <v-btn text color="red">Already have an Account?</v-btn>
                    </router-link>
                </v-card-actions>

            </v-form>
        </v-card-text>
    </v-card>
</template>
<script setup>
</script>
<script>
import { mapActions } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: "RegisterForm",
    data() {
        return {
            user: {
                firstName: '',
                lastName: '',
                birthDate: '',
                gender: 'M',
                phoneNumber: '',
                email: '',
                password: '',
            },
            confirmPassword: '',
            rules: {
                required: value => !!value || 'Required field',
                min3: v => v.length >= 3 || 'Min 3 characters',
                onlyLetters: v => /^[a-zA-Z]*$/.test(v) || 'Field must contain only letters without spaces',
                password: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/.test(v) || 'Password must contain at least 5 characters, one uppercase letter and one number',
                birthDate: v => {
                    const date = new Date(v);
                    const now = new Date();
                    const minAgeDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
                    return date < minAgeDate || 'You must be at least 13 years old';

                    // const maxAgeDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());

                    // return date < now && date > maxAgeDate || 'Birthday must be valid';
                },
                email: v => (!v || (v.length > 1 && /.+@.+\..+/.test(v))) || 'E-mail must be valid if completed',
                requiredGender: v => ['M','F'].includes(v) || 'Please select your gender',
                numberPrefix: v => /^\+\d{2,}$/.test(v) || 'Phone number must contain a prefix (+40)',
                numberLength: v => /^\+\d{10,}$/.test(v) || 'Phone number must contain at least 10 digits',

            },
            isFormValid: false,
            emailErrMessage: [],
            phoneErrMessage: [],
        }
    },
    components: {
       
    },
    methods: {
        ...mapActions('auth', ['register', 'checkRegister']),
        checkEmail() {
            if (this.user.email == '') return;

            if (this.user.email == '') return;
            this.checkRegister({ "email": this.user.email })
                .then(() => {
                    this.emailErrMessage = [];
                })
                .catch((err) => {
                    if(err.response != undefined && err.response.status != undefined && 
                        err.response.status == 409) {
                        this.emailErrMessage = [];
                        this.emailErrMessage.push('Email already exists');
                    }
                })
        },
        checkPhone() {
            console.log(this.user.phoneNumber)
            if (this.user.phoneNumber == null || this.user.phoneNumber == '') return;
            this.checkRegister({ "phoneNumber": this.user.phoneNumber }).then(() => {
                this.phoneErrMessage = [];
            }).catch((err) => {
                if(err.response != undefined && err.response.status != undefined && 
                    err.response.status == 409) {
                    this.phoneErrMessage = [];
                    this.phoneErrMessage.push('Phone number already exists');
                }
            })
        },
        submitForm() {
            if(this.user.email == '') {
                delete this.user.email;
            }
            this.register(this.user).then((response) => {
                this.$router.push('/login')
            }).catch((err) => {
                toast.error('Something went wrong. Try again later.')
            })
        },
    }


}
</script>