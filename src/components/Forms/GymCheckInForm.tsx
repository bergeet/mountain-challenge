import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createOrUpdateCheckInGym } from "@/app/actions/checkins";
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
import { Checkbox } from "../ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  walkingMinutes: z.number().int().min(0).optional().default(0),
  wentToGym: z.boolean(),
  createdAt: z.date(),
});

interface GymCheckInFormProps {
  onCheckIn: () => void;
  userId: string;
}

export function GymCheckInForm({ onCheckIn, userId }: GymCheckInFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walkingMinutes: 0,
      wentToGym: false,
      createdAt: new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await createOrUpdateCheckInGym({
        userId: userId,
        walkingMinutes: values.walkingMinutes,
        wentToGym: values.wentToGym,
        createdAt: values.createdAt,
        updatedAt: new Date(),
        challengeType: "GYM",
      })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((message: any) => {
          if (message.success === false) {
            toast({
              title: "Error",
              description: message.message,
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          setLoading(false);
          onCheckIn();
        })
      
    } catch (error) {
      toast({
        title: "Error",
        description: error as string,
        variant: "destructive",
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

        <Separator />

        <Button loading={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
