import 'babel-polyfill';
import Vue from 'vue';

window.axios = require('axios');
window._ = require('lodash');

Vue.component('feed', require('./components/Feed.vue').default);

new Vue({
	el: '#app'
});