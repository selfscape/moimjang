"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OwnerCookieSetter() {
  const searchParams = useSearchParams();
  const hostParam = searchParams.get("host") ?? "";

  useEffect(() => {
    if (hostParam) {
      document.cookie = `owner=${hostParam}; path=/; max-age=${60 * 60 * 24}`;
    }
  }, [hostParam]);

  return <></>;
}
