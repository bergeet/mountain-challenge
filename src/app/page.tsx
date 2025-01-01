import { UserTables } from "@/components/UserTables/UserTables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsers } from "./actions/checkins";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain } from "lucide-react";

export default async function Home() {
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="border-b border-gray-700 pb-6">
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <Mountain className="h-8 w-8" />
              Mountain Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue={users[0].id} className="space-y-6">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {users.map((user) => (
                  <TabsTrigger
                    key={user.id}
                    value={user.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {user.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {users.map((user) => (
                <TabsContent value={user.id} key={user.id}>
                  <UserTables user={user} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
