import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IHome, IHomeSearchResult } from '@/interface/response/home';
import { formatCurrency } from '@/utils/format';

interface HomeDetailsDialogProps {
  home: IHome | IHomeSearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

const HomeDetailsDialog = ({ home, isOpen, onClose }: HomeDetailsDialogProps) => {
  if (!home) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="large">
        <DialogHeader>
          <DialogTitle>Chi tiết căn hộ</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-mainTextV1">
              {home.building} - {home.apartmentNv}
            </h3>
            <p className="text-mainTextV1 font-semibold text-lg mt-2">
              {formatCurrency((home as any).price)}
            </p>
            <p className="text-mainTextV1 text-sm">
              {home.address}, {home.ward}, {home.district}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-mainBackgroundV1 rounded-sm">
              <p className="font-medium">{(home as any).area ? `${(home as any).area} m²` : '--'}</p>
              <p className="text-xs">Diện tích</p>
            </div>
            <div className="text-center p-3 bg-mainBackgroundV1 rounded-sm">
              <p className="font-medium">{(home as any).bedroom ?? '--'}</p>
              <p className="text-xs">Phòng ngủ</p>
            </div>
            <div className="text-center p-3 bg-mainBackgroundV1 rounded-sm">
              <p className="font-medium">{(home as any).toilet ?? '--'}</p>
              <p className="text-xs">Phòng tắm</p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="font-semibold">Chủ nhà: </span>
              {home.homeOwnerId?.fullname} ({home.homeOwnerId?.phone})
            </div>
            {home.note && (
              <div>
                <span className="font-semibold">Ghi chú: </span>
                {home.note}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HomeDetailsDialog; 