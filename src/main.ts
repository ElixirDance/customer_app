import { createSSRApp } from "vue";
import App from "./App.vue";
import pinia from "@/store/index";
import "@/utils/permission";
import uviewPlus from "uview-plus";
import mixin from "@/utils/mixin";
import i18n from "@/i18n";

// main.js 或 App.vue
// 开发环境下引入 Mock
if (process.env.NODE_ENV === 'development') {
  // 引入 Mock 入口文件
  import('../mock').then(({ initMock }) => {
    initMock(); // 初始化 Mock（如果有初始化函数）
  });
}

export function createApp() {
    const app = createSSRApp(App);
    app.use(pinia).use(i18n).use(uviewPlus).use(mixin);
    return {
        app,
        pinia
    };
}
