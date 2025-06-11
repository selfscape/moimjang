import { OWNER } from "configs";
import { useState, useEffect } from "react";

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

export default function useOwnerCookie() {
  const [owner, setOwner] = useState<string | null>(null);

  useEffect(() => {
    const value = getCookie(OWNER);
    setOwner(value);
  }, []);

  return owner;
}
