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
		path: "/admin/contracts",
		icon: mdiFileDocument,
		subMenu: [
			{
				id: "home-contracts",
				name: "Hợp đồng căn hộ",
				path: "/admin/contracts/home-contracts",
				icon: mdiFileDocument,
			},
			{
				id: "service-contracts",
				name: "Hợp đồng dịch vụ",
				path: "/admin/contracts/service-contracts",
				icon: mdiFileDocumentEdit,
			},
		],
	},
	{
		id: "payment-management",
		name: "Quản lý Thanh toán",
		path: "/admin/invoice-payments",
		icon: mdiCashMultiple,
	},
	{
		id: "service-management",
		name: "Quản lý Dịch vụ",
		path: "/admin/services",
		icon: mdiRoomServiceOutline,
	},
	{
		id: "system",
		name: "Hệ thống",
		path: "/admin/system",
		icon: mdiCog,
	},
];
