<template>
    <v-row class="align-center justify-center" dense style="height: 90vh">
        <v-col cols="12" sm="8" md="9" lg="6">
            <RegisterForm />
        </v-col>
    </v-row>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue';
export default {
    name: 'Register',
    components: {
        RegisterForm,
    },
}
</script>