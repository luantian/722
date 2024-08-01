import { createApp } from 'vue'
import Router from "./router"
import 'normalize.css';
import App from './App.vue'
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';


createApp(App).use(TDesign).use(Router).mount('#app')