"use client";
import HomeOwnerEditForm from "@/components/HomeOwnerPage/HomeOwnerEditForm";
import { useParams } from "next/navigation";

export default function page() {
    const params = useParams();
    const id = params?.id as string;
    return <HomeOwnerEditForm homeOwnerId={id} />;
}

