import { Metadata } from "next";
import HomeContractDetails from "@/components/HomeContractsPage/HomeContractDetails";

export const metadata: Metadata = {
  title: "Chi tiết hợp đồng thuê nhà",
  description: "Xem thông tin chi tiết hợp đồng thuê nhà",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <HomeContractDetails contractId={id} />;
} 