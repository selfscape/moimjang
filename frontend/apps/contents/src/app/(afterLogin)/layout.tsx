import "../globals.css";

import SystemModal from "@ui/components/Modal/SystemModal";
import HeaderRoot from "@ui/components/Header/HeaderRoot";
import RQProvider from "../_components/RQProvider";
import NavigationRoot from "./_components/Navigation/NavigationRoot";
import styles from "./layout.module.css";
import { Suspense } from "react";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={styles.layout}>
        <HeaderRoot />
        <Suspense>
          <RQProvider>{children}</RQProvider>
        </Suspense>
        <NavigationRoot />
        <SystemModal />
      </body>
    </html>
  );
}
