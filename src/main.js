import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";
// 全局注册ElementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:9527'
Vue.prototype.$http = axios;
Vue.prototype.path = 'http://localhost:9527'

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
