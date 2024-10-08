import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
});

import { createVPhoneInput } from "v-phone-input";
import "flag-icons/css/flag-icons.min.css";
import "v-phone-input/dist/v-phone-input.css";

const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg',
  displayFormat: "international",
});

// Toastify
import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import router from "./router";
import store from "./store";

createApp(App)
  .use(store)
  .use(router)
  .use(vuetify)
  .use(vPhoneInput)
  .use(Vue3Toasity, {
    autoClose: 3000,
    position: "top-right",
    theme: "light",
    pauseOnFocusLoss: false,
    pauseOnHover: false,
  })
  .mount("#app");
