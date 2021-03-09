<template>
	<div class="app-process">
		<div class="app-process__left hidden-xs-only" @click="toLeft">
			<i class="el-icon-arrow-left"></i>
		</div>

		<div class="app-process__scroller">
			<div
				class="block"
				v-for="(item, index) in processList"
				:key="index"
				:class="{ active: item.active }"
				:data-index="index"
				@mousedown="
					e => {
						onTap(e, item);
					}
				"
			>
				<span>{{ item.label }}</span>

				<i
					class="el-icon-close"
					v-if="index > 0"
					:class="{ active: index > 0 }"
					@mousedown.stop="onDel(index)"
				></i>
			</div>
		</div>

		<div class="app-process__right hidden-xs-only" @click="toRight">
			<i class="el-icon-arrow-right"></i>
		</div>

		<ul class="context-menu" v-show="menu.visible" :style="menu.style">
			<li @click="onClose('current')" v-if="isHit">关闭当前</li>
			<li @click="onClose('other')">关闭其他</li>
			<li @click="onClose('all')">关闭所有</li>
		</ul>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
	name: "cl-process",

	data() {
		return {
			menu: {
				visible: false,
				current: {},
				style: {
					left: 0,
					top: 0
				}
			},

			isHit: false
		};
	},

	computed: {
		...mapGetters(["processList"])
	},

	mounted() {
		this.$el.oncontextmenu = e => {
			e.returnValue = false;
		};

		document.body.addEventListener("click", () => {
			if (this.menu.visible) {
				this.menu.visible = false;
			}
		});
	},

	methods: {
		...mapMutations(["ADD_PROCESS", "DEL_PROCESS", "SET_PROCESS"]),

		onTap(e, item) {
			this.isHit = item.active;

			if (e.button == 0) {
				this.$router.push(item.value);
			} else {
				this.menu = {
					current: item,
					visible: true,
					style: {
						left: e.layerX + "px",
						top: e.layerY + "px"
					}
				};
			}
		},

		onDel(index) {
			this.DEL_PROCESS(index);

			this.toPath();
		},

		onClose(cmd) {
			const { current } = this.menu;

			switch (cmd) {
				case "current":
					this.onDel(this.processList.findIndex(e => e.value == current.value));
					break;

				case "other":
					this.SET_PROCESS(
						this.processList.filter(e => e.value == current.value || e.value == "/")
					);
					break;

				case "all":
					this.SET_PROCESS(this.processList.filter(e => e.value == "/"));
					break;
			}

			this.toPath();
		},

		toPath() {
			const active = this.processList.find(e => e.active);

			if (!active) {
				const next = this.processList[this.processList.length - 1];
				this.$router.push(next ? next.value : "/");
			}
		},

		toLeft() {
			let scroller = this.$el.querySelector(".app-process__scroller");
			scroller.scrollTo(scroller.scrollLeft - 100, 0);
		},

		toRight() {
			let scroller = this.$el.querySelector(".app-process__scroller");
			scroller.scrollTo(scroller.scrollLeft + 100, 0);
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
				width: auto;
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

	.context-menu {
		margin: 0;
		background: #fff;
		z-index: 100;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

		li {
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;

			&:hover {
				background: #eee;
			}
		}
	}
}
</style>
