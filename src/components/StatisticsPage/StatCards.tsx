"use client";

import { useGetGeneralStatistics } from "@/hooks/useStatistics";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building, Home, Servicemark, Users } from "tabler-icons-react";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-secondaryTextV1 text-lg font-medium">{title}</h3>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={24} className="text-mainTextV1" style={{ color }} />
          </div>
        </div>
        <p className="text-3xl font-semibold mt-auto" style={{ color }}>
          {value.toLocaleString()}
        </p>
      </Card>
    </motion.div>
  );
};

export default function StatCards() {
  const { data, isLoading, error } = useGetGeneralStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
            <Skeleton className="h-10 w-24 mt-auto" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-mainDangerV1 p-4 bg-red-50 rounded-md">
        Lỗi khi tải dữ liệu thống kê: {error.message}
      </div>
    );
  }

  const stats = [
    {
      title: "Tổng số nhà",
      value: data?.data.totalHomes || 0,
      icon: Home,
      color: "#604AE3",
    },
    {
      title: "Tổng số khách",
      value: data?.data.totalGuests || 0,
      icon: Users,
      color: "#45C5CD",
    },
    {
      title: "Chủ nhà",
      value: data?.data.totalHomeOwners || 0,
      icon: Building,
      color: "#5CC184",
    },
    {
      title: "Dịch vụ",
      value: data?.data.totalServices || 0,
      icon: Servicemark,
      color: "#F0934E",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
} 