import { defineComponent, type PropType } from "vue";
import { UserFilled } from "@element-plus/icons-vue";

export default defineComponent({
	name: "cl-avatar",

	props: {
		modelValue: String,
		src: String,
		icon: {
			type: null,
			default: UserFilled
		},
		size: [String, Number] as PropType<"large" | "default" | "small" | number>,
		shape: String as PropType<"circle" | "square">,
		fit: {
			type: String as PropType<"fill" | "contain" | "cover" | "none" | "scale-down">,
			default: "cover"
		}
	},

	setup(props) {
		return () => {
			return (
				<el-avatar
					style={{
						height: props.size + "px",
						width: props.size + "px"
					}}
					{...{
						...props,
						src: props.modelValue || props.src
					}}
				/>
			);
		};
	}
});
