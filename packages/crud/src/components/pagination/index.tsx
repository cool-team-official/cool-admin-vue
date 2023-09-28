import { defineComponent, h, onMounted, onUnmounted, ref } from "vue";
import { useBrowser, useConfig, useCore } from "../../hooks";

export default defineComponent({
	name: "cl-pagination",

	setup(_, { expose }) {
		const { crud, mitt } = useCore();
		const { style } = useConfig();
		const browser = useBrowser();

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

		// 设置分页信息
		function setPagination(res: obj) {
			if (res) {
				currentPage.value = res.currentPage || res.page || 1;
				pageSize.value = res.pageSize || res.size || 20;
				total.value = res.total || 0;
				crud.params.size = pageSize.value;
			}
		}

		// 数据刷新
		function onRefresh(res: ClCrud.Response["page"]) {
			setPagination(res.pagination);
		}

		// 监听刷新事件
		onMounted(() => {
			mitt.on("crud.refresh", onRefresh);
		});

		// 移除监听事件
		onUnmounted(() => {
			mitt.off("crud.refresh", onRefresh);
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
					small={style.size == "small" || browser.isMini}
					background
					page-sizes={[10, 20, 30, 40, 50, 100]}
					pager-count={browser.isMini ? 5 : 7}
					layout={
						browser.isMini ? "total, pager" : "total, sizes, prev, pager, next, jumper"
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
