import api from "../api";

const defaultUserState= {
  id: null,
  firstName: "Guest",
  lastName: "",
  email: null,
  phoneNumber: null,
  type: "guest",
}

const state = {
  user: JSON.parse(localStorage.getItem("user")) || defaultUserState,
};

const getters = {
  isLogged: (state) => state.user.type !== "guest",
  user: (state) => state.user,
};

const actions = {
  check({ commit }) {
    return new Promise(async (resolve, reject) => {
      await api
        .post("/auth/check-session")
        .then((response) => {
          commit("SET_USER", response.data.user);
          resolve(response);
        })
        .catch((err) => {
          commit("SET_USER", defaultUserState);
          reject(err);
        });
    });
  },

  login({ commit }, loginData) {
    return new Promise(async (resolve, reject) => {
      await api
        .post("/auth/login", loginData)
        .then((response) => {
          commit("SET_USER", response.data.user);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  register({ commit }, registerData) {
    return new Promise(async (resolve, reject) => {
      await api
        .post("/auth/register", registerData)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  checkRegister({commit}, registerData) {
    return new Promise(async (resolve, reject) => {
        await api
          .post("/auth/check-register", registerData)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      });
  },


  logout({ commit }) {
    return new Promise(async (resolve, reject) => {
      await api
        .post("/auth/logout")
        .then((response) => {
          commit("SET_USER", defaultUserState);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
