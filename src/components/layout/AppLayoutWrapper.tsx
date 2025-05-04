"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import { CustomScrollArea } from "@/components/ui/custom-scroll-area";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.includes("/login");

  return isLoginPage ? (
    <CustomScrollArea className="h-full">{children}</CustomScrollArea>
  ) : (
    <DashboardLayout>
      <CustomScrollArea className="h-full">{children}</CustomScrollArea>
    </DashboardLayout>
  );
} 