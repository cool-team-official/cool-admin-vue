<template>
	<div class="cl-chat__message">
		<div class="head"></div>
		<div class="list scroller1"></div>
		<div class="footer">
			<div class="tools">
				<ul>
					<li></li>
				</ul>
			</div>

			<div class="input">
				<el-input type="textarea" :rows="1" placeholder="输入内容"></el-input>
				<el-button type="success">发送</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.cl-chat__message {
	display: flex;
	flex-direction: column;
	background-color: #fff;
	flex: 1;
	border-radius: 5px;

	.head {
		display: flex;
		height: 50px;
		border-bottom: 1px solid #eee;
	}

	.list {
		flex: 1;
	}

	.footer {
		border-top: 1px solid #eee;
		padding: 10px;

		.tools {
			display: flex;
			margin-bottom: 10px;

			ul {
				li {
					height: 30px;
					width: 30px;
					border-radius: 3px;
					background-color: #eee;
					margin-right: 10px;
					list-style: none;
				}
			}
		}

		.input {
			display: flex;

			.el-button {
				margin-left: 10px;
			}
		}
	}
}
</style>
