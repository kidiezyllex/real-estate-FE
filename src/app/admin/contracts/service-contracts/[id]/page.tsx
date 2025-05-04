import { Metadata } from "next";
import ServiceContractDetails from "@/components/ServiceContractsPage/ServiceContractDetails";

export const metadata: Metadata = {
  title: "Chi tiết hợp đồng dịch vụ",
  description: "Xem thông tin chi tiết hợp đồng dịch vụ",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <ServiceContractDetails contractId={id} />;
} 