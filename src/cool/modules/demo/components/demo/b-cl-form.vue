<template>
	<div class="scope">
		<div class="h">
			<span>cl-form</span>
			自定义表单
		</div>

		<div class="c">
			<el-button size="small" @click="openForm">填写邀请码</el-button>
		</div>

		<div class="f">
			<span class="date">2019/10/11</span>
		</div>

		<cl-form ref="form"></cl-form>
	</div>
</template>

<script>
export default {
	methods: {
		openForm() {
			this.$refs.form.open({
				title: "填写邀请码",
				width: "450px",
				dialog: {
					controls: ["close"]
				},
				items: [
					{
						props: {
							labelWidth: "0px"
						},

						component: (
							<div>
								<i></i>
								<span>如无邀请码，请联系客服：icssoa</span>
							</div>
						)
					},
					{
						props: {
							labelWidth: "0px"
						},
						prop: "code",
						component: {
							name: "login-invite-code",

							data() {
								return {
									list: ["", "", "", ""]
								};
							},

							methods: {
								onInput(i) {
									if (this.list[i] && i <= 4 - i) {
										this.$refs[`input-${i + 1}`].focus();
									}

									this.$emit("input", this.list.join(""));
								},

								nativeOnInput(e, i) {
									if (e.code == "Backspace") {
										if (!this.list[i]) {
											if (i - 1 >= 0) {
												this.$refs[`input-${i - 1}`].focus();
											}
										}
									}

									this.$emit("input", this.list.join(""));
								}
							},

							mounted() {
								this.$refs[`input-0`].focus();
							},

							render() {
								return (
									<div class="invite-code">
										{this.list.map((e, i) => {
											return (
												<el-input
													maxlength="1"
													ref={`input-${i}`}
													{...{
														on: {
															input: () => {
																this.onInput(i);
															}
														},
														nativeOn: {
															keydown: e => {
																this.nativeOnInput(e, i);
															}
														}
													}}
													v-model={this.list[i]}></el-input>
											);
										})}
									</div>
								);
							}
						}
					}
				],

				on: {
					submit: (data, done) => {
						this.$message.success(data.code);
						done();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.invite-code {
	display: flex;

	.el-input {
		flex: 1;
		margin: 0 15px;

		input {
			border: 0;
			border-radius: 0;
			border-bottom: 1px solid #000;
			text-align: center;
			font-size: 18px;
		}
	}
}
</style>
