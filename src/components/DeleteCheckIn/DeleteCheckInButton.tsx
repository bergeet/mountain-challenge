"use client";

import { Button } from "../ui/button";

export function DeleteCheckInButton({
  checkInId,
  type,
}: {
  checkInId: string;
  type: "running" | "weightLoss";
}) {
  const deleteCheckIn = async (id: string) => {
    await fetch("/api/checkIns", {
      method: "DELETE",
      body: JSON.stringify({
        id,
        type,
      }),
    });
  };

  return (
    <div>
      <Button
        onClick={() => {
          deleteCheckIn(checkInId);
        }}
      >
        🗑️
      </Button>
    </div>
  );
}
