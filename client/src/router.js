import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/modules/auth'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ './views/Login')
    },

    {
        path: "",
        component: () => import("@/views/layout/Layout"),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import(/* webpackChunkName: "about" */ './views/Dashboard'),
                meta: {
                    requiresAuth: true
                }
            }
        ]
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.token) {
            next()
            return
        }
        next('/login')
    } else {
        next()
    }
})

export default router;