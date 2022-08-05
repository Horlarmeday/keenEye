import Vue from 'vue'
import Vuex from 'vuex';
import AuthStore from './modules/auth';
import ProductStore from './modules/products'
Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        auth: AuthStore,
        product: ProductStore,
    },
});