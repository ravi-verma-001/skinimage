'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface URLQuerySyncProps {
  onSync: (filters: { skinType: string; search: string; sort: string }) => void;
}

export default function URLQuerySync({ onSync }: URLQuerySyncProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      router.replace(`/shop/${categoryParam.toLowerCase()}/`);
      return;
    }

    onSync({
      skinType: searchParams.get('skinType') || '',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || '',
    });
  }, [searchParams, onSync, router]);

  return null;
}
