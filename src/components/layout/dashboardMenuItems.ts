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
		path: "/statistic",
		icon: mdiViewDashboard,
	},
	{
		id: "apartment-management",
		name: "Quản lý Căn hộ",
		path: "/apartments",
		icon: mdiHomeCity,
	},
	{
		id: "user-management",
		name: "Quản lý người dùng",
		path: "/users",
		icon: mdiAccountGroup,
		subMenu: [
			{
				id: "customer",
				name: "Khách hàng",
				path: "/users/customers",
				icon: mdiAccount,
			},
			{
				id: "owner",
				name: "Chủ nhà",
				path: "/users/owners",
				icon: mdiAccountTie,
			},
			{
				id: "receiver",
				name: "Người nhận",
				path: "/users/receivers",
				icon: mdiAccountArrowRight,
			},
		],
	},
	{
		id: "contract-management",
		name: "Quản lý Hợp đồng",
		path: "/contracts",
		icon: mdiFileDocument,
		subMenu: [
			{
				id: "home-contract",
				name: "Hợp đồng căn hộ",
				path: "/admin/contracts/home",
				icon: mdiFileDocument,
			},
			{
				id: "service-contract",
				name: "Hợp đồng dịch vụ",
				path: "/admin/contracts/service",
				icon: mdiFileDocumentEdit,
			},
		],
	},
	{
		id: "payment-management",
		name: "Quản lý Thanh toán",
		path: "/payments",
		icon: mdiCashMultiple,
	},
	{
		id: "service-management",
		name: "Quản lý Dịch vụ",
		path: "/services",
		icon: mdiRoomServiceOutline,
	},
	{
		id: "system",
		name: "Hệ thống",
		path: "/system",
		icon: mdiCog,
	},
];
