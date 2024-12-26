"use client";

import { CheckInRunning, CheckInWeightLoss, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { CheckIn } from "../CheckIn/CheckIn";
import { WeeklyView } from "./WeeklyView";
import { Button } from "../ui/button";
import dayjs from "@/lib/dayjs-configurations";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CheckInTypeCombined = CheckInRunning & CheckInWeightLoss;

interface UserTablesProps {
  user: User;
}

export function UserTables({ user }: UserTablesProps) {
  const type = user.challengeType;
  const [checkins, setCheckIns] = useState<CheckInTypeCombined[] | null>(null);
  const [resolution, setResolution] = useState<"week" | "month">("week");
  const [interval, setInterval] = useState<number>(dayjs().utc().isoWeek());

  const setResolutionAndInterval = (res: "week" | "month", int: number) => {
    console.log(res, int);
    setResolution(res);
    setInterval(int);
  };
  const fetchCheckIns = useCallback(async () => {
    const resolutionParams = resolution === "week" ? "week" : "month";

    await fetch(
      `/api/checkins/?type=${type.toLowerCase()}&id=${
        user.id
      }&${resolutionParams}=${interval}`
    )
      .then((res) => res.json())
      .then((data) => setCheckIns(data));
  }, [interval, resolution, type, user.id]);

  const removeRow = async (id: string) => {
    await fetch(`/api/checkins`, {
      method: "DELETE",
      body: JSON.stringify({ id, type }),
    });
    fetchCheckIns();
  };

  useEffect(() => {
    fetchCheckIns();
  }, [fetchCheckIns, type, user.id, user.name]);

  const createUserTables = () => {
    return (
      <div key={user.id} className="mb-8 flex flex-col gap-4 items-start">
        <h2 className="text-2xl font-bold">{user.name}</h2>

        <CheckIn onCheckIn={fetchCheckIns} user={user} />
        <div className="flex flex-row gap-4 justify-between items-center w-full">
          <div className="gap-4 flex flex-row">
            <Button
              onClick={() =>
                setResolutionAndInterval("week", dayjs().utc().isoWeek())
              }
            >
              Vecka
            </Button>
            <Button
              onClick={() =>
                setResolutionAndInterval("month", dayjs().utc().month() + 1)
              }
            >
              Månad
            </Button>
          </div>
          <div className="flex flex-row gap-4">
            <ChevronLeft
              className="cursor-pointer hover:rounded-lg hover:border-gray-700 border-transparent border-2 pd-2 hover:border-current"
              onClick={() => {
                if (resolution === "week") {
                  setInterval(interval - 1);
                } else {
                  setInterval(interval - 1);
                }
              }}
            />
            {interval}
            <ChevronRight
              className="cursor-pointer hover:rounded-lg hover:border-gray-700 border-transparent border-2 pd-2 hover:border-current"
              onClick={() => {
                if (resolution === "week") {
                  setInterval(interval + 1);
                } else {
                  setInterval(interval + 1);
                }
              }}
            />
          </div>
        </div>
        <WeeklyView user={user} checkIn={checkins} removeRow={removeRow} />
      </div>
    );
  };

  return <div className="w-full flex-col gap-8">{createUserTables()}</div>;
}
