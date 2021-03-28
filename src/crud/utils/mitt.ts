import mitt from "mitt";

const emitter: any = mitt();

class Emitter {
	id: number;

	constructor(id?: number) {
		this.id = id || 0;
	}

	send(type: string, name: string, ...args: any[]) {
		emitter[type](`${this.id}__${name}`, ...args);
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

export default Emitter;
