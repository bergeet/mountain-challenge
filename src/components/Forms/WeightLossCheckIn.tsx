import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createOrUpdateCheckInWeightLoss } from "@/app/actions/checkins";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChallengeType } from "@prisma/client";
import { useState } from "react";
import { Calendar } from "../ui/calendar";

const formSchema = z.object({
  walkingMinutes: z.number().int().positive(),
  ateLunch: z.boolean(),
  ateDinner: z.boolean(),
  ateSugar: z.boolean(),
  wentToGym: z.boolean(),
  createdAt: z.date(),
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datum</FormLabel>
              <FormControl>
                <Calendar
                  {...field}
                  selected={field.value}
                  mode="single"
                  onSelect={(v) => field.onChange(v)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walkingMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promenad (min)</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ateLunch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Åt lunch</FormLabel>
              <FormControl>
                <Checkbox
                  className="ml-2"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ateDinner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Åt middag</FormLabel>
              <FormControl>
                <Checkbox
                  className="ml-2"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ateSugar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Åt socker</FormLabel>
              <FormControl>
                <Checkbox
                  className="ml-2"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wentToGym"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gick till gymmet</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  className="ml-2"
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button loading={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
