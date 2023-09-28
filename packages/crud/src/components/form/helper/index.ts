import { reactive, ref } from "vue";
import { useConfig } from "../../../hooks";

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

	// 表单是否可见
	const visible = ref(false);

	// 表单提交保存状态
	const saving = ref(false);

	// 表单加载状态
	const loading = ref(false);

	// 表单禁用状态
	const disabled = ref(false);

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
