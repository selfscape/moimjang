// apps/seller/next.config.ts
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // …기존 옵션들…

  webpack(config) {
    // resolve 혹은 alias 가 undefined 일 수 있으니 안전하게 초기화
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),

      // 기존 "@/…" alias
      "@": path.resolve(__dirname, "src"),

      // monorepo 패키지 alias
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@util": path.resolve(__dirname, "../../packages/util"),
    };

    return config;
  },
};

export default nextConfig;
