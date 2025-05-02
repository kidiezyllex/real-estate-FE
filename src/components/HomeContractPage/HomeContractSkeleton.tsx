import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const HomeContractTableSkeleton: React.FC = () => {
  return (
    <div className="rounded-md border border-lightBorderV1 bg-mainCardV1 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-mainBackgroundV1 hover:bg-mainBackgroundV1">
            <TableHead className="text-secondaryTextV1 font-medium">Mã hợp đồng</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Khách hàng</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Căn hộ</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Tiền thuê</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Kỳ thanh toán</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Thời hạn</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Ngày bắt đầu</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium">Trạng thái</TableHead>
            <TableHead className="text-secondaryTextV1 font-medium text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="border-b border-lightBorderV1">
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const HomeContractDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Card className="border-lightBorderV1 bg-mainCardV1">
        <CardHeader className="border-b border-lightBorderV1 pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="bg-mainBackgroundV1 rounded-md p-4 space-y-4">
                  {Array.from({ length: sectionIndex === 0 ? 7 : sectionIndex === 1 ? 8 : 3 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-3 py-3">
                      <div className="col-span-1">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="col-span-2">
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
                {sectionIndex < 2 && <Skeleton className="h-px w-full" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const HomeContractFormSkeleton: React.FC = () => {
  return (
    <Card className="bg-mainCardV1 border-lightBorderV1">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 