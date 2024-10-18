import { type PropType, defineComponent } from 'vue';
import data from '../data/pca.json';

export default defineComponent({
	name: 'cl-distpicker',

	props: {
		props: Object,
		type: {
			type: String as PropType<'pc' | 'pca'>,
			default: 'pca'
		}
	},

	setup(props) {
		return () => {
			return (
				<el-cascader
					clearable
					options={data.map(e => {
						if (props.type === 'pc') {
							return {
								...e,
								children: e.children.map(a => {
									return {
										...a,
										children: undefined
									};
								})
							};
						}

						return e;
					})}
					props={{ label: 'name', value: 'name', ...props.props }}
				/>
			);
		};
	}
});
