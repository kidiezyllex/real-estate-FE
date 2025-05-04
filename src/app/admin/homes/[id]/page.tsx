"use client";
import HomeDetails from '@/components/HomesPage/HomeDetails';
import { useParams } from 'next/navigation';

export default function AdminHomeDetailPage() {
  const params = useParams();
  const homeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!homeId) return null;

  return (
    <div className="container mx-auto">
      <HomeDetails homeId={homeId} />
    </div>
  );
} 