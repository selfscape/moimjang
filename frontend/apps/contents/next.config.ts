// apps/seller/next.config.ts
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.chanyoung.site"], // ← 여기에 허용할 외부 이미지 도메인 추가
  },

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
      "@mocks": path.resolve(__dirname, "../../packages/mocks"),
      "@constants": path.resolve(__dirname, "../../packages/constants"),
      "@model": path.resolve(__dirname, "../../packages/model"),
    };

    return config;
  },
};

export default nextConfig;
