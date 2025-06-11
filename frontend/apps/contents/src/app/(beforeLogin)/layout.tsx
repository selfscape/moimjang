import { Suspense } from "react";
import "../globals.css";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";

export const metadata = {
  title: "모임장",
  description:
    "호스트가 모임을 쉽게 생성·관리하고, 참가자와 소통할 수 있는 소셜 모임 관리 플랫폼",
  icons: {
    icon: [
      "/favicon/favicon.ico", // 일반 아이콘 (브라우저 탭)
      "/favicon/favicon-96x96.png", // 96x96 크기 파비콘 (필요하다면)
      "/favicon/favicon.svg", // SVG 형태 아이콘
    ],
    shortcut: "/favicon/favicon.ico", // shortcut icon (탭 바로가기 등)
    apple: "/favicon/favicon-96x96.png", // iOS 홈 스크린 아이콘으로 96×96 사용
    other: [
      { rel: "manifest", url: "/favicon/manifest.json" },
      {
        rel: "mask-icon",
        url: "/favicon/favicon-96x96.png",
        color: "#ffffff",
      },
    ],
  },
};
export const viewport = {
  themeColor: "#ffffff",
};

import SystemModal from "@ui/components/Modal/SystemModal";
import RQProvider from "@ui/components/Provider/RQProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Suspense fallback={<LoadingSpinner />}>
          <RQProvider>{children}</RQProvider>
          <SystemModal />
        </Suspense>
      </body>
    </html>
  );
}
