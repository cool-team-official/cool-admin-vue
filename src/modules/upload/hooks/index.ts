import { inject } from "vue";
import { Upload } from "../types";

export function useSpace() {
	const space = inject("upload-space") as Upload.Space;

	return { space };
}
