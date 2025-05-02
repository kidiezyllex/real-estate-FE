import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import HomeDetails from '@/components/HomesPage/HomeDetails';
import HomeActionButtons from '@/components/HomesPage/HomeActionButtons';

export default function AdminHomeDetailPage() {
  const params = useParams();
  const homeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!homeId) return null;

  return (
    <div className="container mx-auto py-8">
      <HomeDetails homeId={homeId} />
      <div className="mt-8">
        <HomeActionButtons homeId={homeId} homeName="" isAdmin />
      </div>
    </div>
  );
} 