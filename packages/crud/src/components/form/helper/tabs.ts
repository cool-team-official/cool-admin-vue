import { ref } from "vue";

export function useTabs({ config, Form }: { config: ClForm.Config; Form: Vue.Ref<any> }) {
	// 选中
	const active = ref<any>();

	// 获取参数
	function get() {
		return config.items.find((e) => e.type === "tabs");
	}

	function set(data: any) {
		active.value = data;
	}

	function clear() {
		active.value = null;
	}

	// 切换
	function change(value: any, isValid = true) {
		return new Promise((resolve: Function, reject: Function) => {
			function next() {
				active.value = value;
				resolve();
			}

			if (isValid) {
				let isError = false;

				const arr = config.items
					.filter((e: any) => e.group == active.value && !e._hidden && e.prop)
					.map((e: any) => {
						return new Promise((r: Function) => {
							// 验证表单
							Form.value.validateField(e.prop, (valid: string) => {
								if (valid) {
									isError = true;
								}

								r(valid);
							});
						});
					});

				Promise.all(arr).then((msg) => {
					if (isError) {
						reject(msg.filter(Boolean));
					} else {
						next();
					}
				});
			} else {
				next();
			}
		});
	}

	// 合并
	function mergeProp(item: ClForm.Item) {
		const d = get();

		if (d && d.props) {
			const { mergeProp, labels = [] } = d.props;

			if (mergeProp) {
				const t = labels.find((e) => e.value == item.group);

				if (t && t.name) {
					item.prop = `${t.name}-${item.prop}`;
				}
			}
		}
	}

	return {
		active,
		get,
		set,
		change,
		clear,
		mergeProp
	};
}
