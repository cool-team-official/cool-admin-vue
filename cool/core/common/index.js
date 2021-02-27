Promise.prototype.done = function (cb) {
	let P = this.constructor;

	return this.then(
		(value) => P.resolve(cb()).then(() => value),
		(reason) =>
			P.resolve(cb()).then(() => {
				throw reason;
			})
	);
};
