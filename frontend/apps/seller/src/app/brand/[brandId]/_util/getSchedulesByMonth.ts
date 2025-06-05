import { Channel } from "@model/channel";

export interface ScheduleEntry {
  id: number;
  month: string;
  date: string;
  day: string;
  time: string;
}

export type SchedulesByMonth = Record<string, ScheduleEntry[]>;

const getSchedulesByMonth = (channles: Array<Channel>) => {
  if (!channles) return {} as SchedulesByMonth;

  return channles?.reduce((acc, channel) => {
    const dateObj = new Date(channel.event_date);
    const month = (dateObj.getMonth() + 1).toString();
    const date = dateObj.getDate().toString();
    const day = dateObj.toLocaleDateString("ko-KR", { weekday: "short" });
    const time = dateObj.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const entry = { id: channel.id, month, date, day, time };
    if (!acc[month]) acc[month] = [];
    acc[month].push(entry);
    return acc;
  }, {} as SchedulesByMonth);
};

export default getSchedulesByMonth;
