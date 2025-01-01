"use client";

import { Medal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { UserDetails as UserDetailSchema } from "@prisma/client";
import { Chart } from "../AreaChart/AreaChart";
import { Separator } from "../ui/separator";

export function UserDetailsWeightLoss({
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
            <CardTitle>Nuvarande vikt</CardTitle>
          </CardHeader>
          <CardContent>
            {userDetail?.length ? (
              <p>
                {userDetail.sort((a, b) => a.weight! - b.weight!)[0].weight}
              </p>
            ) : (
              <p>No data available</p>
            )}
          </CardContent>
        </Card>
        <Separator />
        {true ? (
          <Chart
            title="Vikt"
            description="Din vikt över tid"
            xAxisKey="date"
            yAxisKey="weight"
            data={
              userDetail
                ? userDetail
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt!).getTime() -
                        new Date(b.createdAt!).getTime()
                    )
                    .map((detail) => ({
                      date: new Date(detail.createdAt).toLocaleDateString(),
                      weight: detail.weight?.toString() || "",
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
