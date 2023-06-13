import { useRefs } from "./core";

/**
 * 设置聚焦，prop为空则默认第一个选项
 * @param prop
 * @returns
 */
export function setFocus(prop?: string): ClForm.Plugin {
	const { refs, setRefs } = useRefs();

	return ({ exposed, onOpen }) => {
		const name = prop || exposed.config.items[0].prop;

		if (name) {
			function deep(arr: ClForm.Item[]) {
				arr.forEach((e) => {
					if (e.prop == name && name) {
						if (e.component) {
							e.component.ref = setRefs(name);
						}
					} else {
						deep(e.children || []);
					}
				});
			}

			deep(exposed.config.items);

			onOpen(() => {
				refs[name]?.focus();
			});
		}
	};
}
