"use client";

import { useState } from "react";
import { RunningCheckInForm } from "../Forms/RunningCheckInForm";
import { WeightLossCheckIn } from "../Forms/WeightLossCheckIn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { User } from "@prisma/client";

interface CheckInProps {
  user: User;
  onCheckIn: () => void;
}

export function CheckIn({ user, onCheckIn }: CheckInProps) {
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const onCheckInHandler = () => {
    setShowCheckInDialog(false);
    onCheckIn();
  };
  const showCheckIn = () => {
    if (user.challengeType === "RUNNING") {
      return (
        <RunningCheckInForm onCheckIn={onCheckInHandler} userId={user.id} />
      );
    } else {
      return (
        <WeightLossCheckIn onCheckIn={onCheckInHandler} userId={user.id} />
      );
    }
  };
  return (
    <>
      <Dialog
        open={showCheckInDialog}
        onOpenChange={(v) => setShowCheckInDialog(v)}
      >
        <DialogTrigger onClick={() => setShowCheckInDialog(true)}>
          Checka in
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checka in</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div>{showCheckIn()}</div>
        </DialogContent>
      </Dialog>
      {/* <div className="flex flex-col gap-8 border border-gray-200 p-8 rounded-md">
        <h1 className="text-4xl font-bold text-left">Checka in</h1>
      </div> */}
    </>
  );
}
