"use client";

import { useGetPaymentStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function PaymentStats() {
  const { data, isLoading, error } = useGetPaymentStatistics();

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
          Lỗi khi tải dữ liệu về thanh toán: {error.message}
        </div>
      </Card>
    );
  }

  const paymentData = data?.data?.statistics;
  
  if (!paymentData) {
    return null;
  }

  const chartData = [
    {
      name: "Đúng hạn",
      value: paymentData.paidOnTime,
      color: "#5CC184",
      fill: "#5CC184"
    },
    {
      name: "Trễ hạn",
      value: paymentData.paidLate,
      color: "#F0934E",
      fill: "#F0934E"
    },
    {
      name: "Chưa thanh toán",
      value: paymentData.unpaid,
      color: "#E66666",
      fill: "#E66666"
    }
  ];

  const chartConfig: ChartConfig = {
    "Đúng hạn": {
      label: "Đúng hạn",
      color: "#5CC184",
    },
    "Trễ hạn": {
      label: "Trễ hạn",
      color: "#F0934E",
    },
    "Chưa thanh toán": {
      label: "Chưa thanh toán",
      color: "#E66666",
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-mainTextV1">Thống kê thanh toán</h3>
        <p className="text-secondaryTextV1">
          Tổng số: <span className="font-semibold text-primary">{paymentData.totalPayments}</span> thanh toán
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px] w-full"
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E5E5" />
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: '#687D92' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{ fill: '#687D92' }}
                width={120}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent 
                    labelFormatter={(label) => `${label}`}
                  />
                }
              />
              <Bar 
                dataKey="value" 
                barSize={40} 
                radius={[0, 4, 4, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between bg-white p-3 rounded-md border border-lightBorderV1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-medium text-secondaryTextV1">{item.name}</span>
            </div>
            <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
} 