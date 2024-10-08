import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import store from "../store";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const userIsAuth = store.getters["auth/isLogged"];
  const userData = store.getters["auth/user"];

  if (to.meta.requiresAuth) {
    if (!userIsAuth) {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }
  }

  if (to.meta.requiresAdmin) {
    if (!userIsAuth || userData.type !== "admin") {
      return {
        path: "/",
      };
    }
  }
});

export default router;
