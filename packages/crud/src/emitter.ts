import { isObject } from "./utils";

export const crudList: ClCrud.Ref[] = [];

export const emitter: Emitter = {
	list: [],
	init(events) {
		if (events && isObject(events)) {
			for (const i in events) {
				this.on(i, events[i]);
			}
		} else {
			console.error("Events error");
		}
	},
	emit(name, data) {
		this.list.forEach((e: EmitterItem) => {
			const [_name] = e.name.split("-");

			if (name == _name) {
				e.callback(data, {
					crudList,
					refresh(params) {
						crudList.forEach((c) => c.refresh(params));
					}
				});
			}
		});
	},
	on(name, callback) {
		this.list.push({ name, callback });
	}
};
