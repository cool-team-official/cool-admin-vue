import { computed, ref } from "vue";

export function useTabs({ config, Form }: { config: ClForm.Config; Form: Vue.Ref<any> }) {
	// 选中
	const active = ref<string | undefined>();

	// 列表
	const list = computed(() => {
		return get()?.props?.labels || [];
	});

	// 获取选项
	function getItem(value: any) {
		return list.value.find((e) => e.value == value);
	}

	// 是否已加载
	function isLoaded(value: any) {
		const d = getItem(value);
		return d?.lazy ? d.loaded : true;
	}

	// 加载后
	function onLoad(value: any) {
		const d = getItem(value);
		d!.loaded = true;
	}

	// 查找分组
	function toGroup(opts: { config: ClForm.Config; prop: string; refs: any }) {
		if (active.value) {
			let name;

			// 查找标签上绑定的数据
			const el = opts.refs.form.querySelector(`[data-prop="${opts.prop}"]`);

			// 各自判断
			if (el) {
				name = el?.getAttribute("data-group");
			} else {
				function deep(d: ClForm.Item) {
					if (d.prop == opts.prop) {
						name = d.group;
					} else {
						if (d.children) {
							d.children.forEach(deep);
						}
					}
				}

				config.items.forEach(deep);
			}

			if (name) {
				set(name);
			}
		}
	}

	// 获取参数
	function get() {
		return config.items.find((e) => e.type === "tabs");
	}

	// 设置参数
	function set(data: any) {
		active.value = data;
	}

	// 清空
	function clear() {
		// 清空选中
		active.value = undefined;

		// 清空加载状态
		list.value.forEach((e) => {
			if (e.lazy && e.loaded) {
				e.loaded = undefined;
			}
		});
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
					.filter((e) => e.group == active.value && !e._hidden && e.prop)
					.map((e) => {
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
		list,
		isLoaded,
		onLoad,
		get,
		set,
		change,
		clear,
		mergeProp,
		toGroup
	};
}
