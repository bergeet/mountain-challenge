"use client";

import { CheckInRunning, CheckInWeightLoss, User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { CheckIn } from "../CheckIn/CheckIn";
import { WeeklyView } from "./WeeklyView";

export type CheckInTypeCombined = CheckInRunning & CheckInWeightLoss;

interface UserTablesProps {
  user: User;
}

export function UserTables({ user }: UserTablesProps) {
  const type = user.challengeType;
  const [checkins, setCheckIns] = useState<CheckInTypeCombined[] | null>(null);

  const fetchCheckIns = useCallback(async () => {
    const res = await fetch(
      `/api/checkins/${type.toLowerCase()}?id=${user.id}`
    );
    const data = await res.json();

    setCheckIns(data);
  }, [type, user.id]);

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

        <WeeklyView user={user} checkIn={checkins} removeRow={removeRow} />
      </div>
    );
  };

  return <div className="w-full flex-col gap-8">{createUserTables()}</div>;
}
