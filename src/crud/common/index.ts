Promise.prototype.done = function(cb: Function) {
	const P: any = this.constructor;

	return this.then(
		(value: any) => P.resolve(cb()).then(() => value),
		(reason: any) =>
			P.resolve(cb()).then(() => {
				throw reason;
			})
	);
};
