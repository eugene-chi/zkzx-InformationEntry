import Vue from 'vue';
import iView from 'iview';
import axios from 'axios';

import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';

import {baseURL,codeTable} from '@/config/index.js';


Vue.use(VueI18n);
Vue.use(iView);

// 支持跨域cookie
axios.defaults.withCredentials = true;

Vue.prototype.$http = axios;
//接口地址
// axios.defaults.baseURL = baseURL.jinJian;//todo 不同系统配置不同地址
axios.defaults.baseURL = baseURL.duiZhang;//todo 不同系统配置不同地址


new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist');
    // iview-admin检查更新
    util.checkUpdate(this);
  },
  created() {
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
});

