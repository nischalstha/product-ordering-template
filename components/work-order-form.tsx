"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  requesterName: z.string().min(2, {
    message: "Requester name must be at least 2 characters.",
  }),
  requesterEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  retailerName: z.string().min(2, {
    message: "Retailer name must be at least 2 characters.",
  }),
  retailerId: z.string().optional(),
  shippingAddress: z.string().min(10, {
    message: "Shipping address must be at least 10 characters.",
  }),
  onSiteContactName: z.string().min(2, {
    message: "On-site contact name must be at least 2 characters.",
  }),
  onSiteContactNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid phone number.",
  }),
  requestedDeliveryDate: z.date({
    required_error: "Please select a date.",
  }),
});

export function WorkOrderForm({ onSubmit }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requesterName: "",
      requesterEmail: "",
      retailerName: "",
      retailerId: "",
      shippingAddress: "",
      onSiteContactName: "",
      onSiteContactNumber: "",
      requestedDeliveryDate: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Requester Information</h2>
          <FormField
            control={form.control}
            name="requesterName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requester Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requesterEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requester Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Retailer Information</h2>
          <FormField
            control={form.control}
            name="retailerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retailer Name</FormLabel>
                <FormControl>
                  <Input placeholder="ACME Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="retailerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retailer ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the unique identifier for this retailer, if known.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Shipping Information</h2>
          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter the full shipping address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onSiteContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>On-Site Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onSiteContactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>On-Site Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="requestedDeliveryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Requested Delivery Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a delivery date within the next year.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Next: Add Products</Button>
        </div>
      </form>
    </Form>
  );
}

