import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createOrUpdateCheckInRunning } from "@/app/actions/checkins";
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
import { useState } from "react";
import { Calendar } from "../ui/calendar";

const formSchema = z.object({
  walkingMinutes: z.number().int().min(0).optional().default(0),
  minutes: z.number().int().min(0).optional().default(0),
  km: z.number().int().min(0).optional().default(0),
  createdAt: z.date(),
});

interface RunningCheckInFormProps {
  onCheckIn: () => void;
  userId: string;
}

export function RunningCheckInForm({
  onCheckIn,
  userId,
}: RunningCheckInFormProps) {
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walkingMinutes: 0,
      minutes: 0,
      km: 0,
      createdAt: new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await createOrUpdateCheckInRunning({
      userId: userId,
      challengeType: "RUNNING",
      walkingMinutes: values.walkingMinutes,
      km: values.km,
      minutes: values.minutes,
      createdAt: values.createdAt,
      updatedAt: new Date(),
      checkPointMileMinutes: null,
    })
      .then(() => {
        setLoading(false);
        onCheckIn();
      })
      .catch(() => {
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
            <FormItem className="flex flex-col-reverse items-start space-x-3 space-y-0 rounded-md border p-4 gap-4">
              <FormControl>
                <Calendar
                  {...field}
                  selected={field.value}
                  mode="single"
                  onSelect={(v) => field.onChange(v)}
                />
              </FormControl>
              <div className="flex flex-col space-y-1">
                <FormLabel>Datum</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walkingMinutes"
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
              <div className="flex flex-col space-y-1">
                <FormLabel>Promenad (min)</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="minutes"
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
              <FormLabel>Löptid i min</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="km"
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
              <div className="flex flex-col space-y-1">
                <FormLabel>Längd in km</FormLabel>
              </div>
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
