// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import VueRouter from 'vue-router'
import store from './store/store.js'
//import router from './router'

import routes from './routes'
import QRCode from 'qrcode'




Vue.use(ElementUI)
Vue.use(VueRouter)
//Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //next()
  //NProgress.start();
  //sessionStorage.removeItem('BITKER_WALLET_USER');
  if (to.path == '/login') {
    sessionStorage.removeItem('BITKER_WALLET_USER');
  }
  let user = JSON.parse(sessionStorage.getItem('BITKER_WALLET_USER'));
  if (!user && to.path != '/login') {
    next({ path: '/login' });
  } else {
    next();
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  //store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

