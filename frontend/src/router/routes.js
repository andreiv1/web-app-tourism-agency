const routes = [
  {
    /**
     * Main routes
     */
    path: "/trips",
    component: () => import("../layouts/default"),
    children: [
      {
        name: "Trips",
        path: "/",
        alias: "/trips",
        meta: { requiresAuth: false },
        component: () => import("../views/trips"),
      },
      {
        name: "Trip",
        path: "/trip/:id",
        meta: { requiresAuth: false },
        component: () => import("../views/trips/view"),
      },
      {
        name: "MyTrips",
        path: "/my-trips",
        meta: { requiresAuth: true },
        component: () => import("../views/user/trips"),
      },
      {
        name: "Favorites",
        path: "/favorites",
        meta: { requiresAuth: true },
        component: () => import("../views/user/favorites"),
      },
      {
        name: "Profile",
        path: "/profile",
        meta: { requiresAuth: true },
        component: () => import("../views/user/profile"),
      },
      {
        name: "Login",
        path: "/login",
        meta: { requiresAuth: false },
        component: () => import("../views/auth/login"),
      },
      {
        name: "Register",
        path: "/register",
        meta: { requiresAuth: false },
        component: () => import("../views/auth/register"),
      },
    ],
  },
  {
    name: "Logout",
    path: "/logout",
    meta: { requiresAuth: true },
    component: () => import("../views/auth/logout"),
  },

  /**
   * Admin Routes
   */
  {
    path: "/admin",
    component: () => import("../layouts/default"),
    meta: { requiresAdmin: true },
    children: [
      /**
       * Admin Users
       */
      {
        path: "users",
        children: [
          {
            name: "AdminUsers",
            path: "",
            meta: { requiresAdmin: true },
            component: () => import("../views/admin/users"),
          },
          {
            name: "AdminAddUser",
            path: "add",
            meta: { requiresAdmin: true },
            component: () => import("../views/admin/users/manage"),
          },
          {
            name: "AdminEditUser",
            path: "edit/:id",
            meta: { requiresAdmin: true },
            component: () => import("../views/admin/users/manage"),
          },
        ],
      },

      /**
       * Admin Trips
       */
      {
        path: "trips",
        children: [
          {
            name: "AdminTrips",
            path: "",
            meta: { requiresAdmin: true },
            component: () => import("../views/admin/trips"),
          },
          {
            name: "AdminAddTrip",
            path: "add",
            meta: { requiresAdmin: true },
            component: () => import("../views/admin/trips/manage"),
          },
          {
            name: "AdminEditTrip",
            path: "edit/:id",
            meta: { requiresAdmin: true },
            component: () => import("../views/admin/trips/manage"),
          },
        ],
      },

      
    ],
  },

  /**
   * Error routes
   */
  {
    path: "/:catchAll(.*)",
    component: () => import("../layouts/default"),
    children: [
      {
        path: "",
        component: () => import("../views/errors/not-found"),
      },
    ],
  },
];

export default routes;
