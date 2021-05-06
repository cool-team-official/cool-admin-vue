import store from "store";
import { getUrlParam } from "cl-admin/utils";

export const routerMode = "history";

export const isDev = process.env.NODE_ENV == "development";

export const host = "https://show.cool-admin.com";

export const socketUrl = (isDev ? `${host}` : "") + "/socket";

export const baseUrl = (function() {
    let proxy = getUrlParam("proxy");

    if (proxy) {
        store.set("proxy", proxy);
    } else {
        proxy = store.get("proxy") || "dev";
    }

    return isDev ? `/${proxy}/admin` : `/api/admin`;
})();

// 阿里字体图标库 https://at.alicdn.com/t/**.css
export const iconfontUrl = ``;

// 程序配置参数
export const app = store.get("__app__") || {
    name: "COOL-ADMIN",

    conf: {
        showAMenu: false, // 是否显示一级菜单栏
        showRouteNav: true, // 是否显示路由导航栏
        showProcess: true, // 是否显示页面进程栏
        customMenu: false // 自定义菜单
    },

    theme: {
        color: "", // 主题色
        url: "" // 主题样式地址
    }
};

// 自定义菜单列表
export const menuList = [];