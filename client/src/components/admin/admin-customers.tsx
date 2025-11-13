import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, Booking } from "@shared/schema";
import { format } from "date-fns";

export function AdminCustomers() {
  const { data: customers = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/customers"],
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  const getCustomerBookings = (userId: string) => {
    return bookings.filter((b) => b.userId === userId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-semibold mb-2" data-testid="text-customers-title">
          Customer Management
        </h2>
        <p className="text-muted-foreground">
          View all registered customers and their booking history
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const customerBookings = getCustomerBookings(customer.id);
                return (
                  <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {customer.firstName?.[0] || customer.email?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {customer.firstName && customer.lastName
                              ? `${customer.firstName} ${customer.lastName}`
                              : customer.firstName || "Customer"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Badge variant={customer.role === "admin" ? "default" : "secondary"}>
                        {customer.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{customerBookings.length} bookings</Badge>
                    </TableCell>
                    <TableCell>
                      {customer.createdAt
                        ? format(new Date(customer.createdAt), "MMM d, yyyy")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {customers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No customers yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
