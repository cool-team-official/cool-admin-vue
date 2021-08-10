<template>
	<div class="cl-chat-notice" @click="openChatBox">
		<el-badge :value="number" :hidden="number === 0">
			<i class="el-icon-message-solid"></i>
		</el-badge>

		<!-- 聊天盒子 -->
		<cl-chat :ref="setRefs('chat')" @message="updateNum" />
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount, ref } from "vue-demi";
import { useRefs } from "/@/core";

export default defineComponent({
	name: "cl-chat-notice",

	setup() {
		const service = inject<any>("service");
		const { refs, setRefs } = useRefs();

		const number = ref<number>(0);

		function refresh() {
			service.chat.session.unreadCount().then((res: any) => {
				number.value = Number(res);
			});
		}

		function updateNum(isOpen: boolean) {
			number.value += isOpen ? 0 : 1;
		}

		function openChatBox() {
			refs.value.chat.open();
			number.value = 0;
		}

		onBeforeMount(() => {
			refresh();
		});

		return {
			refs,
			setRefs,
			number,
			refresh,
			updateNum,
			openChatBox
		};
	}
});
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
