import { BaseService, Service, Permission } from "cl-admin";

@Service("sys/user")
class SysUser extends BaseService {
	@Permission("move")
	move(data) {
		return this.request({
			url: "/move",
			method: "POST",
			data
		});
	}
}

export default SysUser;
