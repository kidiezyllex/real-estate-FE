import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiHomeCity,
	mdiAccountGroup,
	mdiAccount,
	mdiAccountTie,
	mdiAccountArrowRight,
	mdiFileDocument,
	mdiFileDocumentEdit,
	mdiCashMultiple,
	mdiCog,
	mdiRoomServiceOutline
} from "@mdi/js";

export const getDashboardMenuItems = (): MenuItem[] => [
	{
		id: "statistic",
		name: "Thống kê",
		path: "/admin",
		icon: mdiViewDashboard,
	},
	{
		id: "homes-management",
		name: "Quản lý Căn hộ",
		path: "/admin/homes",
		icon: mdiHomeCity,
	},
	{
		id: "user-management",
		name: "Quản lý người dùng",
		path: "/admin/users",
		icon: mdiAccountGroup,
		subMenu: [
			{
				id: "customer",
				name: "Khách hàng",
				path: "/admin/users/guests",
				icon: mdiAccount,
			},
			{
				id: "owner",
				name: "Chủ nhà",
				path: "/admin/users/home-owners",
				icon: mdiAccountTie,
			},
			{
				id: "receiver",
				name: "Người nhận",
				path: "/admin/users/receivers",
				icon: mdiAccountArrowRight,
			},
		],
	},
	{
		id: "contract-management",
		name: "Quản lý Hợp đồng",
		path: "/admin/contracts/home-contracts",
		icon: mdiFileDocumentEdit,
	},
	{
		id: "service-management",
		name: "Quản lý Dịch vụ",
		path: "/admin/services",
		icon: mdiRoomServiceOutline,
	},
];
