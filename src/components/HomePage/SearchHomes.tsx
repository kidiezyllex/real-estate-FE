"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSearch, IconHome, IconInfoCircle, IconX } from '@tabler/icons-react';
import { useSearchHomes } from '@/hooks/useHome';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';

const SearchHomes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data, isLoading, error } = useSearchHomes({ q: debouncedQuery });
  const searchResults = data?.data || [];
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      setIsResultsVisible(true);
    }
  }, [debouncedQuery, data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setIsResultsVisible(false);
  };

  const closeResults = () => {
    setIsResultsVisible(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Tìm kiếm căn hộ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-24 pl-10 h-12 w-full"
          />
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mainTextV1 h-5 w-5" />
          
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 text-mainTextV1 hover:text-mainTextHoverV1"
            >
              <IconX className="h-5 w-5" />
            </button>
          )}
          
          <Button 
            type="submit"
            className="absolute right-0 top-0 h-12 bg-mainTextHoverV1 hover:bg-mainTextHoverV1/90"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {isResultsVisible && debouncedQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white border border-lightBorderV1 rounded-sm shadow-md max-h-[400px] overflow-y-auto"
          >
            <div className="sticky top-0 flex justify-between items-center p-4 bg-mainBackgroundV1 border-b border-lightBorderV1">
              <h3 className="font-medium text-mainTextV1">Kết quả tìm kiếm</h3>
              <button 
                onClick={closeResults} 
                className="text-mainTextV1 hover:text-mainTextHoverV1"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-sm" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-mainDangerV1">
                <IconInfoCircle className="inline-block mr-2 h-5 w-5" />
                Đã xảy ra lỗi khi tìm kiếm
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-mainTextV1">
                Không tìm thấy kết quả nào cho "{debouncedQuery}"
              </div>
            ) : (
              <div>
                {searchResults.map((home) => (
                  <Link 
                    href={`/homes/${home._id}`} 
                    key={home._id}
                    onClick={closeResults}
                  >
                    <div className="flex items-center gap-4 p-4 hover:bg-mainBackgroundV1 transition-colors border-b border-lightBorderV1 last:border-b-0">
                      <div className="h-16 w-16 bg-gray-200 rounded-sm flex items-center justify-center text-mainTextV1">
                        <IconHome className="h-8 w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-mainTextV1 truncate">{home.name}</h4>
                        <p className="text-secondaryTextV1 text-sm truncate">{home.address}</p>
                        <p className="text-mainTextHoverV1 font-semibold">{formatCurrency(home.price)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchHomes; 