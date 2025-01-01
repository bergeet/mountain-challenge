"use client";

import { Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { UserDetails as UserDetailSchema } from "@prisma/client";
import { Chart } from "../AreaChart/AreaChart";
import { Separator } from "../ui/separator";

export function UserDetailsRunning({
  userDetail,
}: {
  userDetail: UserDetailSchema[] | null;
}) { 
  return (
    <Card className="border-gray-800 bg-gray-900/50 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Medal className="h-6 w-6 text-yellow-500" />
          Personliga rekord
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Bästa löprunda över 1 mil</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {(userDetail?.every((d) => d.tenKmPace) &&
                userDetail?.sort((a, b) => a.tenKmPace! - b.tenKmPace!)[0]
                  ?.tenKmPace) ??
                "No data available"}
            </p>
          </CardContent>
        </Card>
        <Separator />
        {true ? (
          <Chart
            title="Löptempo över 10 km"
            description="Ditt löptempo över tid"
            xAxisKey="date"
            yAxisKey="runningPace"
            data={
              userDetail
                ? userDetail
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )
                    .map((detail) => ({
                      date: new Date(detail.createdAt).toLocaleDateString(),
                      runningPace: detail.tenKmPace?.toString() || "",
                    }))
                : []
            }
          />
        ) : (
          <p className="text-center text-gray-400">
            No achievements yet. Keep challenging yourself!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
