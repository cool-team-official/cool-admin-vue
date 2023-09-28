import { useConfig, useCore } from "../../hooks";
import { defineComponent } from "vue";
import { Search } from "@element-plus/icons-vue";

export default defineComponent({
	name: "cl-adv-btn",

	components: {
		Search
	},

	setup(_, { slots }) {
		const { crud, mitt } = useCore();
		const { style } = useConfig();

		function open() {
			mitt.emit("crud.openAdvSearch");
		}

		return () => {
			return (
				<el-button size={style.size} onClick={open} class="cl-adv-btn">
					<el-icon>
						<Search />
					</el-icon>
					{slots.default?.() || crud.dict.label.advSearch}
				</el-button>
			);
		};
	}
});
