import axios from '../../axios'

export default {
    //===========================
    // STATE
    //===========================
    state: {
        product: null,
        products: [],
        categories: [],
        total: 0,
        pages: 0,
    },
    //===========================
    // MUTATIONS
    //===========================
    mutations: {
        ADD_PRODUCT(state, product) {
            state.products.unshift(product);
        },

        SET_PRODUCTS(state, products) {
            state.products = products;
        },

        SET_PRODUCTS_TOTAL(state, total) {
            state.total = total;
        },

        SET_NUMB_PAGES(state, pages) {
            state.pages = pages;
        },

        SET_PRODUCT(state, insurance) {
            state.insurance = insurance;
        },

        SET_CATEGORIES(state, categories) {
            state.categories = categories;
        },
    },
    //===========================
    // ACTIONS
    //===========================
    actions: {
        // Login action
        addProduct({ commit }, formData) {
            return new Promise((resolve, reject) => {
                axios
                    .post("/products", formData, { headers: {'Content-Type': 'multipart/form-data'} })
                    .then(response => {
                        commit(
                            "ADD_PRODUCT",
                            Object.assign(formData, {
                                id: response.data.data.id,
                            })
                        );
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        fetchProducts({ commit }, payload) {
            return new Promise((resolve, reject) => {
                axios
                    .get("/products", {
                        params: {
                            currentPage: payload.currentPage,
                            itemsPerPage: payload.itemsPerPage
                        }
                    })
                    .then(response => {
                        commit("SET_PRODUCTS", response.data.data.docs);
                        commit("SET_PRODUCTS_TOTAL", response.data.data.total);
                        commit("SET_NUMB_PAGES", response.data.data.pages);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        fetchCategories({ commit }) {
            return new Promise((resolve, reject) => {
                axios
                    .get("/categories")
                    .then(response => {
                        commit("SET_CATEGORIES", response.data.data);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    },
    modules: {}
}