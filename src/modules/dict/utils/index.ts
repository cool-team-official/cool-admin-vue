export function deepFind(value: any, list: any[]) {
	function deep(arr: any[]): any | undefined {
		for (const e of arr) {
			if (e.value === value) {
				return e;
			} else if (e.children) {
				const d = deep(e.children);
				if (d !== undefined) {
					return d;
				}
			}
		}
		return undefined;
	}

	return deep(list);
}
