import Vue from 'vue'
import Router from 'vue-router'

import store from './../store'

import Home from '@/components/Home'
import FirstPage from '@/components/FirstPage'
import Template from '@/components/Template'
import Login from '@/components/Login'
import UserManage from '@/components/UserManage'
import GroupManage from '@/components/GroupManage'
import DetailInfo from '@/components/DetailInfo'
import Personal from '@/components/PersonalCenter'
import BookManage from '@/components/BookManage'


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
                    path: 'index',
                    name: '首页',
                    component: FirstPage,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: 'user',
                    name: '用户管理',
                    component: UserManage,
                    meta: {
                        requireAuth: true,
                        adminAuth: true
                    },
                },
                {
                    path: 'group',
                    name: '分组管理',
                    component: GroupManage,
                    meta: {
                        requireAuth: true,
                        adminAuth: true
                    },
                },
                {
                    path: 'userInfo/:id',
                    name: '用户详情页',
                    component: DetailInfo,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: 'book',
                    name: '图书管理',
                    component: BookManage,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: 'bookInfo/:id',
                    name: '图书详情页',
                    component: DetailInfo,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: 'personal',
                    name: '个人中心',
                    component: Personal,
                    meta: {
                        requireAuth: true
                    },
                },
            ]
        },
        {
            path: '/404',
            name: '404',
            component: Template
        }, {
            path: '/403',
            name: '403 Forbidden',
            component: Template
        }, {
            path: '*',
            redirect: '/index'
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
        if (to.meta.adminAuth) {
            if (sessionStorage.user_role == 20) {
                next()
            } else if (sessionStorage.user_role < 20) {
                next({
                    path: '/index'
                })
            }
        }
        if (to.fullPath == '/') {
            next({
                path: '/index'
            })
        }
    } else {
        next()
    }
})

export default router;