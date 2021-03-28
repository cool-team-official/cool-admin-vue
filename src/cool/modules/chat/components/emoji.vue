<template>
	<div>
		<el-popover
			:visible="visible"
			:width="popoverWidth"
			placement="top"
			trigger="click"
			popper-class="popper-emoji"
		>
			<div class="tool-emoji">
				<div class="tool-emoji__scroller scroller1">
					<div
						class="tool-emoji__item"
						v-for="(item, index) in list"
						:key="index"
						@click="select(item)"
					>
						<img :src="item" />
					</div>
				</div>
			</div>

			<template #reference>
				<img src="../static/images/emoji.png" alt="" @click="open" />
			</template>
		</el-popover>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";

// 表情列表
const emoji = {
	url: "https://cool-comm.oss-cn-shenzhen.aliyuncs.com/show/imgs/chat/",
	list: [
		"angry-face.png",
		"anguished-face.png",
		"astonished-face.png",
		"confounded-face.png",
		"confused-face.png",
		"crying-face.png",
		"disappointed-but-relieved-face.png",
		"disappointed-face.png",
		"dizzy-face.png",
		"drooling-face.png",
		"expressionless-face.png",
		"face-savouring-delicious-food.png",
		"face-screaming-in-fear.png",
		"face-throwing-a-kiss.png",
		"face-with-cold-sweat.png",
		"face-with-cowboy-hat.png",
		"face-with-finger-covering-closed-lips.png",
		"face-with-head-bandage.png",
		"face-with-look-of-triumph.png",
		"face-with-medical-mask.png",
		"face-with-monocle.png",
		"face-with-one-eyebrow-raised.png",
		"face-with-open-mouth-and-cold-sweat.png",
		"face-with-open-mouth-vomiting.png",
		"face-with-open-mouth.png",
		"face-with-party-horn-and-party-hat.png",
		"face-with-pleading-eyes.png",
		"face-with-rolling-eyes.png",
		"face-with-stuck-out-tongue-and-tightly-closed-eyes.png",
		"face-with-stuck-out-tongue-and-winking-eye.png",
		"face-with-stuck-out-tongue.png",
		"face-with-thermometer.png",
		"face-with-uneven-eyes-and-wavy-mouth.png",
		"face-without-mouth.png",
		"fearful-face.png",
		"flushed-face.png",
		"freezing-face.png",
		"frowning-face-with-open-mouth.png",
		"grimacing-face.png",
		"grinning-face-with-one-large-and-one-small-eye.png",
		"grinning-face-with-smiling-eyes.png",
		"grinning-face-with-star-eyes.png",
		"grinning-face.png",
		"hugging-face.png",
		"hushed-face.png",
		"imp.png",
		"kissing-face-with-closed-eyes.png",
		"kissing-face-with-smiling-eyes.png",
		"kissing-face.png",
		"loudly-crying-face.png",
		"lying-face.png",
		"money-mouth-face.png",
		"nauseated-face.png",
		"nerd-face.png",
		"neutral-face.png",
		"overheated-face.png",
		"pensive-face.png",
		"persevering-face.png",
		"pouting-face.png",
		"relieved-face.png",
		"rolling-on-the-floor-laughing.png",
		"serious-face-with-symbols-covering-mouth.png",
		"shocked-face-with-exploding-head.png",
		"sleeping-face.png",
		"sleepy-face.png",
		"slightly-frowning-face.png",
		"slightly-smiling-face.png",
		"smiling-face-with-halo.png",
		"smiling-face-with-heart-shaped-eyes.png",
		"smiling-face-with-horns.png",
		"smiling-face-with-open-mouth-and-smiling-eyes.png",
		"smiling-face-with-open-mouth-and-tightly-closed-eyes.png",
		"smiling-face-with-open-mouth.png",
		"smiling-face-with-smiling-eyes-and-hand-covering-mouth.png",
		"smiling-face-with-smiling-eyes-and-three-hearts.png",
		"smiling-face-with-smiling-eyes.png",
		"smiling-face-with-sunglasses.png",
		"smirking-face.png",
		"sneezing-face.png",
		"thinking-face.png",
		"tired-face.png",
		"upside-down-face.png",
		"weary-face.png",
		"white-frowning-face.png",
		"white-smiling-face.png",
		"winking-face.png",
		"worried-face.png",
		"zipper-mouth-face.png"
	]
};

export default defineComponent({
	setup(_, { emit }) {
		const store = useStore();

		// 是否可见
		const visible = ref<boolean>(false);

		// 表情列表
		const list = ref<any[]>(emoji.list.map(e => emoji.url + e));

		// 弹窗宽度
		const popoverWidth = computed(() => {
			const { width } = store.getters.browser;
			return (width > 500 ? 500 : width) - 24;
		});

		function open() {
			visible.value = true;
		}

		function close() {
			visible.value = false;
		}

		function select(e: any) {
			emit("select", e);
			close();
		}

		return {
			visible,
			list,
			popoverWidth,
			open,
			close,
			select
		};
	}
});
</script>

<style lang="scss">
.popper-emoji {
	padding: 5px !important;
}
</style>

<style lang="scss" scoped>
.tool-emoji {
	height: 250px;
	box-sizing: border-box;

	&__scroller {
		display: flex;
		flex-wrap: wrap;
		height: 100%;
		overflow: auto;
	}

	&__item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		width: 50px;
		cursor: pointer;

		&:hover,
		&:active {
			background-color: #f7f7f7;
		}

		img {
			display: inline-block;
			height: 25px;
			width: 25px;
		}
	}
}
</style>
