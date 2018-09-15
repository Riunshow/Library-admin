// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

import './assets/custom.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import VCharts from 'v-charts'

import store from '@/store/index';
Vue.config.productionTip = false;

import axios from 'axios'

Vue.prototype.$axios = axios
axios.defaults.withCredentials = true

Vue.use(ElementUI);
Vue.use(VCharts)

Vue.prototype.$serverIP = 'http://172.20.178.107:7001'

require('./mock.js')

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});