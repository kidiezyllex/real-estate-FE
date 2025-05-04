"use client";

import { useGetContractStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ClipboardCheck, ClipboardX, Home, Tool } from "tabler-icons-react";

export default function ContractStats() {
  const { data, isLoading, error } = useGetContractStatistics();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
          Lỗi khi tải dữ liệu về hợp đồng: {error.message}
        </div>
      </Card>
    );
  }

  const contractData = data?.data;
  
  if (!contractData) {
    return null;
  }

  // Biểu đồ loại hợp đồng
  const contractTypeData = [
    {
      name: "Hợp đồng nhà",
      value: contractData.homeContracts,
      color: "#604AE3"
    },
    {
      name: "Hợp đồng dịch vụ",
      value: contractData.serviceContracts,
      color: "#45C5CD"
    }
  ];

  // Biểu đồ tình trạng hợp đồng
  const contractStatusData = [
    {
      name: "Đang hoạt động",
      value: contractData.activeContracts,
      color: "#5CC184"
    },
    {
      name: "Đã hết hạn",
      value: contractData.expiredContracts,
      color: "#F0934E"
    }
  ];

  const typeChartConfig: ChartConfig = {
    "Hợp đồng nhà": {
      label: "Hợp đồng nhà",
      color: "#604AE3",
      icon: Home
    },
    "Hợp đồng dịch vụ": {
      label: "Hợp đồng dịch vụ",
      color: "#45C5CD",
      icon: Tool
    }
  };

  const statusChartConfig: ChartConfig = {
    "Đang hoạt động": {
      label: "Đang hoạt động",
      color: "#5CC184",
      icon: ClipboardCheck
    },
    "Đã hết hạn": {
      label: "Đã hết hạn",
      color: "#F0934E",
      icon: ClipboardX
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="font-medium text-[12px]"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-mainTextV1">Thống kê hợp đồng</h3>
        <p className="text-secondaryTextV1">
          Tổng số: <span className="font-semibold text-primary">{contractData.totalContracts}</span> hợp đồng
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] w-full"
      >
        <div className="h-full">
          <h4 className="text-md font-medium text-center mb-2 text-secondaryTextV1">Loại hợp đồng</h4>
          <ChartContainer config={typeChartConfig} className="h-[calc(100%-30px)] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contractTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contractTypeData.map((entry, index) => (
                    <Cell key={`cell-type-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartLegend 
                  content={
                    <ChartLegendContent 
                      itemType="circle" 
                    />
                  } 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="h-full">
          <h4 className="text-md font-medium text-center mb-2 text-secondaryTextV1">Tình trạng hợp đồng</h4>
          <ChartContainer config={statusChartConfig} className="h-[calc(100%-30px)] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contractStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contractStatusData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartLegend 
                  content={
                    <ChartLegendContent 
                      itemType="circle" 
                    />
                  } 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </motion.div>
    </Card>
  );
} 