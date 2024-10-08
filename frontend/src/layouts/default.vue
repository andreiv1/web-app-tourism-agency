<template>
    <v-app>
        <NavBar/>
        <v-main>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';


export default {
  components: {
    NavBar
},
};
</script>