"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import DeleteHomeDialog from './DeleteHomeDialog';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface HomeActionButtonsProps {
  homeId: string;
  homeName: string;
  userId?: string;
  homeOwnerId?: string;
  isAdmin?: boolean;
}

const HomeActionButtons = ({ 
  homeId, 
  homeName, 
  userId, 
  homeOwnerId, 
  isAdmin = false 
}: HomeActionButtonsProps) => {
  // Kiểm tra nếu người dùng là chủ sở hữu hoặc là admin
  const canManage = isAdmin || (userId && homeOwnerId && userId === homeOwnerId);

  if (!canManage) return null;

  return (
    <motion.div 
      className="flex flex-wrap gap-4 mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/homes/${homeId}/edit`}>
        <Button 
          variant="outline" 
          className="bg-mainWarningV1 text-white hover:bg-mainWarningHoverV1 border-none"
        >
          <IconEdit className="h-4 w-4 mr-2" />
          Sửa thông tin
        </Button>
      </Link>
      
      <DeleteHomeDialog 
        homeId={homeId} 
        homeName={homeName}
        trigger={
          <Button 
            variant="outline" 
            className="bg-mainDangerV1 text-white hover:bg-mainDangerHoverV1 border-none"
          >
            <IconTrash className="h-4 w-4 mr-2" />
            Xóa căn hộ
          </Button>
        }
      />
    </motion.div>
  );
};

export default HomeActionButtons; 