<template>
	<div class="text-stage">
		<div class="wrapper">
			<div class="slash"></div>
			<div class="sides">
				<div class="side"></div>
				<div class="side"></div>
				<div class="side"></div>
				<div class="side"></div>
			</div>
			<div class="text">
				<div class="text--backing">{{ modelValue }}</div>
				<div class="text--left">
					<div class="inner">{{ modelValue }}</div>
				</div>
				<div class="text--right">
					<div class="inner">{{ modelValue }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	fontSize: {
		type: String,
		default: "30px"
	},
	color: {
		type: String,
		default: "#000000"
	},
	modelValue: String
});
</script>

<style lang="scss" scoped>
$color: var(--el-text-color-primary);

.text-stage {
	display: flex;
	align-items: center;
	justify-content: center;
}
.wrapper {
	position: relative;
	font-size: v-bind(fontSize);
	color: $color;
	padding: 10px;
}
.slash {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) rotate(-24deg) scaleY(0);
	transform-origin: center center;
	width: 0.15rem;
	height: 145%;
	background-color: $color;
	z-index: 4;
	animation: slash 6s ease-in forwards;
	&:before {
		content: "";
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 0.75rem;
		height: 120%;
		background-color: $color;
		z-index: -1;
		opacity: 0.2;
	}
	&:after {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: $color;
	}
}
.sides {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	overflow: hidden;
	.side {
		position: absolute;
		background-color: $color;
	}
	.side:nth-child(1) {
		top: 0;
		left: 0;
		width: 100%;
		height: 0.15rem;
		transform: translateX(-101%);
		animation: side-top ease 6s forwards;
	}
	.side:nth-child(2) {
		top: 0;
		right: 0;
		width: 0.15rem;
		height: 100%;
		transform: translateY(-101%);
		animation: side-right ease 6s forwards;
	}
	.side:nth-child(3) {
		left: 0;
		bottom: 0;
		width: 100%;
		height: 0.15rem;
		transform: translateX(101%);
		animation: side-bottom ease 6s forwards;
	}
	.side:nth-child(4) {
		top: 0;
		left: 0;
		width: 0.15rem;
		height: 100%;
		transform: translateY(101%);
		animation: side-left ease 6s forwards;
	}
}
.text {
	position: relative;

	* {
		white-space: nowrap;
	}
}
.text--backing {
	opacity: 0;
}
.text--left {
	position: absolute;
	top: 0;
	left: 0;
	width: 51%;
	height: 100%;
	overflow: hidden;
	.inner {
		transform: translateX(100%);
		animation: text-left 6s ease-in-out forwards;
	}
}
.text--right {
	position: absolute;
	top: 0;
	right: 0;
	width: 50%;
	height: 100%;
	overflow: hidden;
	.inner {
		transform: translateX(-200%);
		animation: text-right 6s ease-in-out forwards;
	}
}

@keyframes slash {
	0% {
		transform: translate(-50%, -50%) rotate(-24deg) scaleY(0);
	}
	6% {
		transform: translate(-50%, -50%) rotate(-24deg) scaleY(1);
	}
	13% {
		transform: translate(-50%, -50%) rotate(-24deg) scaleY(1);
	}
	16.6% {
		transform: translate(-50%, -50%) rotate(-24deg) scaleY(0);
	}
	100% {
		transform: translate(-50%, -50%) rotate(-24deg) scaleY(0);
	}
}

@keyframes text-left {
	0% {
		transform: translateX(100%);
	}
	10% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(0);
	}
}

@keyframes text-right {
	0% {
		transform: translateX(-200%);
	}
	10% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(-100%);
	}
}

@keyframes side-top {
	0%,
	14% {
		transform: translateX(-101%);
	}
	24%,
	100% {
		transform: translateX(0);
	}
}

@keyframes side-right {
	0%,
	14%,
	23% {
		transform: translateY(-101%);
	}
	30%,
	100% {
		transform: translateY(0);
	}
}

@keyframes side-bottom {
	0%,
	14%,
	24%,
	28% {
		transform: translateX(101%);
	}
	37%,
	100% {
		transform: translateX(0);
	}
}

@keyframes side-left {
	0%,
	14%,
	24%,
	34%,
	35% {
		transform: translateY(101%);
	}
	44%,
	100% {
		transform: translateY(0);
	}
}
</style>
