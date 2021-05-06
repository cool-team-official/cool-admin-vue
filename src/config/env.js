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

export const iconfontUrl = ``;

export const app = store.get("__app__") || {
    name: "COOL-ADMIN",

    conf: {
        showAMenu: false,
        showRouteNav: true,
        showProcess: true,
        customMenu: false
    },

    theme: {
        color: "",
        url: ""
    }
};

export const menuList = [];