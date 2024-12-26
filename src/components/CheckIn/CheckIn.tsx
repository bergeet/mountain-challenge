import { RunningCheckInForm } from "../Forms/RunningCheckInForm";
import { WeightLossCheckIn } from "../Forms/WeightLossCheckIn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function CheckIn() {
  return (
    <>
      <div className="text-4xl font-bold">Check-ins</div>
      <div>
        <Tabs defaultValue="elliot" className="border border-gray-200 p-4">
          <TabsList className="flex gap-4">
            <TabsTrigger className="w-[200px]" value="elliot">
              Elliot
            </TabsTrigger>
            <TabsTrigger className="w-[200px]" value="liam">
              Liam
            </TabsTrigger>
          </TabsList>
          <TabsContent value="elliot">
            <RunningCheckInForm />
          </TabsContent>
          <TabsContent value="liam">
            <WeightLossCheckIn />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
