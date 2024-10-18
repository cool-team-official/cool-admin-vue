/**
 * 角色权限控制
 * @param role
 * @returns
 */
export function setRole(role?: string): ClForm.Plugin {
	return ({ exposed }) => {
		function deep(arr: ClForm.Item[]) {
			arr.forEach(e => {
				if (e.role) {
					e.hidden = e.role != role;
				}

				deep(e.children || []);
			});
		}

		deep(exposed.config.items);
	};
}
