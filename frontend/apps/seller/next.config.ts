// apps/seller/next.config.ts
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // …기존 옵션들…

  images: {
    domains: ["cdn.chanyoung.site"],
  },

  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),

      // 기존 "@/…" alias
      "@": path.resolve(__dirname, "src"),

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
