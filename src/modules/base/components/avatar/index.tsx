import { defineComponent, PropType } from "vue";
import "./index.scss";

export default defineComponent({
	name: "cl-avatar",

	props: {
		modelValue: String,
		src: String,
		icon: null,
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
				<div class="cl-avatar">
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
				</div>
			);
		};
	}
});
