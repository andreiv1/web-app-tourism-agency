import { createStore } from 'vuex'
import auth from './modules/auth'
import trips from './modules/trips'
import users from './modules/users'

export default createStore({
    modules: {
        auth,
        trips,
        users
    }
});