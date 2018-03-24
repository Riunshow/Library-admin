import Vue from 'vue'
import Router from 'vue-router'

import store from './../store'

import Home from '@/components/Home'
import Template from '@/components/Template'
import Login from '@/components/Login'
import ElementTable from '@/components/ElementTable'
import DetailInfo from '@/components/DetailInfo'
import Personal from '@/components/PersonalCenter'

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/login',
            name: '登录',
            component: Login
        },
        {
            path: '/',
            name: '主页',
            component: Home,
            meta: {
                requireAuth: true
            },
            children: [{
                    path: '/index',
                    name: '首页',
                    component: Template,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: '/user',
                    name: '用户管理',
                    component: ElementTable,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: '/userInfo/:id',
                    name: '用户详情页',
                    component: DetailInfo,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: '/book',
                    name: '图书管理',
                    component: Template,
                    meta: {
                        requireAuth: true
                    },
                }, {
                    path: '/personal',
                    name: '个人中心',
                    component: Personal,
                    meta: {
                        requireAuth: true
                    },
                },
            ]
        },

        {
            path: '*',
            redirect: '/'
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        // if (store.state.loginUser.role === 0) {
        if (sessionStorage.length === 0) {
            next({
                path: '/login'
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router;