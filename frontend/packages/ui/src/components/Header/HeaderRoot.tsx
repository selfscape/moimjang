"use client";

import React from "react";
import useHeaderStore from "../../store/useHeaderStore";
import Header from "./Header";

export default function HeaderRoot() {
  const { visible, title, onBack, onRefresh } = useHeaderStore();
  if (!visible) return null;

  return <Header title={title!} onBack={onBack} onRefresh={onRefresh} />;
}
