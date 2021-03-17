<template>
	<div class="cl-route-nav">
		<p class="title">
			{{ lastName }}
		</p>

		<el-breadcrumb>
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in list" :key="index">{{
				(item.meta && item.meta.label) || item.name
			}}</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
	name: "cl-route-nav",

	data() {
		return {
			list: []
		};
	},

	watch: {
		$route: {
			immediate: true,
			handler(route) {
				const deep = item => {
					if (route.path === "/") {
						return false;
					}

					if (item.path == route.path) {
						return item;
					} else {
						if (item.children) {
							const ret = item.children.map(deep).find(Boolean);

							if (ret) {
								return [item, ret];
							} else {
								return false;
							}
						} else {
							return false;
						}
					}
				};

				this.list = _(this.menuGroup)
					.map(deep)
					.filter(Boolean)
					.flattenDeep()
					.value();

				if (this.list.length === 0) {
					this.list.push(route);
				}
			}
		}
	},

	computed: {
		...mapGetters(["menuGroup"]),

		lastName() {
			return _.last(this.list).name;
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-route-nav {
	/deep/.el-breadcrumb {
		margin: 0 10px;

		&__inner {
			font-size: 12px;
			padding: 0 10px;
			font-weight: normal;
			letter-spacing: 1px;
		}
	}

	.title {
		display: none;
		font-size: 15px;
		font-weight: 500;
		margin-left: 5px;
	}

	@media only screen and (max-width: 768px) {
		.title {
			display: block;
		}

		/deep/.el-breadcrumb {
			display: none;
		}
	}
}
</style>
