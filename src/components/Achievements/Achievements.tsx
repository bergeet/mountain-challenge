"use client";

import {
  AchievmentWithType,
  getAchievementsForUser,
} from "@/app/actions/achievements";
import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Crown, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementsProps {
  userId: string;
}

export function Achievements({ userId }: AchievementsProps) {
  const [achievements, setAchievements] = useState<AchievmentWithType[]>([]);

  const fetchAchievements = useCallback(async () => {
    const data = await getAchievementsForUser(userId);
    setAchievements(data);
  }, [userId]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return (
    <Card className="border-gray-800 bg-gray-900/50 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Crown className="h-6 w-6 text-yellow-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {achievements.map((achievement) => (
                <TableRow key={achievement.id}>
                  <TableCell>
                    <Award
                      className={cn(
                        "h-6 w-6",
                        achievement.achievementType.points >= 50
                          ? "text-yellow-500"
                          : achievement.achievementType.points >= 25
                          ? "text-gray-400"
                          : "text-orange-600"
                      )}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {achievement.achievementType.name}
                  </TableCell>
                  <TableCell>
                    {achievement.achievementType.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      {achievement.achievementType.points}
                      <Star className="h-4 w-4 text-yellow-500" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-400">
            No achievements yet. Keep challenging yourself!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
