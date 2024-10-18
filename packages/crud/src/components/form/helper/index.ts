import { reactive, ref, watch } from "vue";
import { useConfig } from "../../../hooks";
import { cloneDeep } from "lodash-es";

export function useForm() {
	const { dict } = useConfig();

	// 表单配置
	const config = reactive<ClForm.Config>({
		title: "-",
		height: undefined,
		width: "50%",
		props: {
			labelWidth: 100
		},
		on: {},
		op: {
			hidden: false,
			saveButtonText: dict.label.save,
			closeButtonText: dict.label.close,
			buttons: ["close", "save"]
		},
		dialog: {
			closeOnClickModal: false,
			appendToBody: true
		},
		items: [],
		form: {},
		_data: {}
	});

	const Form = ref();

	// 表单数据
	const form = reactive<obj>({});

	// 表单数据备份
	const oldForm = ref<obj>({});

	// 表单是否可见
	const visible = ref(false);

	// 表单提交保存状态
	const saving = ref(false);

	// 表单加载状态
	const loading = ref(false);

	// 表单禁用状态
	const disabled = ref(false);

	// 监听表单变化
	watch(
		() => form,
		(val) => {
			if (config.on?.change) {
				for (const i in val) {
					if (form[i] !== oldForm.value[i]) {
						config.on?.change(val, i);
					}
				}
			}

			oldForm.value = cloneDeep(val);
		},
		{
			deep: true
		}
	);

	return {
		Form,
		config,
		form,
		visible,
		saving,
		loading,
		disabled
	};
}

export * from "./action";
export * from "./api";
export * from "./plugins";
export * from "./tabs";
