<template>
  <v-app-bar color="red">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title>Tourism Agency</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" expand-on-hover>
    <template v-slot:prepend>
      <v-list-item class="mt-2 mb-2">
        <v-list-img class="ml-3">
          <v-avatar color="brown" size="large">
            <span class="text-h5">{{ getInitials }}</span>
          </v-avatar>
        </v-list-img>
        <div class="ml-14">
          <v-list-item-title>{{ displayName }}</v-list-item-title>
          <v-list-item-subtitle>{{ isLogged ? "Logged in (" + user.type + ")" : "Not logged in" }}</v-list-item-subtitle>
        </div>
      </v-list-item>
    </template>

    <v-divider></v-divider>
    <v-list nav>
      <v-list-item v-for="item in filteredMenuItems" :key="item.value" :prepend-icon="item.icon" :to="item.route">
        {{ item.title }}
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { menuItems } from '@/router/menu'

const drawer = ref(null)
</script>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { toast } from 'vue3-toastify';
export default {
  data: () => ({
    menuItems,
    drawer: null,
  }),
  created() {
    this.check().then(() => {

    }).catch(() => {

    })
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isLogged']),
    filteredMenuItems() {
      return menuItems.filter(item => {
        if (item.show === 'all') {
          return true;
        } else if (item.show === 'auth' && this.isLogged) {
          return true;
        } else if (item.show === 'guest' && !this.isLogged) {
          return true;
        } else return item.show === 'admin' && this.user.type === 'admin';
      });
    },
    displayName() {
      if(this.user && this.user.firstName && this.user.lastName)
        return this.user.firstName + ' ' + this.user.lastName
      return 'Guest'
    },
    getInitials() {
      if(this.user && this.user.firstName && this.user.lastName)
        return this.user.firstName.charAt(0) + this.user.lastName.charAt(0)
      return 'G'
    }
  },
  methods: {
    ...mapActions('auth', ['check']),
  },
}
</script>