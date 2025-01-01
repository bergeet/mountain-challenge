"use client";

import { useToast } from "@/hooks/use-toast";
import { playConfetti } from "@/lib/utils";
import { User } from "@prisma/client";
import { useState } from "react";
import { RunningCheckInForm } from "../Forms/RunningCheckInForm";
import { WeightLossCheckIn } from "../Forms/WeightLossCheckIn";
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
  const { toast } = useToast();

  const onCheckInHandler = async () => {
    setShowCheckInDialog(false);
    // const achievmentTypes = (await getAchievementTypes()).filter(
    //   (a) => a.name === "Välkommen till världen"
    // );
    // addAchievementToUser({
    //   userId: user.id,
    //   achievementTypeId: achievmentTypes[0].id,
    // }).catch((e) => console.error(e));
    playConfetti();
    toast({
      title: "Checkat in! 🙌",
      description: `Din incheckning är registrerad.`,
    });
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
        <h1 className="w-full">Checka in</h1>
      </DialogTrigger>
      <DialogContent className="bg-gray-900/70">
        <DialogHeader>
          <DialogTitle>Checka in</DialogTitle>
          <DialogDescription>
            Dagens aktivitet för {user.name}
          </DialogDescription>
        </DialogHeader>
        <Card className="border-gray-800 bg-gray-900/90 text-white shadow-lg p-4 w-full">
          {showCheckIn()}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
