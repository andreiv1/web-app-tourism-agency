import api from "../api";

const state = {
  items: [],
  sortOptions: {},
  item: {},
  pagination: {},
  paginationOptions: {
    take: 9,
    page: 1,
  },
  isLoading: false,

  adminItems: [],
  paginationAdmin: {
    page: 1,
    take: 25,
    total: 0
  }
};

const getters = {
  item: (state) => state.item,
  items: (state) => state.items,
  adminItems: (state) => state.adminItems,
};

const actions = {
  fetchItems({ commit }, s) {
    commit("setIsLoading", true);
    return new Promise(async (resolve, reject) => {
      try {
        let url = `/trips?page=${state.paginationOptions.page}&take=${state.paginationOptions.take}`;
        
        if(s !== undefined && s !== null && s !== "") {
          url += `&s=${s}`
          commit("setPaginationOptions", { page: 1, take: state.paginationOptions.take })
        }
        if (state.sortOptions.sortBy && state.sortOptions.sortOrder) {
          url += `&sortBy=${state.sortOptions.sortBy}&sortOrder=${state.sortOptions.sortOrder}`
        }

        const response = await api.get(url);
        console.log(response.data);
        commit("setItems", response.data.result);
        commit("setPagination", response.data.pagination);
        commit("setIsLoading", false);
        resolve(response);
      } catch (error) {
        commit("setIsLoading", false);
        reject(error);
      }
    });
  },

  updateSortOptions({ commit, dispatch }, sortOptions) {
    commit("setSortOptions", sortOptions);
    dispatch("updatePaginationOptions", { page: 1, take: state.paginationOptions.take })
  },

  updatePaginationOptions({ commit, dispatch }, paginationOptions) {
    commit("setPaginationOptions", paginationOptions);
    dispatch("fetchItems")
  },

  fetchItem({ commit }, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await api.get(`/trips/${id}`);
        commit("setItem", response.data);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  fetchAdminItems({ commit }, opts) {
    return new Promise(async (resolve, reject) => {
      try {
        let url;
        if(opts == undefined) {
          url = `/trips/admin`
        } else {
          url = `/trips/admin?page=${opts.page}&take=${opts.take}`;
        }
        

        const response = await api.get(url);

        commit("setAdminItems", response.data.result);
        commit("setAdminPagination", response.data.pagination);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  fetchParticipants({commit}, tripId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await api.get(`/trips/${tripId}/participants`);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },

  addItem({ commit }, trip) {
    return new Promise(async (resolve, reject) => {
      await api
        .post("/trips/add", trip)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  editItem({ commit }, { id, trip }) {
    return new Promise(async (resolve, reject) => {
      await api
        .put(`/trips/${id}`, trip)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  deleteItem({ commit }, id) {
    return new Promise(async (resolve, reject) => {
      await api
        .delete(`/trips/${id}`)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  addToFavorite({commit }, id) {
    return new Promise(async (resolve, reject) => {
      await api
          .post(`/trips/${id}/favorite`)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
    });
  },

  userJoinTrip({commit }, id) {
    return new Promise(async (resolve, reject) => {
      await api
          .post(`/trips/${id}/join`)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
    });
  },

  generateTrips({commit}) {
    return new Promise(async (resolve, reject) => {
      await api
          .post(`/trips/seed?no=3`)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
    });
  },

  deleteParticipant({commit}, {tripId, userId}) {
    return new Promise(async (resolve, reject) => {
      await api
          .delete(`/trips/${tripId}/participants/${userId}`)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
    });
  }
};

const mutations = {
  setItems(state, items) {
    state.items = items;
  },
  setSortOptions(state, sortOptions) {
    state.sortOptions = sortOptions;
  },
  setItem(state, item) {
    state.item = item;
  },
  setPagination(state, pagination) {
    state.pagination = pagination;
  },
  setPaginationOptions(state, paginationOptions) {
    state.paginationOptions = paginationOptions;
  },
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  setAdminItems(state, adminItems) {
    state.adminItems = adminItems;
  },
  setAdminPagination(state, pagination) {
    state.paginationAdmin = pagination;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
