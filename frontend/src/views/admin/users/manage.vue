<template>
    <v-container>
        <UserForm :id="id" />
    </v-container>
</template>

<script>
import UserForm from '@/components/users/UserForm.vue'

export default {
    name: 'AdminManageTrip',
    components: { UserForm },
    data() {
        return {
            id: this.$route.params.id
        }
    },
}
</script>