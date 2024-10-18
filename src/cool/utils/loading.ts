export const Loading = {
	resolve: null as (() => void) | null,
	next: null as Promise<void> | null,

	async set(list: Promise<any>[]) {
		try {
			await Promise.all(list);
		} catch (e) {
			console.error('[Loading] Error: ', e);
		}

		if (this.resolve) {
			this.resolve();
		}
	},

	async wait() {
		if (this.next) {
			return this.next;
		}
		return Promise.resolve();
	},

	close() {
		const el = document.getElementById('Loading');

		if (el) {
			setTimeout(() => {
				el.classList.add('is-hide');
			}, 0);
		}
	}
};

Loading.next = new Promise<void>(resolve => {
	Loading.resolve = resolve;
});
