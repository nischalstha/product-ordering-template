"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

// Product options array
const productOptions = [
  "Sphaerex - 2x2.5 gal",
  "Priaxor - 2x2.5 gal",
  "Nexicor - 2x2.5 gal",
  "Veltyma - 2x1 gal"
];

const formSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().min(1, "Product name is required"),
      quantity: z.coerce.number().min(1, "Quantity must be at least 1")
    })
  )
});

export function ProductDetailsForm({
  onSubmit,
  workOrderData,
  existingProducts = []
}) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products:
        existingProducts.length > 0
          ? existingProducts
          : [{ name: "", quantity: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  const handleSubmit = data => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    onSubmit(data);
  };

  return (
    <div className="container max-w-5xl mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Product Selection</h1>
          <p className="text-muted-foreground">
            Select the products for your order
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>
                    Review your delivery details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Requester Info */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Requester
                        </Label>
                        <p className="text-sm">{workOrderData.requesterName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Email
                        </Label>
                        <p className="text-sm">
                          {workOrderData.requesterEmail}
                        </p>
                      </div>
                    </div>

                    {/* Retailer Info */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Retailer Name
                        </Label>
                        <p className="text-sm">{workOrderData.retailerName}</p>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Shipping Address
                        </Label>
                        <p className="text-sm whitespace-pre-wrap">
                          {workOrderData.shippingAddress}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          On-site Contact Name
                        </Label>
                        <p className="text-sm">
                          {workOrderData.onSiteContactName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          On-site Contact Number
                        </Label>
                        <p className="text-sm">
                          {workOrderData.onSiteContactNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Product Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Selection</CardTitle>
                  <CardDescription>Add products to your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="w-[150px]">
                          Cases Requested
                        </TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`products.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a product" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {productOptions.map(product => (
                                        <SelectItem
                                          key={product}
                                          value={product}
                                        >
                                          {product}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`products.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="number" min={1} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", quantity: 1 })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Submit Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>

        {showSuccessMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md">
            Order submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}
