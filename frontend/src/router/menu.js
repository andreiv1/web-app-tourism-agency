export const menuItems = [
  {
    title: "Home",
    icon: "mdi-view-dashboard",
    value: "home",
    route: { name: "Trips" },
    show: "all"
  },
  {
    title: "My Trips",
    icon: "mdi-earth",
    value: "my-trips",
    route: { name: "MyTrips" },
    show: "auth"
  },
  {
    title: "Favorites",
    icon: "mdi-heart",
    value: "favorites",
    route: { name: "Favorites" },
    show: "auth"
  },
  {
    title: "Profile",
    icon: "mdi-account",
    value: "account",
    route: { name: "Profile" },
    show: "auth"
  },
  {
    title: "Logout",
    icon: "mdi-logout",
    value: "logout",
    route: { name: "Logout" },
    show: "auth"

  },
  {
    title: "Login",
    icon: "mdi-login",
    value: "login",
    route: { name: "Login" },
    show: "guest"
  },
  {
    title: "Register",
    icon: "mdi-account-plus",
    value: "register",
    route: { name: "Register" },
    show: "guest"
  },
  {
    title: "ADMIN",
    isHeader: true,
    show: "admin"
  },
  {
    title: "Trips",
    icon: "mdi-earth",
    value: "admin-trips",
    route: { name: "AdminTrips" },
    show: "admin"
  },
  {
    title: "Users",
    icon: "mdi-account-group",
    value: "admin-users",
    route: { name: "AdminUsers" },
    show: "admin"
  },
];
