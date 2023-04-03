import mitt from "mitt";

const ev = mitt();

class Mitt {
	id: number;

	constructor(id?: number) {
		this.id = id || 0;
	}

	send(type: "emit" | "off" | "on", name: string, ...args: any[]) {
		// @ts-ignore
		ev[type](`${this.id}__${name}`, ...args);
	}

	on(name: string, ...args: any[]) {
		this.send("on", name, ...args);
	}

	emit(name: string, ...args: any[]) {
		this.send("emit", name, ...args);
	}

	off(name: string, ...args: any[]) {
		this.send("off", name, ...args);
	}
}

export default Mitt;
