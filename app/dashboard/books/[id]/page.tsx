"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  useEffect(() => {
    if (id) {
      // Redirect to search-param format to avoid remount and dialog flicker
      router.replace(`/dashboard/books?book=${id}`, { scroll: false });
    }
  }, [id, router]);

  return null;
}

