<template>
    <v-card class="mx-auto elevation-4" max-width="600" rounded="lg">
        <v-card-text class="mt-12">
            <h2 class="text-center mt-4 mb-4">Log in using</h2>
            <v-form class="ml-sm-10 mr-sm-10" @submit.prevent="submitForm" ref="form" v-model="isFormValid">
                <v-radio-group class="d-flex justify-center mb-5" inline v-model="defaultLoginOption"
                    @change="changeDefaultLogin">
                    <v-radio class="mr-5" label="Email" value="email" ></v-radio>
                    <v-radio label="Phone Number" value="phoneNumber"></v-radio>
                </v-radio-group>
                <!-- <v-phone-input v-if="defaultLoginOption == 'phoneNumber'" countryLabel="Prefix"
                    invalid-message="Invalid phone number" country="RO" type="phone" v-model="credentials.phoneNumber"
                    :rules="[rules.phone]">
                    <template #country-name="{ country }">
                        <span class="ml-5">{{ country.name }}</span>
                    </template>
                    <template #country-append="{ country }">
                        <strong>+{{ country.dialCode }}</strong>
                    </template>
                </v-phone-input> -->
                <v-text-field v-if="defaultLoginOption == 'phoneNumber'"
                            label="Phone Number" prepend-inner-icon="mdi-phone" clearable
                            v-model="credentials.phoneNumber" :rules="[rules.phone]"
                            hint="Phone number including prefix (e.g. +40)"
                            :error-messages="phoneErrMessage" @blur="checkPhone" />
                <v-text-field v-if="defaultLoginOption == 'email'" label="E-mail" prepend-inner-icon="mdi-email"
                    v-model="credentials.email" :rules="[rules.email]" />
                <v-text-field label="Password" type="password" prepend-inner-icon="mdi-lock" v-model="credentials.password"
                    :rules="[rules.password]" />
                <div class="mt-3 mb-5">
                    <v-btn block color="red" type="submit" size="large" :disabled="!isFormValid">Login</v-btn>
                </div>

                <v-card-actions class="d-flex justify-end">
                    <router-link to="/register">
                        <v-btn text color="red">Don't have an Account?</v-btn>
                    </router-link>
                </v-card-actions>

            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: "LoginForm",
    data() {
        return {
            credentials: {
                phoneNumber: '',
                email: '',
                password: '',
            },
            isFormValid: false,
            rules: {
                phone: v => !!v || 'Enter your phone number',
                password: v => !!v || 'Enter your password',
                email: v => /.+@.+/.test(v) || 'E-mail must be valid',
            },
            defaultLoginOption: localStorage.getItem("defaultLoginOption") || "email",
        }
    },
    methods: {
        ...mapActions('auth', ['login']),
        changeDefaultLogin() {
            if(this.defaultLoginOption === 'phoneNumber'){
                localStorage.setItem("defaultLoginOption", "phoneNumber")
                this.credentials.email = ''
            } else {
                localStorage.setItem("defaultLoginOption", "email")
                this.credentials.phoneNumber = ''
            }
        },
        submitForm() {
            if (this.credentials.email === '') {
                delete this.credentials.email
            }
            if (this.credentials.phoneNumber === '') {
                delete this.credentials.phoneNumber
            }
            this.login(this.credentials)
                .then(() => {
                  this.$router.push({ name: 'Trips' })
                })
                .catch((error) => {
                    if(error.response === undefined) {
                        toast.error('Something went wrong, please try again later')
                        return
                    }
                    if(error.response.status === 401) {
                        toast.error('Invalid credentials')
                    } else {
                        toast.error('Something went wrong, please try again later')
                    }
                })
        },
    }
}
</script>