"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";  
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconLoader2, IconTrash } from "@tabler/icons-react";

interface GuestDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const GuestDeleteDialog = ({ isOpen, isDeleting, onClose, onConfirm }: GuestDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-mainDangerV1">
            <IconAlertTriangle className="h-5 w-5 mr-2" />
            Xác nhận xóa khách hàng
          </DialogTitle>
          <DialogDescription className="text-secondaryTextV1 pt-2">
            Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-mainBackgroundV1 p-4 my-4 rounded-sm border border-mainDangerV1/20">
          <p className="text-mainTextV1 text-sm">
            Khi xóa khách hàng, tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
          </p>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting} className="text-secondaryTextV1">
              Hủy
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={onConfirm}
            className="bg-mainDangerV1 hover:bg-mainDangerHoverV1 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <IconTrash className="mr-2 h-4 w-4" />
                Xóa
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 