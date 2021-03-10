<template>
	<el-scrollbar>
		<div class="demo">
			<div class="list">
				<div
					class="item"
					:style="{
						width: `calc(${100 / cols}% - 10px)`
					}"
					:ref="`col-${index + 1}`"
					v-for="(item, index) in layout"
					:key="index"
				>
					<transition-group name="fade">
						<component
							:ref="item2"
							:is="item2"
							:key="item2 + index2"
							v-for="(item2, index2) in item"
						></component>
					</transition-group>
				</div>
			</div>
		</div>
	</el-scrollbar>
</template>

<script>
import BClUpload from "./components/b-cl-upload";
import BVCopy from "./components/b-v-copy";
import BIconSvg from "./components/b-icon-svg";
import BClCrud from "./components/b-cl-crud";
import BClForm from "./components/b-cl-form";
import BClContextMenu from "./components/b-cl-context-menu";
import BErrorPage from "./components/b-error-page";
import BClEditorQuill from "./components/b-cl-editor-quill";

export default {
	components: {
		BClUpload,
		BVCopy,
		BIconSvg,
		BClCrud,
		BClForm,
		BClContextMenu,
		BErrorPage,
		BClEditorQuill
	},

	data() {
		return {
			list: [
				"b-cl-upload",
				"b-cl-crud",
				"b-icon-svg",
				"b-v-copy",
				"b-cl-form",
				"b-cl-context-menu",
				"b-error-page",
				"b-cl-editor-quill"
			],
			cols: 4,
			layout: [[], [], [], []]
		};
	},

	mounted() {
		const width = document.body.clientWidth;

		if (width < 768) {
			this.cols = 1;
		} else if (width < 1000) {
			this.cols = 2;
		} else if (width < 1500) {
			this.cols = 3;
		} else {
			this.cols = 4;
		}

		this.append();
	},

	methods: {
		getHeight(name) {
			return this.$refs[name][0].offsetHeight;
		},

		selectCol() {
			let arr = new Array(this.cols).fill(1);

			for (let i = 0; i < this.cols; i++) {
				arr[i] = this.getHeight(`col-${i + 1}`);
			}

			let min = Math.min.apply(this, arr);

			return arr.indexOf(min);
		},

		append(index = 0) {
			const i = this.selectCol();
			const item = this.list[index];

			if (!item) {
				return false;
			}

			this.layout[i].push(item);

			this.$nextTick(() => {
				setTimeout(() => {
					this.append(index + 1);
				}, 100);
			});
		}
	}
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
	transition: all 0.5s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

.demo {
	overflow: hidden;

	.list {
		margin: 0 -5px;
	}

	.item {
		width: calc(25% - 10px);
		margin: 0 5px;
		float: left;

		&:last-child {
			margin-right: 0;
		}
	}

	.scope {
		background-color: #fff;
		border-radius: 3px;
		margin-bottom: 10px;

		.h {
			height: 30px;
			display: flex;
			align-items: center;
			padding: 10px;
			font-size: 12px;

			span {
				background-color: $color-primary;
				color: #fff;
				border-radius: 3px;
				padding: 2px 5px;
				margin-right: 10px;
				font-size: 14px;
				letter-spacing: 1px;
			}
		}

		.c {
			padding: 10px;

			&._svg {
				.icon-svg {
					margin-right: 15px;
				}
			}

			a {
				font-size: 13px;
				color: #666;
				position: relative;

				&:hover {
					&:after {
						content: "";
						width: 100%;
						height: 1px;
						position: absolute;
						bottom: -2px;
						left: 0;
						background-color: $color-primary;
					}
				}
			}
		}

		.f {
			height: 30px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			font-size: 12px;

			.date {
				color: #999;
			}
		}
	}
}
</style>
