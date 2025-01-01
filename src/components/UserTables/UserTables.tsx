"use client";

import { deleteCheckIn, getCheckIns } from "@/app/actions/checkins";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "@/lib/dayjs-configurations";
import { CheckInRunning, CheckInWeightLoss, User } from "@prisma/client";
import { type Dayjs } from "dayjs";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Achievements } from "../Achievements/Achievements";
import { CheckIn } from "../CheckIn/CheckIn";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MonthlyData, MonthlyView, WeeklyData } from "./MonthlyView";
import { WeeklyView } from "./WeeklyView";

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
    setIntervalDates({
      startDate: dayjs().utc().startOf(res),
      endDate: dayjs().utc().endOf(res),
    });
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

  const handleIntervalChange = (direction: "next" | "previous") => {
    const operation = direction === "next" ? "add" : "subtract";
    const unit = resolution === "isoWeek" ? "week" : "month";

    setIntervalDates({
      startDate: intervalDates.startDate[operation](1, unit),
      endDate: intervalDates.endDate[operation](1, unit),
    });
  };

  const monthlyData = (): MonthlyData => {
    const weeks: WeeklyData[] = [];
    const monthStartDate = intervalDates.startDate;
    checkins?.forEach((checkIn) => {
      const day = dayjs(checkIn.createdAt);
      const weekNumber = day.isoWeek();
      const weekIndex = weeks.findIndex((week) => week.week === weekNumber);
      const walkingMinutesPerWeek = checkins.reduce(
        (acc, curr) =>
          dayjs(curr.createdAt).isoWeek() === weekNumber
            ? acc + curr.walkingMinutes
            : acc,
        0
      );
      const runningKmPerWeek = checkins.reduce(
        (acc, curr) =>
          dayjs(curr.createdAt).isoWeek() === weekNumber ? acc + curr.km : acc,
        0
      );

      const dayIsValid =
        checkIn.ateSugar !== undefined || checkIn.ateSugar !== null
          ? !checkIn.ateSugar
          : true;

      const weekIsvalid =
        walkingMinutesPerWeek > 180 &&
        (!checkIn.ateSugar || runningKmPerWeek > 15);
      const id = checkIn.id;

      if (weekIndex === -1) {
        weeks.push({
          week: weekNumber,
          days: [{ valid: dayIsValid, day, id }],
          valid: weekIsvalid,
        });
      } else {
        weeks[weekIndex].days.push({ valid: dayIsValid, day, id });
      }
    });

    return {
      month: monthStartDate.month() + 1,
      weeks,
    };
  };

  useEffect(() => {
    fetchCheckIns();
  }, [fetchCheckIns]);

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <Card className="border-gray-800 bg-gray-900/50 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {user.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <CheckIn onCheckIn={fetchCheckIns} user={user} />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
              <Tabs
                value={resolution}
                onValueChange={(value: string) =>
                  setResolutionAndInterval(value as "isoWeek" | "month")
                }
              >
                <TabsList>
                  <TabsTrigger value="isoWeek">Vecka</TabsTrigger>
                  <TabsTrigger value="month">Månad</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleIntervalChange("previous")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[8rem] text-center font-medium bg-gray-800 rounded-md py-2 px-3">
                  {resolution === "isoWeek"
                    ? `Vecka ${intervalDates.startDate.isoWeek()}`
                    : intervalDates.startDate.toDate().toLocaleString("sv-SE", {
                        month: "long",
                        year: "numeric",
                      })}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleIntervalChange("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {resolution === "isoWeek" ? (
              <WeeklyView
                user={user}
                checkIn={checkins}
                removeRow={removeRow}
              />
            ) : (
              <MonthlyView
                user={user}
                data={monthlyData()}
                removeRow={removeRow}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Achievements userId={user.id} />
    </div>
  );
}
