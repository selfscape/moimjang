"use client";

import React from "react";
import Navigation from "./Navigation";
import useNavigationStore from "@/app/_store/useNavigationStore";

export default function NavigationRoot() {
  const visible = useNavigationStore((config) => config.visible);

  if (visible) return <Navigation />;
}
