import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createOrUpdateCheckInSmoking,
  createUserDetailCheckIn,
} from "@/app/actions/checkins";
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
import { Separator } from "../ui/separator";

const formSchema = z.object({
  walkingMinutes: z.number().int().min(0).optional().default(0),
  smoked: z.number().int().min(0).optional().default(0),
  createdAt: z.date(),
});

interface SmokingCheckInFormProps {
  onCheckIn: () => void;
  userId: string;
}

interface UserDetailCheckIn {
  userId: string;
  createdAt: Date;
  tenKmPace: number | null;
  weight: number | null;
  smokedCigarettes: number;
}

export function SmokingCheckInForm({
  onCheckIn,
  userId,
}: SmokingCheckInFormProps) {
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walkingMinutes: 0,
      smoked: 0,
      createdAt: new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await createOrUpdateCheckInSmoking({
      userId: userId,
      walkingMinutes: values.walkingMinutes,
      smokedCigarettes: values.smoked,
      createdAt: values.createdAt,
      updatedAt: new Date(),
      challengeType: "SMOKING",
    })
      .then(() => {
        createUserDetailCheckIn({
          userId: userId,
          createdAt: values.createdAt,
          tenKmPace: null,
          weight: null,
          smokedCigarettes: values.smoked,
        } as UserDetailCheckIn);
        onCheckIn();
      })
      .catch(() => {
        setLoading(false);
      });

    if (values.smoked < 10) {
      createUserDetailCheckIn({
        userId: userId,
        createdAt: values.createdAt,
        tenKmPace: null,
        weight: null,
        smokedCigarettes: values.smoked,
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
        <div className="flex flex-row space-x-4">
          <FormField
            control={form.control}
            name="smoked"
            render={({ field }) => (
              <FormItem className="flex flex-col-reverse items-start space-x-3 space-y-0 rounded-md border p-4 gap-4 w-full">
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
                <FormLabel>Cigg rökta</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <Button loading={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
