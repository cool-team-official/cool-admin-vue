import { BaseService, Service, Permission } from "/@/core";

@Service("base/sys/department")
class B extends BaseService {
	@Permission("order")
	order(data: any) {
		return this.request({
			url: "/order",
			method: "POST",
			data
		});
	}
}

export default B;
