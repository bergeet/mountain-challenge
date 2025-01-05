import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createOrUpdateCheckInWeightLoss,
  createUserDetailCheckIn,
} from "@/app/actions/checkins";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChallengeType } from "@prisma/client";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  walkingMinutes: z.number().int().min(0).optional().default(0),
  ateLunch: z.boolean(),
  ateDinner: z.boolean(),
  ateSugar: z.boolean(),
  wentToGym: z.boolean(),
  createdAt: z.date(),
  currentWeight: z.number().int().min(0).optional().default(0),
});

interface WeightLossCheckInProps {
  onCheckIn: () => void;
  userId: string;
}

export function WeightLossCheckIn({
  onCheckIn,
  userId,
}: WeightLossCheckInProps) {
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walkingMinutes: 0,
      ateLunch: false,
      ateDinner: false,
      ateSugar: false,
      wentToGym: false,
      createdAt: new Date(),
      currentWeight: 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await createOrUpdateCheckInWeightLoss({
      ...values,
      userId,
      challengeType: ChallengeType.WEIGHTLOSS,
      createdAt: values.createdAt,
      updatedAt: new Date(),
      checkPointWeight: null,
    })
      .then(() => {
        setLoading(false);
        onCheckIn();
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });

    if (values.currentWeight > 0) {
      createUserDetailCheckIn({
        userId: userId,
        createdAt: values.createdAt,
        weight: values.currentWeight,
        tenKmPace: null,
        smokedCigarettes: null,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem className="flex flex-col-reverse items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Calendar
                  {...field}
                  selected={field.value}
                  mode="single"
                  onSelect={(v) => field.onChange(v)}
                  className="w-full"
                />
              </FormControl>
              <div className="space-y-1 leading-none"></div>
              <FormLabel>Datum</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-4">
          <FormField
            control={form.control}
            name="walkingMinutes"
            render={({ field }) => (
              <FormItem className="flex flex-col-reverse gap-4 items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Input
                    {...field}
                    className="ml-2"
                    onChange={(v) =>
                      field.onChange(
                        v.target.value.trim() === "" ||
                          isNaN(Number(v.target.value))
                          ? ""
                          : parseFloat(v.target.value)
                      )
                    }
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Promenad (min)</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wentToGym"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    className="ml-2"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Gick till gymmet</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row space-x-4">
          <FormField
            control={form.control}
            name="ateLunch"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    className="ml-2"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Åt lunch</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ateDinner"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    className="ml-2"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Åt middag</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ateSugar"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Åt snacks under dagen</FormLabel>
                  <FormDescription>
                    Kan vara godis, bullar eller liknande.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="currentWeight"
          render={({ field }) => (
            <FormItem className="flex flex-col-reverse items-start space-x-3 space-y-0 rounded-md border p-4 gap-4">
              <FormControl>
                <Input
                  {...field}
                  onChange={(v) =>
                    field.onChange(
                      v.target.value.trim() === "" ||
                        isNaN(Number(v.target.value))
                        ? ""
                        : parseFloat(v.target.value)
                    )
                  }
                />
              </FormControl>
              <div className="flex flex-col space-y-1"></div>
              <FormLabel>Nuvarande vikt</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <Button loading={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
