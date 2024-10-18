import { defineComponent, type PropType } from 'vue';
import { UserFilled } from '@element-plus/icons-vue';

export default defineComponent({
	name: 'cl-avatar',

	props: {
		modelValue: String,
		src: String,
		icon: {
			type: null,
			default: UserFilled
		},
		size: {
			type: [String, Number] as PropType<'large' | 'default' | 'small' | number>,
			default: 40
		},
		shape: {
			type: String as PropType<'circle' | 'square'>,
			default: 'square'
		},
		fit: {
			type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
			default: 'cover'
		}
	},

	setup(props) {
		return () => {
			const height = props.size + 'px';

			return (
				<div
					class="cl-avatar"
					style={{
						height
					}}
				>
					<el-avatar
						style={{
							height,
							width: props.size + 'px'
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
