import { defineComponent, h, resolveComponent, ref, reactive, watch } from "vue";
import { isComponent } from "/@/cool/utils";

export default defineComponent({
	name: "cl-editor",

	props: {
		name: {
			type: String,
			required: true
		}
	},

	setup(props, { slots, expose }) {
		const Editor = ref();
		const ex = reactive({});

		watch(Editor, (v) => {
			if (v) {
				Object.assign(ex, v);
			}
		});

		expose(ex);

		return () => {
			return isComponent(props.name) ? (
				h(
					// @ts-ignore
					resolveComponent(props.name),
					{
						...props,
						ref: Editor
					},
					slots
				)
			) : (
				<el-input type="textarea" rows={4} placeholder="请输入" {...props} />
			);
		};
	}
});
