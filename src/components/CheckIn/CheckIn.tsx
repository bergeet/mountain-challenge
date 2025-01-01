"use client";

import { User } from "@prisma/client";
import party from "party-js";
import { useState } from "react";
import { RunningCheckInForm } from "../Forms/RunningCheckInForm";
import { WeightLossCheckIn } from "../Forms/WeightLossCheckIn";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CheckInProps {
  user: User;
  onCheckIn: () => void;
}

export function CheckIn({ user, onCheckIn }: CheckInProps) {
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const onCheckInHandler = async () => {
    setShowCheckInDialog(false);
    // const achievmentTypes = (await getAchievementTypes()).filter(
    //   (a) => a.name === "Välkommen till världen"
    // );
    // addAchievementToUser({
    //   userId: user.id,
    //   achievementTypeId: achievmentTypes[0].id,
    // }).catch((e) => console.error(e));
    const mainElement = document.getElementById("main");
    if (mainElement) {
      party.confetti(mainElement, {
        count: party.variation.range(50, 150),
        size: party.variation.range(1, 2.4),
      });
    }
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
    <Dialog
      open={showCheckInDialog}
      onOpenChange={(v) => setShowCheckInDialog(v)}
    >
      <DialogTrigger onClick={() => setShowCheckInDialog(true)}>
        <Button className="w-full" variant="default">Checka in</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900/70">
        <DialogHeader>
          <DialogTitle>Checka in</DialogTitle>
          <DialogDescription>
            Dagens aktivitet för {user.name}
          </DialogDescription>
        </DialogHeader>
        <Card className="border-gray-800 bg-gray-900/90 text-white shadow-lg p-4">
          {showCheckIn()}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
