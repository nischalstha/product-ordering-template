"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
})

const formSchema = z.object({
  products: z.array(productSchema).min(1, "At least one product is required"),
})

const productOptions = [
  "Product A",
  "Product B",
  "Product C",
  "Product D",
  "Product E",
]

export function ProductDetailsForm({ onSubmit, workOrderData, existingProducts = [] }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: existingProducts.length > 0 ? existingProducts : [{ name: "", quantity: 1 }],
    },
  })

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "products",
  })

  useEffect(() => {
    if (existingProducts.length > 0) {
      form.reset({ products: existingProducts })
    }
  }, [existingProducts, form])

  const handleSubmit = (data) => {
    setShowSuccessMessage(true)
    setIsSubmitted(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Work Order Summary</CardTitle>
            <CardDescription>Review the details of your work order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Requester:</strong> {workOrderData.requesterName}
              </div>
              <div>
                <strong>Retailer:</strong> {workOrderData.retailerName}
              </div>
              <div>
                <strong>Shipping Address:</strong> {workOrderData.shippingAddress}
              </div>
              <div>
                <strong>Requested Delivery:</strong>{" "}
                {workOrderData.requestedDeliveryDate.toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productOptions.map((product) => (
                              <SelectItem key={product} value={product}>
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
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>{isSubmitted && index < existingProducts.length ? "Processing" : "Pending"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => append({ name: "", quantity: 1 })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>

        {showSuccessMessage && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              {isSubmitted ? "Work order submitted successfully!" : "Product added successfully!"}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => onSubmit(null)}>
            Back: Edit Work Order
          </Button>
          <Button type="submit">{isSubmitted ? "Update Work Order" : "Submit Work Order"}</Button>
        </div>
      </form>
    </Form>
  )
}

