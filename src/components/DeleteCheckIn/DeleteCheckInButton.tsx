"use client";

import { deleteCheckIn } from "@/app/actions/checkins";
import { Button } from "../ui/button";
import { ChallengeType } from "@prisma/client";

export function DeleteCheckInButton({
  checkInId,
  type,
}: {
  checkInId: string;
  type: ChallengeType;
}) {
  return (
    <div>
      <Button
        onClick={() => {
          deleteCheckIn(checkInId, type);
        }}
      >
        🗑️
      </Button>
    </div>
  );
}
