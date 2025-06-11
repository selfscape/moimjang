"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import pathnames from "../_constant/pathnames";

export default function RequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.replace(pathnames.login);
    }
  }, [router]);

  return null;
}
