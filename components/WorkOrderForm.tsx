"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  retailerId: z.string().min(1, "Please select a retailer"),
  shippingAddress: z.string().min(10, "Shipping address is required"),
  onSiteContactName: z.string().min(2, "On-site contact name is required"),
  onSiteContactNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  requesterName: z.string().min(2, "Requester name is required"),
  requesterEmail: z.string().email("Invalid email address"),
  retailerName: z.string().min(2, "Retailer name is required")
});

const newRetailerSchema = z.object({
  retailerId: z.string().min(1, "Retailer ID is required"),
  name: z.string().min(2, "Retailer name must be at least 2 characters"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format")
});

const sampleUser = {
  name: "Test Trial Dev",
  email: "testtrialmanager@farm.ag"
};

export function WorkOrderForm({ onSubmit, retailers = [] }) {
  const [open, setOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      retailerId: "",
      shippingAddress: "",
      onSiteContactName: "",
      onSiteContactNumber: "",
      requesterName: sampleUser.name,
      requesterEmail: sampleUser.email,
      retailerName: ""
    }
  });

  const newRetailerForm = useForm({
    resolver: zodResolver(newRetailerSchema),
    defaultValues: {
      retailerId: "",
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  const handleRetailerSelect = retailer => {
    form.setValue("retailerId", retailer.id);
    form.setValue("retailerName", retailer.name);
    form.setValue(
      "shippingAddress",
      `${retailer.street}\n${retailer.city}, ${retailer.state} ${retailer.zipCode}`
    );
    setSelectedRetailer(retailer);
    setOpen(false);
  };

  const handleCreateRetailer = async data => {
    console.log("Creating new retailer:", data);

    const newRetailer = {
      id: data.retailerId,
      name: data.name,
      street: data.street,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode
    };

    handleRetailerSelect(newRetailer);
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Product Shipping</h1>
          <p className="text-muted-foreground">
            Enter delivery information for your order
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
                <CardDescription>
                  Enter the delivery information for your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Requester Info - Read Only */}
                <div className="space-y-4">
                  <div>
                    <FormLabel>Requester</FormLabel>
                    <Input value={sampleUser.name} disabled />
                  </div>
                  <div>
                    <FormLabel>Email</FormLabel>
                    <Input value={sampleUser.email} disabled />
                  </div>
                </div>

                {/* Retailer Selection */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Select Retailer</FormLabel>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Retailer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Retailer</DialogTitle>
                          <DialogDescription>
                            Fill in the details to add a new retailer to the
                            system
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...newRetailerForm}>
                          <form
                            onSubmit={newRetailerForm.handleSubmit(
                              handleCreateRetailer
                            )}
                            className="space-y-4"
                          >
                            <FormField
                              control={newRetailerForm.control}
                              name="retailerId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Retailer ID *</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter unique identifier"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={newRetailerForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Retailer Name *</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter retailer name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={newRetailerForm.control}
                              name="street"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Street Address *</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter street address"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                              <FormField
                                control={newRetailerForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City *</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="City" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={newRetailerForm.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State *</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="ST"
                                        maxLength={2}
                                        className="uppercase"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={newRetailerForm.control}
                                name="zipCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Zip Code *</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="12345" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <DialogFooter>
                              <Button type="submit">Create Retailer</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {selectedRetailer
                          ? selectedRetailer.name
                          : "Search retailers..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search retailers..." />
                        <CommandEmpty>No retailer found.</CommandEmpty>
                        <CommandGroup>
                          {retailers.map(retailer => (
                            <CommandItem
                              key={retailer.id}
                              onSelect={() => handleRetailerSelect(retailer)}
                            >
                              {retailer.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Shipping Address */}
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="RETAILERS OR DISTRIBUTORS ONLY"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="onSiteContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>On Site Individual Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>On Site Contact Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Delivery Date */}
                {/* <FormField
                  control={form.control}
                  name="requestedDeliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested Delivery Date</FormLabel>
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                            onSelect={date => {
                              field.onChange(date);
                              setCalendarOpen(false);
                            }}
                            disabled={date =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} */}
                {/* /> */}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                onClick={() => {
                  const isValid = form.trigger();
                  console.log("Form errors:", form.formState.errors);
                  console.log("Form values:", form.getValues());
                }}
              >
                Continue to Product Selection
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
