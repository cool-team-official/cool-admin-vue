import { getCurrentInstance, nextTick } from "vue";

export function useDialog({ props, isFullscreen }: any) {
	const ctx = getCurrentInstance();

	// 设置对话框样式、拖动
	const setDialog = () => {
		const { top = "15vh" } = props.props;

		nextTick(() => {
			// 获取元素
			const dlg: any = document.querySelector(`.cl-dialog--${ctx?.uid}`);
			const hdr: any = dlg ? dlg.querySelector(".el-dialog__header") : null;

			// 设置对话框
			if (dlg) {
				dlg.style.left = 0;

				if (isFullscreen.value) {
					dlg.style.top = 0;
					dlg.style.marginBottom = 0;
				} else {
					dlg.style.marginBottom = "160px";
					dlg.style.top = top;
				}

				// 设置光标
				hdr.style.cursor = isFullscreen.value ? "text" : "move";
			}

			// 设置头部
			if (hdr) {
				hdr.onmousedown = (e: any) => {
					// 可视区域大小
					const { clientWidth, clientHeight } = document.documentElement || document.body;

					// Try drag
					const isDrag = (() => {
						if (isFullscreen.value) {
							return false;
						}

						// 是否能拖动
						if (!props.drag) {
							return false;
						}

						// Determine height of the box is too large
						let marginTop = 0;

						if (["vh", "%"].some(e => top.includes(e))) {
							marginTop = clientHeight * (parseInt(top) / 100);
						}

						if (top.includes("px")) {
							marginTop = top;
						}

						return dlg.clientHeight < clientHeight - marginTop;
					})();

					// 设置指针状态
					if (!isDrag) {
						return (hdr.style.cursor = "text");
					} else {
						hdr.style.cursor = "move";
					}

					// Distance
					const dis = {
						left: e.clientX - hdr.offsetLeft,
						top: e.clientY - hdr.offsetTop
					};

					// Calc left and top of the box
					const box = (() => {
						const { left, top } =
							dlg.currentStyle || window.getComputedStyle(dlg, null);

						if (left.includes("%")) {
							return {
								top: +clientHeight * (+top.replace(/%/g, "") / 100),
								left: +clientWidth * (+left.replace(/%/g, "") / 100)
							};
						} else {
							return {
								top: +top.replace(/\px/g, ""),
								left: +left.replace(/\px/g, "")
							};
						}
					})();

					// Screen limit
					const pad = 5;
					const minLeft = -(clientWidth - dlg.clientWidth) / 2 + pad;
					const maxLeft =
						(dlg.clientWidth >= clientWidth / 2
							? dlg.clientWidth / 2 - (dlg.clientWidth - clientWidth / 2)
							: dlg.clientWidth / 2 + clientWidth / 2 - dlg.clientWidth) - pad;

					const minTop = pad;
					const maxTop = clientHeight - dlg.clientHeight - pad;

					// Start move
					document.onmousemove = function(e) {
						let left = e.clientX - dis.left + box.left;
						let top = e.clientY - dis.top + box.top;

						if (left < minLeft) {
							left = minLeft;
						} else if (left >= maxLeft) {
							left = maxLeft;
						}

						if (top < minTop) {
							top = minTop;
						} else if (top >= maxTop) {
							top = maxTop;
						}

						// Set dialog top and left
						dlg.style.top = top + "px";
						dlg.style.left = left + "px";
					};

					// Clear event
					document.onmouseup = function() {
						document.onmousemove = null;
						document.onmouseup = null;
					};
				};
			}
		});
	};

	return {
		setDialog
	};
}
