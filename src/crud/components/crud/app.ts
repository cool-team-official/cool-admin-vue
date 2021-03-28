import { merge } from "merge";
import { deepMerge, isFunction } from "../../utils";

export const bootstap = (crud: any, { fn }: any) => {
	const { params, permission, service, refresh, id } = crud || {};

	const app = {
		refresh(d: any) {
			return isFunction(d) ? d(params, refresh) : refresh(d);
		}
	};

	function ctx(data: any) {
		deepMerge(crud, data);

		return ctx;
	}

	ctx.id = id;

	ctx.service = function(s: any) {
		if (s) {
			Object.assign(crud.service, s);
			crud.service.__proto__ = s.__proto__;
		}

		if (fn.permission) {
			merge(permission, fn.permission({ permission, service, refresh }));
		}

		return ctx;
	};

	ctx.permission = function(d: any) {
		if (isFunction(d)) {
			merge(permission, d({ service, permission }));
		} else {
			merge(permission, d);
		}

		return ctx;
	};

	ctx.set = (key: string, value: any) => {
		deepMerge(crud[key], value);

		return ctx;
	};

	ctx.done = function() {
		console.log("done");
	};

	return { ctx, app };
};
