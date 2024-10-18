import _mitt from "mitt";

const mitt = _mitt();

class Mitt {
	id: number;

	constructor(id?: number) {
		this.id = id || 0;
	}

	send(type: "emit" | "off" | "on", name: string, ...args: any[]) {
		// @ts-expect-error
		mitt[type](`${this.id}__${name}`, ...args);
	}

	emit(name: string, ...args: any[]) {
		this.send("emit", name, ...args);
	}

	off(name: string, handler: (...args: any[]) => void) {
		this.send("off", name, handler);
	}

	on(name: string, handler: (...args: any[]) => void) {
		this.send("on", name, handler);
	}
}

export { Mitt, mitt };
