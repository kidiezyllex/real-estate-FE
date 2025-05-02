import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IconSearch, IconX } from '@tabler/icons-react';

interface HomeContractSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const HomeContractSearch: React.FC<HomeContractSearchProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <Card className="border-lightBorderV1 bg-mainCardV1">
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="flex items-center gap-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-mainTextV1" size={20} />
            <Input
              type="text"
              placeholder="Tìm kiếm hợp đồng theo tên khách hàng, tên căn hộ, mã hợp đồng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 border-lightBorderV1 bg-mainBackgroundV1 text-secondaryTextV1"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-mainTextV1 hover:text-mainTextHoverV1"
                onClick={handleClear}
              >
                <IconX size={16} />
              </Button>
            )}
          </div>
          <Button
            type="submit"
            className="bg-mainTextHoverV1 hover:bg-purple-600 text-white"
          >
            Tìm kiếm
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HomeContractSearch; 