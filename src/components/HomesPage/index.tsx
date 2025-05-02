"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconHome, 
  IconPlus, 
  IconFilter, 
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconX
} from '@tabler/icons-react';
import { useGetHomes } from '@/hooks/useHome';
import HomeList from '../HomePage/HomeList';
import SearchHomes from '../HomePage/SearchHomes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const HomesPage = () => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };
  
  const resetFilters = () => {
    setPriceRange('all');
    setSortBy('newest');
    setSortDirection('desc');
  };

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Bất động sản</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center">
              <IconHome className="h-6 w-6 text-mainTextV1 mr-2" />
              <h1 className="text-xl font-semibold text-mainTextV1">Danh sách bất động sản</h1>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={toggleFilters}
              >
                <IconFilter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
              
              <Link href="/homes/create">
                <Button className="bg-mainSuccessV1 hover:bg-mainSuccessHoverV1">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Thêm căn hộ
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mb-6">
            <SearchHomes />
          </div>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isFiltersVisible ? 'auto' : 0,
              opacity: isFiltersVisible ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {isFiltersVisible && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-mainBackgroundV1 rounded-lg mb-6 border border-lightBorderV1">
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Khoảng giá</label>
                  <Select 
                    value={priceRange} 
                    onValueChange={setPriceRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="1000000-5000000">1 - 5 triệu VNĐ</SelectItem>
                      <SelectItem value="5000000-10000000">5 - 10 triệu VNĐ</SelectItem>
                      <SelectItem value="10000000-20000000">10 - 20 triệu VNĐ</SelectItem>
                      <SelectItem value="20000000+">Trên 20 triệu VNĐ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Sắp xếp theo</label>
                  <Select 
                    value={sortBy} 
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="price">Giá thuê</SelectItem>
                      <SelectItem value="area">Diện tích</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-mainTextV1 mb-2 block">Thứ tự</label>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortDirection === 'asc' ? (
                      <>
                        <span>Tăng dần</span>
                        <IconSortAscending className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Giảm dần</span>
                        <IconSortDescending className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="md:col-span-3 flex justify-end mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={resetFilters}
                  >
                    <IconX className="h-4 w-4 mr-2" />
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
          
          <HomeList />
        </div>
      </motion.div>
    </div>
  );
};

export default HomesPage; 