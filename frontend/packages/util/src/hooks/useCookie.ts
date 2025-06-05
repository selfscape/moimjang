"use client";

import { useState, useEffect } from "react";

export default function useCookie(name: string): string {
  const [value, setValue] = useState("");

  useEffect(() => {
    const all = document.cookie;
    const m = all.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
    setValue(m ? decodeURIComponent(m[1]) : "");
  }, [name]);

  return value;
}
