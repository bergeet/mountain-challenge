"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  walkingMinutes: z.number().int().positive(),
  halfMileMinutes: z.number().int().positive(),
  mileMinutes: z.number().int().positive(),
  feeling: z.number().int().positive().min(1).max(5),
});

export function RunningCheckInForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walkingMinutes: 0,
      halfMileMinutes: 0,
      mileMinutes: 0,
      feeling: 1,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    fetch("/api/checkIns", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        type: "running",
        name: "Elliot",
      }),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-[600px]"
      >
        <FormField
          control={form.control}
          name="walkingMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promenad (min)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(v) => field.onChange(parseFloat(v.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="halfMileMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>5 km (min)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(v) => field.onChange(parseFloat(v.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mileMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>10 km (min)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(v) => field.onChange(parseFloat(v.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feeling"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Känsla</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(v) => field.onChange(parseFloat(v.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormDescription>Hur kände du dig under passet?</FormDescription>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
