import { TreeData } from "element-plus/es/components/tree/src/tree.type";
import { service } from "/@/cool";
import Node from "element-plus/es/components/tree/src/model/node";
import ClAvatar from "../components/avatar/index";
import { type ClViewGroup, useViewGroup } from "/@/plugins/view";

export function useDeptViewGroup(options: DeepPartial<ClViewGroup.Options>) {
	const { ViewGroup } = useViewGroup({
		label: "员工列表",
		service: service.base.sys.department,
		enableAdd: false,
		enableRefresh: false,
		enableContextMenu: false,
		tree: {
			lazy: true,
			onLoad(node: Node, resolve: (data: TreeData) => void) {
				if (node.data.id) {
					service.base.sys.user.list({ departmentId: node.data.id }).then((res) => {
						res.forEach((e) => {
							e.isLeaf = true;
							e.icon = (
								<ClAvatar
									size={22}
									src={e.headImg}
									style={{ marginRight: "6px" }}
								/>
							);
						});

						res.unshift(...(node.data.children || []));

						resolve(res);
					});
				}
			}
		},
		...options
	});

	return {
		ViewGroup
	};
}
