'use client';

import { useSearchParams } from 'next/navigation';

export default function TasksPageClient() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  return <div>{page}</div>;
}
