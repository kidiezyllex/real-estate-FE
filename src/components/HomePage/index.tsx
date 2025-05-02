"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  IconHomeCheck, 
  IconHomeSearch, 
  IconHome, 
  IconInfoCircle 
} from '@tabler/icons-react';
import HomeList from './HomeList';
import AvailableHomesList from './AvailableHomesList';
import SearchHomes from './SearchHomes';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="space-y-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-mainTextV1 mb-4">
            Tìm kiếm bất động sản
          </h1>
          <p className="text-secondaryTextV1 max-w-2xl mx-auto">
            Khám phá danh sách các bất động sản chất lượng cao và tìm kiếm ngôi nhà mơ ước của bạn
          </p>
        </div>

        <SearchHomes />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-mainCardV1 border border-lightBorderV1 p-1">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 data-[state=active]:bg-mainTextHoverV1 data-[state=active]:text-white"
              >
                <IconHome className="h-4 w-4" />
                <span>Tất cả căn hộ</span>
              </TabsTrigger>
              <TabsTrigger
                value="available"
                className="flex items-center gap-2 data-[state=active]:bg-mainSuccessV1 data-[state=active]:text-white"
              >
                <IconHomeCheck className="h-4 w-4" />
                <span>Căn hộ khả dụng</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="container mx-auto px-4">
            <TabsContent value="all" className="mt-0">
              <div className="bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-mainTextV1 flex items-center gap-2">
                    <IconHome className="h-5 w-5" />
                    Danh sách tất cả căn hộ
                  </h2>
                </div>
                <HomeList />
              </div>
            </TabsContent>

            <TabsContent value="available" className="mt-0">
              <div className="bg-mainCardV1 p-6 rounded-lg border border-lightBorderV1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-mainTextV1 flex items-center gap-2">
                    <IconHomeCheck className="h-5 w-5 text-mainSuccessV1" />
                    Danh sách căn hộ khả dụng
                  </h2>
                </div>
                <AvailableHomesList />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default HomePage; 