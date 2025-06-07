"use client";

import React, { useCallback, useState } from "react";
import styles from "./Schedule.module.css";
import Schedules from "./Schedule";
import { useRouter } from "next/navigation";
import pathnames from "@/constant/pathnames";

interface Props {
  brandId: string;
}

export default function ScheduleContainer({ brandId }: Props) {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  const handleSelect = useCallback(
    (id: number) => {
      setSelectedSession(id);
    },
    [setSelectedSession]
  );

  const handleRegistButtonClick = (selectedSession: number | null) => {
    if (!selectedSession) return;

    const queryString = new URLSearchParams({
      socialingId: selectedSession.toString(),
    }).toString();

    router.push(`${pathnames.registForm}/${brandId}?${queryString}`);
  };

  return (
    <div className={styles.container}>
      <Schedules
        brandId={brandId}
        selectedSession={selectedSession}
        handleSelect={handleSelect}
      />
      <div
        className={styles.applyButton}
        onClick={() => handleRegistButtonClick(selectedSession)}
      >
        신청하기
      </div>
    </div>
  );
}
