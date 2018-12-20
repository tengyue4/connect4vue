import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/log',
            name: 'log',
            component: () => import('./views/Log.vue')
        },
        {
            path: '/connect4',
            name: 'connect4',
            component: () => import('./views/Connect4.vue')
        }
    ]
})
