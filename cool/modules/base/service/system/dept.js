import { BaseService, Service, Permission } from "cl-admin";

@Service("base/sys/department")
class SysDepartment extends BaseService {
	@Permission("order")
	order(data) {
		return this.request({
			url: "/order",
			method: "POST",
			data
		});
	}
}

export default SysDepartment;
