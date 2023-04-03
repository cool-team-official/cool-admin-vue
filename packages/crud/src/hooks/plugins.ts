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
			exposed.config.items.find((e) => {
				if (e.prop == name) {
					if (e.component) {
						e.component.ref = setRefs(name);
					}
				}
			});

			onOpen(() => {
				refs[name]?.focus();
			});
		}
	};
}
