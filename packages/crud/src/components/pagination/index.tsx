import { useCore, useTools } from "../../hooks";
import { defineComponent, h, ref } from "vue";

export default defineComponent({
	name: "cl-pagination",

	setup(_, { expose }) {
		const { crud, mitt } = useCore();
		const { style, browser } = useTools();

		// 总数
		const total = ref(0);

		// 当前页数
		const currentPage = ref(1);

		// 每页大小
		const pageSize = ref(20);

		// 页数发生变化
		function onCurrentChange(index: number) {
			crud.refresh({
				page: index
			});
		}

		// 条目发生变化
		function onSizeChange(size: number) {
			crud.refresh({
				page: 1,
				size
			});
		}

		function setPagination(res: DeepPartial<ClCrud.Pagination>) {
			if (res) {
				currentPage.value = res.currentPage || res.page || 1;
				pageSize.value = res.pageSize || res.size || 20;
				total.value = res.total || 0;
				crud.params.size = pageSize.value;
			}
		}

		mitt.on("crud.refresh", ({ pagination }: { pagination: ClCrud.Pagination }) => {
			setPagination(pagination);
		});

		expose({
			total,
			currentPage,
			pageSize,
			setPagination
		});

		return () => {
			return h(
				<el-pagination
					small={style.size == "small"}
					background
					page-sizes={[10, 20, 30, 40, 50, 100]}
					layout={
						browser.isMini
							? "prev, pager, next"
							: "total, sizes, prev, pager, next, jumper"
					}
				/>,
				{
					onSizeChange,
					onCurrentChange,
					total: total.value,
					currentPage: currentPage.value,
					pageSize: pageSize.value
				}
			);
		};
	}
});
