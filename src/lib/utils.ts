import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "./dayjs-configurations";
import party from "party-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBooleanValueYesOrNo = (value: boolean) =>
  value ? "Ja" : "Nej";
export const getValidityClass = (value: boolean) =>
  value ? "bg-green-200" : "bg-red-200";
export const getFeelingClass = (value: number) => {
  switch (value) {
    case 1:
      return "bg-red-500";
    case 2:
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-green-500";
    case 5:
      return "bg-blue-500";
  }
};

export const getAttributesTypes = (attribute: unknown) => {
  {
    if (attribute instanceof Date) {
      return dayjs(attribute).format("YYYY-MM-DD");
    } else if (typeof attribute === "boolean") {
      return getBooleanValueYesOrNo(attribute);
    } else if (typeof attribute === "number") {
      return Number(attribute).toString();
    } else if (typeof attribute === "string") {
      if (new Date(attribute).toString() !== "Invalid Date") {
        return dayjs.utc(attribute).format("YYYY-MM-DD");
      }
      return attribute;
    } else return null;
  }
};

export function getDatesOfWeek(year: number, weekNumber: number) {
  const startOfWeek = dayjs()
    .utc()
    .year(year)
    .isoWeek(weekNumber)
    .startOf("isoWeek");
  const endOfWeek = startOfWeek.endOf("isoWeek");

  return [startOfWeek, endOfWeek];
}

export function getDatesOfMonth(year: number, month: number) {
  // Month in dayjs is 0-indexed, so we subtract 1
  const startOfMonth = dayjs()
    .utc()
    .year(year)
    .month(month - 1)
    .startOf("month");
  const endOfMonth = startOfMonth.endOf("month");

  return [startOfMonth, endOfMonth];
}

export function playWeeklyWin() {
  const audio = document.getElementById("weeklyWin") as HTMLAudioElement;
  audio.play();
  const mainElement = document.getElementsByTagName("main")[0];
  if (mainElement) {
    party.sparkles(mainElement, {
      count: party.variation.range(200, 300),
      size: party.variation.range(1, 2.4),
    });
  }
}

export function playConfetti() {
  const mainElement = document.getElementsByTagName("main")[0];
  if (mainElement) {
    party.confetti(mainElement, {
      count: party.variation.range(50, 150),
      size: party.variation.range(1, 2.4),
    });
  }
}
