import { createStore, Store } from "vuex";

declare class CoolStore<S> extends Store<S> {
	service?: any;
}

const store = createStore({
	strict: true
}) as CoolStore<any>;

export default store;
