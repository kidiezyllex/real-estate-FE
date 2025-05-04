import { Metadata } from "next";
import ServiceContractUpdateForm from "@/components/ServiceContractsPage/ServiceContractUpdateForm";

export const metadata: Metadata = {
  title: "Cập nhật hợp đồng dịch vụ",
  description: "Cập nhật thông tin hợp đồng dịch vụ",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <ServiceContractUpdateForm contractId={id} />;
} 