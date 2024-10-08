import api from "../api";

const state = {
    items: [],
    pagination: {},
    profile: {}
}

const getters = {}

const actions = {
    fetchItems({commit}, opts) {
        return new Promise((resolve, reject) => {
            let url;
            if(opts == undefined) {
                url = '/users'
            } else {
                url = `/users?page=${opts.page}&take=${opts.take}`;
            }
            api.get(url)
                .then(res => {
                    commit('setItems', res.data.result)
                    commit('setPagination', res.data.pagination)
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    fetchFavorites({commit}) {
        return new Promise((resolve, reject) => {
            api.get('trips/favorites')
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    fetchMyTrips({commit}) {
        return new Promise((resolve, reject) => {
            api.get('trips/my')
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    deleteItem({commit}, id) {
        return new Promise((resolve, reject) => {
            api.delete(`users/${id}`)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })

    },

    generateUsers({commit}) {
        return new Promise((resolve, reject) => {
            api.post('users/seed?no=3')
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })

    },

    fetchProfile({commit}) {
        return new Promise((resolve, reject) => {
            api.get('users/profile')
                .then(res => {
                    commit('setProfile', res.data)
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    updateProfile({commit}, {data}) {
        return new Promise((resolve, reject) => {
            api.put(`users/profile`, data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })

    },

    fetchUser({commit}, {id}) {
        return new Promise((resolve, reject) => {
            api.get(`users/${id}`)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    
    },

    createUser({commit}, {data}) {
        return new Promise((resolve, reject) => {
            api.post(`users/add`, data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    updateUser({commit}, {id, data}){
        return new Promise((resolve, reject) => {
            api.put(`users/${id}`, data)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })

    }


}

const mutations = {
    setItems(state, items) {
        state.items = items
    },
    setPagination(state, pagination) {
        state.pagination = pagination
    },
    setProfile(state, profile) {
        state.profile = profile
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}