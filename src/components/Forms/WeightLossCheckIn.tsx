"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

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
  ateLunch: z.boolean(),
  ateDinner: z.boolean(),
  ateSugar: z.boolean(),
  wentToGym: z.boolean(),
  feeling: z.number().int().positive().min(1).max(5),
});

export function WeightLossCheckIn() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walkingMinutes: 0,
      ateLunch: false,
      ateDinner: false,
      ateSugar: false,
      wentToGym: false,
      feeling: 1,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    fetch("/api/checkIns", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        type: "weightLoss",
        name: "Liam",
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
                  className="ml-2"
                  onChange={(v) => field.onChange(parseFloat(v.target.value))}
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
