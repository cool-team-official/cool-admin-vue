<template>
	<div class="cl-chat-notice" @click="openChatBox">
		<el-badge :value="number" :hidden="number === 0">
			<i class="el-icon-message-solid"></i>
		</el-badge>

		<!-- 聊天盒子 -->
		<cl-chat ref="chat" @message="updateNum"></cl-chat>
	</div>
</template>

<script>
export default {
	name: "cl-chat-notice",

	data() {
		return {
			visible: false,
			number: 0
		};
	},

	created() {
		this.refresh();
	},

	methods: {
		refresh() {
			this.$service.im.session.unreadCount().then(res => {
				this.number = Number(res);
			});
		},

		updateNum(isOpen) {
			this.number += isOpen ? 0 : 1;
		},

		openChatBox() {
			this.$refs["chat"].open();
			this.number = 0;
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-chat-notice {
	position: relative;

	.el-icon-message-solid {
		font-size: 20px;
	}

	.el-badge {
		transform: scale(0.8);
	}
}
</style>
