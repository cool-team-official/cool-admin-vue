import { Store } from "vuex";
import { Router } from "vue-router";

export declare class CoolStore<S> extends Store<S> {
	service?: any;
}

export declare interface CoolRouter extends Router {
	$plugin?: {
		addViews(list: any[], options?: any): void;
	};
}
