import { Metadata } from "next";
import HomeContractCreateForm from "@/components/HomeContractsPage/HomeContractCreateForm";

export const metadata: Metadata = {
  title: "Tạo hợp đồng thuê nhà mới",
  description: "Tạo mới hợp đồng thuê nhà",
};

export default function Page() {
  return <HomeContractCreateForm />;
} 