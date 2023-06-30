import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        // 懒加载方式
        // 组件文件名为index.vue， 可以省略不写
        // component: () => import(/* webpackChunkName: "about" */ '../views/login/index.vue')  与下面等价
        component: () => import('../views/login')
    },
    {
        path: '/manage',
        name: 'manage',
        redirect: '/video/list',
        component: () => import('../views/manage'),
        children: [
            {
                path: '/video/list',
                component: () => import('../views/manage/video')
            },
            {
                path: '/video/shortVideo',
                component: () => import('../views/manage/shortVideo')
            },
            {
                path: '/user',
                component: () => import('../views/manage/user')
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
