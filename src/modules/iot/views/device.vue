<template>
	<cl-view-group ref="ViewGroup">
		<template #item="{ item, selected }">
			<div class="device-item" :class="{ 'is-active': selected.id == item.id }">
				<div class="icon">
					<cl-avatar shape="square" :src="item.icon || DeviceIcon" />
				</div>

				<div class="det">
					<p class="name">{{ item.name }}</p>
					<p class="text">
						{{ item.uniqueId }}
					</p>
				</div>

				<div
					class="status"
					:class="{
						'is-on': item.status
					}"
				>
					{{ item.status ? "在线" : "离线" }}
				</div>
			</div>
		</template>

		<template #right>
			<div class="message" v-loading="loading">
				<!-- 消息列表 -->
				<el-scrollbar class="list" :ref="setRefs('scrollbar')" @scroll="onScroll">
					<ul>
						<li v-for="(item, index) in list" :key="index">
							<div
								class="item"
								:class="{
									'is-right': item.type == 0
								}"
							>
								<div class="icon">
									<cl-avatar
										:size="36"
										shape="square"
										:src="
											item.type == 0
												? user.info?.headImg
												: ViewGroup?.selected?.icon || DeviceIcon
										"
									/>
								</div>

								<div
									class="det"
									@contextmenu="
										(e) => {
											onContextMenu(e, item);
										}
									"
								>
									<div class="content">
										<span class="is-text">
											{{ item.data }}
										</span>
									</div>

									<div class="date">
										{{ dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}
									</div>
								</div>
							</div>
						</li>
					</ul>

					<div class="empty" v-if="list.length == 0">
						<el-empty :image-size="100" description="暂无消息" />
					</div>
				</el-scrollbar>

				<!-- 底部 -->
				<div class="footer">
					<div class="input">
						<el-input
							v-model="value"
							type="textarea"
							:rows="4"
							resize="none"
							:autosize="{
								minRows: 4,
								maxRows: 10
							}"
							placeholder="输入内容"
						/>
						<el-button type="success" @click="send" :disabled="!value">发送</el-button>
					</div>
				</div>
			</div>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="iot-device" setup>
import { ContextMenu } from "@cool-vue/crud";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { debounce, orderBy } from "lodash-es";
import { computed, nextTick, onActivated, ref } from "vue";
import { useMqtt } from "../hooks";
import { useBase } from "/$/base";
import { useCool } from "/@/cool";
import dayjs from "dayjs";
import { onBeforeRouteLeave } from "vue-router";
import { useViewGroup } from "/@/plugins/view";
import DeviceIcon from "../static/icon/device.png";

const { service, refs, setRefs, mitt } = useCool();
const { copy } = useClipboard();
const { user } = useBase();
const mqtt = useMqtt();

const { ViewGroup } = useViewGroup({
	label: "设备",
	title: "消息列表",
	service: service.iot.device,
	onEdit(item) {
		return {
			width: "600px",
			items: [
				{
					label: "设备名称",
					prop: "name",
					component: {
						name: "el-input",
						props: {
							maxlength: 20,
							clearable: true
						}
					},
					required: true
				},
				{
					label: "设备ID",
					prop: "uniqueId",
					component: {
						name: "el-input",
						props: {
							maxlength: 30,
							clearable: true,
							disabled: !!item?.id
						}
					},
					required: true
				},
				{
					label: "设备图标",
					prop: "icon",
					component: {
						name: "cl-upload"
					}
				}
			]
		};
	},
	async onSelect(item) {
		mqtt.subscribe(item.uniqueId);

		await refresh({
			page: 1,
			deviceId: item.id
		});

		scrollToBottom();
	}
});

// 加载中
const loading = ref(false);

// 输入值
const value = ref("");

// 消息列表
const list = ref<Eps.IotMessageEntity>([]);

// 设备id
const uniqueId = computed(() => ViewGroup.value?.selected?.uniqueId);

// 参数
const reqParams = {
	page: 1,
	size: 20
};

// 是否加载完
let loaded = false;

// 刷新
async function refresh(params?: any) {
	loading.value = true;

	Object.assign(reqParams, {
		order: "createTime",
		sort: "desc",
		...params
	});

	await service.iot.message
		.page(reqParams)
		.then((res) => {
			const arr = orderBy(res.list, "createTime");

			// 保留列表滚动条位置
			if (reqParams.page == 1) {
				list.value = arr;
			} else {
				const s = refs.scrollbar.wrapRef.querySelector("ul");
				const h = s.clientHeight;

				list.value.unshift(...arr);

				nextTick(() => {
					refs.scrollbar.scrollTo(0, s.clientHeight - h);
				});
			}

			// 是否加载完
			loaded = res.pagination.total <= list.value.length;
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

// 滚动到底部
const scrollToBottom = debounce(() => {
	nextTick(() => {
		refs.scrollbar?.wrapRef?.scroll({
			top: 100000 + Math.random(),
			behavior: "smooth"
		});
	});
});

// 监听滚动
function onScroll({ scrollTop }: { scrollTop: number }) {
	if (scrollTop == 0 && !loaded) {
		refresh({
			page: reqParams.page + 1
		});
	}
}

// 发送消息
function send() {
	service.iot.mqtt
		.publish({
			uniqueId: uniqueId.value,
			data: value.value
		})
		.then(() => {
			append({
				data: value.value,
				type: 0
			});
			value.value = "";
		});
}

// 追加消息
function append(data: Eps.IotMessageEntity) {
	list.value.push({
		createTime: new Date(),
		...data
	});
	scrollToBottom();
}

// 右键菜单
function onContextMenu(e: Event, item: Eps.IotMessageEntity) {
	ContextMenu.open(e, {
		hover: {
			target: "content"
		},
		list: [
			{
				label: "复制",
				callback(done) {
					copy(item.data || "");
					ElMessage.success("复制成功");
					done();
				}
			}
		]
	});
}

// 监听消息
function onMessage({ id, message }: any) {
	if (uniqueId.value == id) {
		append({
			type: 1,
			data: message
		});
	}
}

onActivated(() => {
	mqtt.connect();
	mitt.on("iot.message", onMessage);
});

onBeforeRouteLeave(() => {
	mqtt.disconnect();
	mitt.off("iot.message");
});
</script>

<style lang="scss" scoped>
.device-item {
	display: flex;
	padding: 15px 10px;
	cursor: pointer;

	.icon {
		margin-right: 10px;
	}

	.det {
		flex: 1;

		.name {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.name {
			font-size: 14px;
			margin-bottom: 4px;
		}

		.text {
			font-size: 12px;
		}
	}

	.status {
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #909399;

		&::before {
			display: block;
			content: "";
			height: 8px;
			width: 8px;
			border-radius: 100%;
			background-color: currentColor;
			margin-right: 5px;
		}

		&.is-on {
			color: #67c23a;
		}
	}

	&.is-active {
		background-color: var(--color-primary);
		color: #fff;
	}

	&:not(.is-active):hover {
		background-color: var(--el-fill-color-light);
	}
}

.message {
	display: flex;
	flex-direction: column;
	background-color: #fff;
	border-radius: 6px;
	height: 100%;
	box-sizing: border-box;

	.list {
		flex: 1;
		background-color: var(--el-fill-color-lighter);

		ul {
			& > li {
				list-style: none;

				.item {
					display: flex;
					padding: 10px;

					.icon {
						margin-right: 10px;
					}

					.det {
						.date {
							font-size: 12px;
							margin: 6px 0 0 0;
							padding-left: 5px;
							color: #999;
						}

						.content {
							.is-text {
								display: inline-block;
								background-color: #fff;
								padding: 10px;
								border-radius: 0 8px 8px 8px;
								max-width: 400px;
								font-size: 14px;
								color: #000;
							}
						}
					}

					&.is-right {
						flex-direction: row-reverse;

						.icon {
							margin-left: 10px;
							margin-right: 0;
						}

						.det {
							text-align: right;

							.content {
								.is-text {
									border-radius: 8px 0 8px 8px;
									background-color: var(--color-primary);
									color: #fff;
								}
							}
						}
					}
				}
			}
		}

		.empty {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	}

	.footer {
		padding: 10px;
		background-color: var(--el-bg-color);

		.input {
			display: flex;
			position: relative;

			.el-button {
				margin-left: 10px;
				position: absolute;
				right: 10px;
				bottom: 10px;
			}
		}
	}
}
</style>
