"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface GuestDeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const GuestDeleteDialog = ({ isOpen, isDeleting, onClose, onConfirm }: GuestDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-mainTextV1 flex items-center">
            <IconAlertTriangle className="h-6 w-6 text-mainWarningV1 mr-2" />
            Xác nhận xóa
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <p className="text-secondaryTextV1">
            Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể hoàn tác.
          </p>
        </div>
        
        <DialogFooter className="p-6 pt-2">
          <div className="flex justify-end gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="border-lightBorderV1 text-secondaryTextV1"
            >
              Hủy
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="bg-mainDangerV1 hover:bg-mainDangerHoverV1 text-white"
              >
                {isDeleting ? (
                  <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Xóa
              </Button>
            </motion.div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 