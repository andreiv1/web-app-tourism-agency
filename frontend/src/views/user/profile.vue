<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="8" md="7" lg="5" xl="5">
                <UserProfileForm />
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import UserProfileForm from '@/components/users/UserProfileForm.vue'
export default {
    name: 'UserProfile',
    components: { UserProfileForm },
}
</script>