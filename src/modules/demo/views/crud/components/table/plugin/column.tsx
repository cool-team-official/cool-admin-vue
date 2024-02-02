import { merge } from "lodash-es";
import { defineComponent } from "vue";

const columns = {
	UserInfo: {
		label: "用户信息",
		minWidth: 200,
		component: {
			vm: defineComponent({
				name: "user-info",

				props: {
					scope: null
				},

				setup(props) {
					return () => {
						return (
							<div>
								<p>{props.scope.name}</p>
								<p>{props.scope.phone}</p>
							</div>
						);
					};
				}
			})
		}
	}
} as { [key: string]: DeepPartial<ClTable.Column> };

/**
 * 列标签匹配，方便多个列表公用同一个组件
 * @returns
 */
export function setColumn(): ClTable.Plugin {
	return ({ exposed }) => {
		function deep(arr: ClTable.Column[]) {
			arr.forEach((e) => {
				if (e.tag) {
					merge(e, columns[e.tag]);
				}
				deep(e.children || []);
			});
		}

		deep(exposed.columns);
	};
}
