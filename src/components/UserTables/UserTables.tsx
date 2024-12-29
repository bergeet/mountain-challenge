"use client";

import { deleteCheckIn, getCheckIns } from "@/app/actions/checkins";
import dayjs from "@/lib/dayjs-configurations";
import { CheckInRunning, CheckInWeightLoss, User } from "@prisma/client";
import { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CheckIn } from "../CheckIn/CheckIn";
import { Button } from "../ui/button";
import { WeeklyView } from "./WeeklyView";
import { Achievements } from "../Achievements/Achievements";

export type CheckInTypeCombined = CheckInRunning & CheckInWeightLoss;

interface UserTablesProps {
  user: User;
}

export interface DateInterval {
  startDate: Dayjs;
  endDate: Dayjs;
}

export function UserTables({ user }: UserTablesProps) {
  const type = user.challengeType;
  const [checkins, setCheckIns] = useState<CheckInTypeCombined[] | null>(null);
  const [resolution, setResolution] = useState<"isoWeek" | "month">("isoWeek");
  const [intervalDates, setIntervalDates] = useState<DateInterval>({
    startDate: dayjs().utc().startOf("isoWeek"),
    endDate: dayjs().utc().endOf("isoWeek"),
  });

  const setResolutionAndInterval = (res: "isoWeek" | "month") => {
    setResolution(res);
    if (res === "isoWeek") {
      setIntervalDates({
        startDate: dayjs().utc().startOf("isoWeek"),
        endDate: dayjs().utc().endOf("isoWeek"),
      });
    } else {
      setIntervalDates({
        startDate: dayjs().utc().startOf("month"),
        endDate: dayjs().utc().endOf("month"),
      });
    }
  };
  const fetchCheckIns = useCallback(async () => {
    const data: CheckInTypeCombined[] = (await getCheckIns(
      user.id,
      type,
      intervalDates.startDate.toISOString(),
      intervalDates.endDate.toISOString()
    )) as CheckInTypeCombined[];
    setCheckIns(data);
  }, [intervalDates, type, user.id]);

  const removeRow = async (id: string) => {
    await deleteCheckIn(id, type);
    await fetchCheckIns();
  };

  useEffect(() => {
    fetchCheckIns();
  }, [fetchCheckIns]);

  const createUserTables = () => {
    return (
      <div key={user.id} className="mb-8 flex flex-col gap-4 items-start">
        <h2 className="text-2xl font-bold">{user.name}</h2>

        <CheckIn onCheckIn={fetchCheckIns} user={user} />
        <div className="flex flex-row gap-4 justify-between items-center w-full">
          <div className="gap-4 flex flex-row">
            <Button onClick={() => setResolutionAndInterval("isoWeek")}>
              Vecka
            </Button>
            <Button onClick={() => setResolutionAndInterval("month")}>
              Månad
            </Button>
          </div>
          <div className="flex flex-row gap-4 font-bold">
            <ChevronLeft
              className="cursor-pointer hover:rounded-lg hover:border-gray-700 border-transparent border-2 pd-2 hover:border-current"
              onClick={() => {
                if (resolution === "isoWeek") {
                  setIntervalDates({
                    startDate: intervalDates.startDate.subtract(1, "week"),
                    endDate: intervalDates.endDate.subtract(1, "week"),
                  });
                } else {
                  setIntervalDates({
                    startDate: intervalDates.startDate.subtract(1, "month"),
                    endDate: intervalDates.endDate.subtract(1, "month"),
                  });
                }
              }}
            />
            {resolution === "isoWeek"
              ? intervalDates.startDate.isoWeek()
              : intervalDates.startDate.toDate().toLocaleString("default", {
                  month: "long",
                })}
            <ChevronRight
              className="cursor-pointer hover:rounded-lg hover:border-gray-700 border-transparent border-2 pd-2 hover:border-current"
              onClick={() => {
                if (resolution === "isoWeek") {
                  setIntervalDates({
                    startDate: intervalDates.startDate.add(1, "week"),
                    endDate: intervalDates.endDate.add(1, "week"),
                  });
                } else {
                  setIntervalDates({
                    startDate: intervalDates.startDate.add(1, "month"),
                    endDate: intervalDates.endDate.add(1, "month"),
                  });
                }
              }}
            />
          </div>
        </div>
        <WeeklyView user={user} checkIn={checkins} removeRow={removeRow} />
      </div>
    );
  };

  return (
    <>
      <div className="w-full flex-col gap-8">{createUserTables()}</div>
      <div>
        <Achievements userId={user.id} />
      </div>
    </>
  );
}
