import { createStore } from "vuex";
import { CoolStore } from "/@/core/types";

const store = createStore({
	strict: true
}) as CoolStore<any>;

export default store;
