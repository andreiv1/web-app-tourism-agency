<template>
    <v-row class="align-center justify-center" dense style="height: 90vh">
        <v-col cols="12" sm="8" md="7" lg="5" xl="5">
            <LoginForm />
        </v-col>
    </v-row>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue';
export default {
    name: 'Login',
    components: {
        LoginForm,
    },
}
</script>