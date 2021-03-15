<template>
	<div class="app-process">
		<div class="app-process__left hidden-xs-only" @click="toScroll(true)">
			<i class="el-icon-arrow-left"></i>
		</div>

		<div class="app-process__scroller">
			<div
				class="block"
				v-for="(item, index) in processList"
				:key="index"
				:class="{ active: item.active }"
				:data-index="index"
				@click="onTap(item)"
				@contextmenu.stop.prevent="openCM($event, item)"
			>
				<span>{{ item.label }}</span>

				<i
					class="el-icon-close"
					v-if="index > 0"
					:class="{ active: index > 0 }"
					@click.stop="onDel(index)"
				></i>
			</div>
		</div>

		<div class="app-process__right hidden-xs-only" @click="toScroll(false)">
			<i class="el-icon-arrow-right"></i>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { ContextMenu } from "cl-admin-crud";
import { last } from "cl-admin/utils";

export default {
	name: "cl-process",

	computed: {
		...mapGetters(["processList"])
	},

	methods: {
		...mapMutations(["ADD_PROCESS", "DEL_PROCESS", "SET_PROCESS"]),

		onTap(item) {
			this.$router.push(item.value);
		},

		onDel(index) {
			this.DEL_PROCESS(index);
			this.toPath();
		},

		openCM(e, item) {
			ContextMenu.open(e, {
				list: [
					{
						label: "关闭当前",
						hidden: this.$route.path !== item.value,
						callback: (_, done) => {
							this.onDel(this.processList.findIndex(e => e.value == item.value));
							done();
							this.toPath();
						}
					},
					{
						label: "关闭其他",
						callback: (_, done) => {
							this.SET_PROCESS(
								this.processList.filter(
									e => e.value == item.value || e.value == "/"
								)
							);
							done();
							this.toPath();
						}
					},
					{
						label: "关闭所有",
						callback: (_, done) => {
							this.SET_PROCESS(this.processList.filter(e => e.value == "/"));
							done();
							this.toPath();
						}
					}
				]
			});
		},

		toPath() {
			const active = this.processList.find(e => e.active);

			if (!active) {
				const next = last(this.processList);
				this.$router.push(next ? next.value : "/");
			}
		},

		toScroll(f) {
			const scroller = this.$el.querySelector(".app-process__scroller");
			scroller.scrollTo(scroller.scrollLeft + (f ? -100 : 100), 0);
		}
	}
};
</script>

<style lang="scss" scoped>
.app-process {
	display: flex;
	align-items: center;
	height: 30px;
	position: relative;

	&__left,
	&__right {
		background-color: #fff;
		height: 30px;
		line-height: 30px;
		padding: 0 2px;
		border-radius: 3px;
		cursor: pointer;

		&:hover {
			background-color: #eee;
		}
	}

	&__left {
		margin-right: 10px;
	}

	&__right {
		margin-left: 10px;
	}

	&__scroller {
		width: 100%;
		flex: 1;
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.block {
		display: inline-flex;
		align-items: center;
		border-radius: 3px;
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		background-color: #fff;
		font-size: 12px;
		margin-right: 10px;
		color: #909399;
		cursor: pointer;

		&:last-child {
			margin-right: 0;
		}

		i {
			font-size: 14px;
			width: 0;
			overflow: hidden;
			transition: all 0.3s;

			&:hover {
				color: #fff;
				background-color: $color-primary;
			}
		}

		&:hover {
			.el-icon-close {
				width: 14px;
				margin-left: 5px;
			}
		}

		&.active {
			span {
				color: $color-primary;
			}

			i {
				width: auto;
				margin-left: 5px;
			}

			&:before {
				background-color: $color-primary;
			}
		}
	}
}
</style>
