import Vue from 'vue'
import Router from 'vue-router'

import store from './../store'


import Login from '@/components/Login'
import FirstPage from '@/components/common/FirstPage'
import Home from '@/components/Home'
import Template from '@/components/Template'

import UserManage from '@/components/System/UserManage'
import UserGroupManage from '@/components/System/UserGroupManage'
import UserInfo from '@/components/System/UserInfo'
import Personal from '@/components/System/PersonalCenter'

import BookInfo from '@/components/Book/BookInfo'
import BookManage from '@/components/Book/BookManage'
import BookGroupManage from '@/components/Book/BookGroupManage'

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
                    path: 'usermanage',
                    name: '用户管理',
                    component: UserManage,
                    meta: {
                        requireAuth: true,
                        adminAuth: true
                    },
                },
                {
                    path: 'bookgroup',
                    name: '图书分组管理',
                    component: BookGroupManage,
                    meta: {
                        requireAuth: true,
                    },
                },
                {
                    path: 'usergroup',
                    name: '用户分组管理',
                    component: UserGroupManage,
                    meta: {
                        requireAuth: true,
                        adminAuth: true
                    },
                },
                {
                    path: 'userinfo/:userid',
                    name: '用户详情页',
                    component: UserInfo,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: 'bookmanage',
                    name: '图书管理',
                    component: BookManage,
                    meta: {
                        requireAuth: true
                    },
                },
                {
                    path: 'bookinfo/:bookid',
                    name: '图书详情页',
                    component: BookInfo,
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
            if (sessionStorage.user_role == 3) {
                next()
            } else {
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