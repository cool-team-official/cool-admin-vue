<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">rules</el-tag>
			<span>添加/删除表单项</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/rules.vue']" />

			<!-- 自定义表单组件 -->
			<cl-form ref="Form">
				<template #slot-cert="{ scope }">
					<div class="cert">
						<!--【很重要】prop、rules 配置格式如下 -->
						<el-form-item
							v-for="(item, index) in scope.cert"
							:key="index"
							:label="`证书${index + 1}`"
							:prop="`cert.${index}.label`"
							:rules="{
								message: `请填写证书${index + 1}`,
								required: true
							}"
						>
							<div class="row">
								<!-- 输入框 -->
								<el-input v-model="item.label" placeholder="请填写证书"></el-input>

								<!-- 删除行 -->
								<el-icon @click="rowDel(index)">
									<delete />
								</el-icon>
							</div>
						</el-form-item>

						<!-- 添加行 -->
						<el-row type="flex" justify="end">
							<el-button @click="rowAdd()">添加证书</el-button>
						</el-row>
					</div>
				</template>
			</cl-form>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useForm } from "@cool-vue/crud";
import { Delete } from "@element-plus/icons-vue";

const Form = useForm();

function open() {
	Form.value?.open({
		title: "添加/删除表单项",
		items: [
			{
				label: "昵称",
				prop: "nickname",
				component: {
					name: "el-input"
				},
				required: true
			},
			{
				prop: "cert",
				//【很重要】默认数据格式，以实际业务为主。
				value: [
					{
						label: ""
					}
				],
				component: {
					name: "slot-cert"
				}
			}
		],
		on: {
			submit(data, { close }) {
				close();
			}
		}
	});
}

function rowAdd() {
	Form.value?.form.cert.push({
		label: ""
	});
}

function rowDel(index: number) {
	Form.value?.form.cert.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.cert {
	.row {
		display: flex;
		align-items: center;

		.el-input {
			flex: 1;
			margin-right: 10px;
		}

		.el-icon {
			cursor: pointer;

			&:hover {
				color: red;
			}
		}
	}
}
</style>
