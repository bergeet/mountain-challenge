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
    <div>
        <h1 className="text-md">Achievements 👑</h1>
      {achievements.map((achievement) => (
        <Table key={achievement.id}>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>Beskrivning</TableHead>
              <TableHead>Poäng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{achievement.achievementType.name}</TableCell>
              <TableCell>{achievement.achievementType.description}</TableCell>
              <TableCell>{achievement.achievementType.points}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </div>
  );
}
