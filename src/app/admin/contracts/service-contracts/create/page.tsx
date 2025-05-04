import { Metadata } from "next";
import ServiceContractCreateForm from "@/components/ServiceContractsPage/ServiceContractCreateForm";

export const metadata: Metadata = {
  title: "Tạo hợp đồng dịch vụ mới",
  description: "Tạo mới hợp đồng dịch vụ",
};

export default function Page() {
  return <ServiceContractCreateForm />;
} 