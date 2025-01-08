"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Eye, PenSquare, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { WorkOrderForm } from "@/components/WorkOrderForm";
import { ProductDetailsForm } from "@/components/ProductDetailsForm";
import { LoginForm } from "@/components/LoginForm";

// Mock data for demonstration
const mockWorkOrders = [
  {
    id: "WO-001",
    requesterName: "John Doe",
    retailerName: "ACME Corp",
    requestedDate: new Date(2023, 5, 15),
    productCount: 3,
    status: "Pending"
  },
  {
    id: "WO-002",
    requesterName: "Jane Smith",
    retailerName: "XYZ Inc",
    requestedDate: new Date(2023, 5, 20),
    productCount: 2,
    status: "Processing"
  },
  {
    id: "WO-003",
    requesterName: "Alice Johnson",
    retailerName: "123 Enterprises",
    requestedDate: new Date(2023, 5, 25),
    productCount: 5,
    status: "Completed"
  }
];

// Add sampleRetailers data
const sampleRetailers = [
  {
    id: "1",
    name: "1871 Florida",
    street: "1871 Florida Street",
    city: "Memphis",
    state: "TN",
    zipCode: "38106"
  },
  {
    id: "2",
    name: "Helena Ag",
    street: "123 Main St",
    city: "Helena",
    state: "AR",
    zipCode: "72342"
  }
];

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [workOrders, setWorkOrders] = useState(mockWorkOrders);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRetailer, setFilterRetailer] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [workOrderData, setWorkOrderData] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    // In a real app, you'd fetch work orders from your backend here
  }, []);

  if (!isAuthenticated) {
    return <LoginForm onLogin={setIsAuthenticated} />;
  }

  const handleFilter = () => {
    let filteredOrders = mockWorkOrders;

    if (filterStatus !== "all") {
      filteredOrders = filteredOrders.filter(
        order => order.status === filterStatus
      );
    }

    if (filterRetailer) {
      filteredOrders = filteredOrders.filter(order =>
        order.retailerName.toLowerCase().includes(filterRetailer.toLowerCase())
      );
    }

    setWorkOrders(filteredOrders);
  };

  const handleCreateNewOrder = () => {
    setShowCreateForm(true);
    setCurrentStep(1);
  };

  const handleWorkOrderSubmit = data => {
    setWorkOrderData(data);
    setCurrentStep(2);
  };

  const handleProductSubmit = data => {
    // Create new work order
    const newWorkOrder = {
      id: `WO-${workOrders.length + 1}`.padStart(6, "0"),
      requestedDate: new Date(), // When the work order was created
      requesterName: workOrderData.requesterName,
      retailerName: workOrderData.retailerName,
      productCount: data.products.length,
      status: "Pending"
    };

    setWorkOrders([newWorkOrder, ...workOrders]);
    setShowCreateForm(false);
    setCurrentStep(1);
    setWorkOrderData(null);
  };

  const handleEditOrder = id => {
    // Instead of navigating, show the form with existing data
    const orderToEdit = workOrders.find(order => order.id === id);
    if (orderToEdit) {
      setWorkOrderData(orderToEdit);
      setShowCreateForm(true);
      setCurrentStep(1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            setIsAuthenticated(false);
          }}
        >
          Logout
        </Button>
      </div>
      {!showCreateForm ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Work Order Dashboard</h1>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filter by Retailer"
                value={filterRetailer}
                onChange={e => setFilterRetailer(e.target.value)}
                className="w-full sm:w-auto"
              />
              <Button onClick={handleFilter} className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </div>
            <Button onClick={handleCreateNewOrder} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Create New Work Order
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>
                Manage and view your submitted work orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Order ID</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Requester Name</TableHead>
                      <TableHead>Retailer Name</TableHead>
                      <TableHead>Product Count</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>
                          {format(order.requestedDate, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{order.requesterName}</TableCell>
                        <TableCell>{order.retailerName}</TableCell>
                        <TableCell>{order.productCount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Completed"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Work Order Details</DialogTitle>
                                  <DialogDescription>
                                    Viewing details for Work Order {order.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="name"
                                      className="text-right"
                                    >
                                      Requester
                                    </Label>
                                    <Input
                                      id="name"
                                      value={order.requesterName}
                                      className="col-span-3"
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="retailer"
                                      className="text-right"
                                    >
                                      Retailer
                                    </Label>
                                    <Input
                                      id="retailer"
                                      value={order.retailerName}
                                      className="col-span-3"
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="date"
                                      className="text-right"
                                    >
                                      Requested Date
                                    </Label>
                                    <Input
                                      id="date"
                                      value={format(
                                        order.requestedDate,
                                        "MMM d, yyyy"
                                      )}
                                      className="col-span-3"
                                      readOnly
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="status"
                                      className="text-right"
                                    >
                                      Status
                                    </Label>
                                    <Input
                                      id="status"
                                      value={order.status}
                                      className="col-span-3"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditOrder(order.id)}
                            >
                              <PenSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {currentStep === 1 ? "Create Work Order" : "Add Products"}
            </h1>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateForm(false);
                setCurrentStep(1);
                setWorkOrderData(null);
              }}
            >
              Cancel
            </Button>
          </div>

          {currentStep === 1 ? (
            <WorkOrderForm
              retailers={sampleRetailers}
              onSubmit={handleWorkOrderSubmit}
              existingData={workOrderData}
            />
          ) : (
            <ProductDetailsForm
              workOrderData={workOrderData}
              onSubmit={handleProductSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}
