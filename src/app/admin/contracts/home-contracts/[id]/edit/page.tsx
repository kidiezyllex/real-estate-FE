import { Metadata } from "next";
import HomeContractUpdateForm from "@/components/HomeContractsPage/HomeContractUpdateForm";

export const metadata: Metadata = {
  title: "Cập nhật hợp đồng thuê nhà",
  description: "Cập nhật thông tin hợp đồng thuê nhà",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <HomeContractUpdateForm contractId={id} />;
} 