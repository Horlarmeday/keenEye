import axios from '../../axios'

export default {
    //===========================
    // STATE
    //===========================
    state: {
        status: '',
        token: localStorage.getItem('user_token') || '',
        user: null,
        isLoggedInUser: null,
        returnItemValue: 0
    },
    //===========================
    // GETTERS
    //===========================
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        getUser: state => state.user,
    },
    //===========================
    // MUTATIONS
    //===========================
    mutations: {
        auth_request(state) {
            state.status = 'loading'
        },
        auth_success(state, token, staff) {
            state.status = 'success'
            state.token = token
            state.user = staff
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
        }
    },
    //===========================
    // ACTIONS
    //===========================
    actions: {
        // Login action
        login({ commit }, staff) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                axios({
                    url: `/auth/login`,
                    data: staff,
                    method: "POST"
                })
                    .then(response => {
                        const token = response.data.data.token;
                        localStorage.setItem("user_token", token);

                        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                        commit("auth_success", token);
                        resolve(response);
                    })
                    .catch(err => {
                        commit("auth_error");
                        localStorage.removeItem("user_token");
                        reject(err);
                    });
            });
        },

        // register action
        register({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                axios({
                    url: "/auth/signup",
                    data: user,
                    method: "POST"
                })
                    .then(response => {
                        const token = response.data.data.token;
                        const user = response.data.data;
                        localStorage.setItem("user_token", token);
                        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
                        commit("auth_success", token, user);
                        resolve(response);
                    })
                    .catch(err => {
                        commit("auth_error", err);
                        localStorage.removeItem("user_token");
                        reject(err);
                    });
            });
        },

        logout({ commit }) {
            return new Promise((resolve) => {
                commit("logout");
                localStorage.removeItem("user_token");
                delete axios.defaults.headers.common["authorization"];
                resolve();
            });
        }
    },
    modules: {}
}