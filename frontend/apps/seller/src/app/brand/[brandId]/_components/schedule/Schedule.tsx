"use client";

import React, { memo, useMemo } from "react";
import styles from "./Schedule.module.css";
import useGetLandingChannels from "../../_api/useGetLandingChannels";
import { ChannelState } from "@model/channel";
import getSchedulesByMonth from "../../_util/getSchedulesByMonth";
import ErrorBox from "@ui/components/Error/ErrorBox";
import LoadingSpinner from "@ui/components/Spinner/FadeLoader";

interface Props {
  brandId: string;
  selectedSession: number | null;
  handleSelect: (id: number) => void;
}

const Schedules: React.FC<Props> = ({
  brandId,
  selectedSession,
  handleSelect,
}: Props) => {
  const { data, isError, isLoading } = useGetLandingChannels({
    brand_id: brandId,
    state: ChannelState.ONGOING,
    sort_by: "id",
    descending: true,
  });
  const schedulesByMonth = useMemo(() => {
    if (!data) return {};
    return getSchedulesByMonth(data.channels);
  }, [data]);

  if (isError) return <ErrorBox />;
  if (isLoading) return <LoadingSpinner />;

  return Object.entries(schedulesByMonth).map(([month, schedules]) => (
    <div key={month} className={styles.scheduleWrapper}>
      <h2 className={styles.scheduleTitle}>{month}월</h2>
      <div className={styles.scheduleList}>
        {schedules.map((item) => {
          const isSelected = item.id === selectedSession;
          return (
            <label
              key={item.id}
              className={`${styles.scheduleItem} ${
                isSelected ? styles.selected : ""
              }`}
              onClick={() => handleSelect(item.id)}
            >
              <input
                type="radio"
                name="schedule"
                value={item.id}
                checked={isSelected}
                onChange={() => handleSelect(item.id)}
                className={styles.radioButton}
              />
              <div className={styles.dateInfo}>
                <span className={styles.day}>{item.day}</span>
                <span className={styles.dateText}>{item.date}</span>
              </div>
              <span className={styles.timeInfo}>{item.time}</span>
            </label>
          );
        })}
      </div>
    </div>
  ));
};

export default memo(Schedules);
