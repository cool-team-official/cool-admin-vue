import { parse, compileScript } from "@vue/compiler-sfc";
import magicString from "magic-string";

export function createTag(code: string, id: string) {
	if (/\.vue$/.test(id)) {
		let s: any;
		const str = () => s || (s = new magicString(code));
		const { descriptor } = parse(code);

		if (!descriptor.script && descriptor.scriptSetup) {
			const res = compileScript(descriptor, { id });
			const { name, lang }: any = res.attrs;

			str().appendLeft(
				0,
				`<script lang="${lang}">
					import { defineComponent } from 'vue'
					export default defineComponent({
						name: "${name}"
					})
				<\/script>`,
			);

			return {
				map: str().generateMap(),
				code: str().toString(),
			};
		}
	}

	return null;
}
