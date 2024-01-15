import { TestService } from "../test/service";
import { watch, ref, nextTick, getCurrentInstance, Ref, inject, provide } from "vue";

// 获取上级
function useParent(name: string, r: Ref) {
	const d = getCurrentInstance();

	if (d) {
		let parent = d.proxy?.$.parent;

		if (parent) {
			while (parent && parent.type?.name != name && parent.type?.name != "cl-crud") {
				parent = parent?.parent;
			}

			if (parent) {
				if (parent.type.name == name) {
					r.value = parent.exposed;
				}
			}
		}
	}
}

// 多事件
function useEvent(names: string[], { r, options, clear }: any) {
	const d: any = {};

	if (!r.__ev) r.__ev = {};

	names.forEach((k) => {
		if (!r.__ev[k]) r.__ev[k] = [];

		if (options[k]) {
			r.__ev[k].push(options[k]);
		}

		d[k] = (...args: any[]) => {
			r.__ev[k].filter(Boolean).forEach((e: any) => {
				e(...args);
			});

			if (clear == k) {
				for (const i in r.__ev) {
					r.__ev[i].splice(1, 999);
				}
			}
		};
	});

	return d;
}

// crud
export function useCrud(options?: ClCrud.Options, cb?: (app: ClCrud.Ref) => void) {
	const Crud = ref<ClCrud.Ref>();
	useParent("cl-crud", Crud);

	if (options) {
		// 测试模式
		if (options.service == "test") {
			options.service = new TestService();
		}

		provide("useCrud__options", options);
	}

	watch(Crud, (val) => {
		if (val) {
			if (cb) {
				cb(val);
			}
		}
	});

	return Crud;
}

// 新增、编辑
export function useUpsert<T = any>(options?: ClUpsert.Options<T>) {
	const Upsert = ref<ClUpsert.Ref>();
	useParent("cl-upsert", Upsert);

	if (options) {
		provide("useUpsert__options", options);
	}

	watch(
		Upsert,
		(val) => {
			if (val) {
				if (options) {
					const event = useEvent(["onOpen", "onOpened", "onClosed"], {
						r: val,
						options,
						clear: "onClosed"
					});

					Object.assign(val.config, event);
				}
			}
		},
		{
			immediate: true
		}
	);

	return Upsert;
}

// 表格
export function useTable<T = any>(options?: ClTable.Options<T>) {
	const Table = ref<ClTable.Ref<T>>();
	useParent("cl-table", Table);

	if (options) {
		provide("useTable__options", options);
	}

	return Table;
}

// 表单
export function useForm<T = any>(cb?: (app: ClForm.Ref<T>) => void) {
	const Form = ref<ClForm.Ref<T>>();
	useParent("cl-form", Form);

	nextTick(() => {
		if (cb && Form.value) {
			cb(Form.value);
		}
	});

	return Form;
}

// 高级搜索
export function useAdvSearch<T = any>(options?: ClAdvSearch.Options<T>) {
	const AdvSearch = ref<ClAdvSearch.Ref<T>>();
	useParent("cl-adv-search", AdvSearch);

	if (options) {
		provide("useAdvSearch__options", options);
	}

	return AdvSearch;
}

// 搜索
export function useSearch<T = any>(options?: ClSearch.Options<T>) {
	const Search = ref<ClSearch.Ref<T>>();
	useParent("cl-search", Search);

	if (options) {
		provide("useSearch__options", options);
	}

	return Search;
}

// 对话框
export function useDialog(options?: { onFullscreen(visible: boolean): void }) {
	const Dialog = inject("dialog") as ClDialog.Provide;

	watch(
		() => Dialog?.fullscreen.value,
		(val) => {
			options?.onFullscreen(val);
		}
	);

	return Dialog;
}
