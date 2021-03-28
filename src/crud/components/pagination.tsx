import { h, inject, ref, watch } from "vue";
import { Crud, Mitt } from "@/crud/types";

export default {
	name: "cl-pagination",

	props: {
		props: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},

	setup(props: any) {
		const crud = inject("crud") as Crud;
		const mitt = inject("mitt") as Mitt;

		// 总数
		const total = ref<number>(0);
		// 当前页码
		const currentPage = ref<number>(1);
		// 每页大小
		const pageSize = ref<number>(20);

		const onCurrentChange = (index: number) => {
			crud.refresh({
				page: index
			});
		};

		const onSizeChange = (size: number) => {
			crud.refresh({
				page: 1,
				size
			});
		};

		const setPagination = (res: any) => {
			if (res) {
				currentPage.value = res.currentPage || res.page || 1;
				pageSize.value = res.pageSize || res.size || 20;
				total.value = res.total | 0;
				crud.params.size = pageSize.value;
			}
		};

		mitt.on("crud.refresh", ({ pagination }: any) => {
			setPagination(pagination);
		});

		watch(() => props.props, setPagination, {
			immediate: true
		});

		return {
			total,
			currentPage,
			pageSize,
			onCurrentChange,
			onSizeChange,
			setPagination
		};
	},

	render(ctx: any) {
		const ElPagination = (
			<el-pagination
				background
				page-sizes={[10, 20, 30, 40, 50, 100]}
				layout={"total, sizes, prev, pager, next, jumper"}
				{...ctx.props}></el-pagination>
		);

		return h(ElPagination, {
			onSizeChange: ctx.onSizeChange,
			onCurrentChange: ctx.onCurrentChange,
			total: ctx.total,
			"current-page": ctx.currentPage,
			"page-size": ctx.pageSize
		});
	}
};
