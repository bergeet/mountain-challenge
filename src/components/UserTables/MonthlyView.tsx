import { ChallengeType, User } from "@prisma/client";
import dayjs from "dayjs";
import {
  BadgeCheck,
  BadgeX,
  CircleCheckBig,
  CircleSlash,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const tableConfigurations: Record<
  ChallengeType,
  { label: string; attribute: keyof DailyData }[]
> = {
  RUNNING: [
    { label: "Dag", attribute: "day" },
    { label: "Godkänd dag", attribute: "valid" },
  ],
  WEIGHTLOSS: [
    { label: "Dag", attribute: "day" },
    { label: "Godkänd dag", attribute: "valid" },
  ],
};

export type MonthlyData = {
  month: number;
  weeks: WeeklyData[];
};

export interface WeeklyData {
  week: number;
  days: DailyData[];
  valid: boolean;
}

export interface DailyData {
  valid: boolean;
  day: dayjs.Dayjs;
  id: string;
}

interface MonthlyViewProps {
  user: User;
  removeRow: (id: string) => void;
  data: MonthlyData;
}

export function MonthlyView({ user, data, removeRow }: MonthlyViewProps) {
  const columns = tableConfigurations[user.challengeType];

  return (
    <CardContent className="p-0">
      <div className="overflow-x-auto text-left">
        {data.weeks.map((weekData) => (
          <div key={weekData.week} className="mb-4 border-b border-gray-800">
            <div className="flex flex-row gap-4">
              <h2 className="text-xl mb-4">Vecka {weekData.week}</h2>
              {weekData.valid ? (
                <CircleCheckBig className="text-green-400" />
              ) : (
                <CircleSlash className="text-red-400" />
              )}
            </div>
            <Table key={weekData.week}>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.label} className="text-left">
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {weekData.days?.map((day) => (
                  <TableRow
                    key={day.id}
                    className={`transition-colors hover:bg-gray-100 hover:text-black text-left`}
                  >
                    <TableCell>{day.day.format("YYYY-MM-DD")}</TableCell>
                    <TableCell>
                      {day.valid ? (
                        <BadgeCheck className="text-green-400" />
                      ) : (
                        <BadgeX className="text-red-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(day.id)}
                        aria-label="Remove check-in"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </CardContent>
  );
}
