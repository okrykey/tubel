import { utcToZonedTime, format } from "date-fns-tz";

export function formatDateToTokyoTimezone(date: Date) {
  const tokyoTimeZone = "Asia/Tokyo";
  const zonedDate = utcToZonedTime(date, tokyoTimeZone);
  return format(zonedDate, "yyyy/MM/dd", { timeZone: tokyoTimeZone });
}
