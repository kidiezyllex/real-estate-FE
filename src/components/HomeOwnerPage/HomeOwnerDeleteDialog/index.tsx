"use client";

import { Button } from "@/components/ui/button";
import { IconLoader2 } from "@tabler/icons-react";

interface HomeOwnerDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const HomeOwnerDeleteDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: HomeOwnerDeleteDialogProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-medium mb-4">Xác nhận xóa</h3>
        <p className="mb-6">Bạn có chắc chắn muốn xóa chủ nhà này không? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-lightBorderV1 text-mainTextV1"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-mainDangerV1 hover:bg-mainDanger/90 text-white"
          >
            {isDeleting ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : "Xóa"}
          </Button>
        </div>
      </div>
    </div>
  );
}; 