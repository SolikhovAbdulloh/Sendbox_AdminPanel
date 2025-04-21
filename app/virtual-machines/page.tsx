"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, MoreHorizontal, Plus, Search } from "lucide-react";
import { DataTablePagination } from "@/components/data-table-pagination";

// Sample data for virtual machines
const virtualMachines = [
  {
    id: "VM-001",
    name: "Windows 10 Sandbox",
    osType: "Windows 10",
    status: "Running",
    ipAddress: "192.168.1.101",
    createdDate: "2023-01-15",
    lastUsed: "2023-04-15 14:32:10",
  },
  {
    id: "VM-002",
    name: "Ubuntu Server",
    osType: "Ubuntu 20.04 LTS",
    status: "Stopped",
    ipAddress: "192.168.1.102",
    createdDate: "2023-01-20",
    lastUsed: "2023-04-14 10:15:22",
  },
  {
    id: "VM-003",
    name: "Windows Server",
    osType: "Windows Server 2019",
    status: "Running",
    ipAddress: "192.168.1.103",
    createdDate: "2023-02-05",
    lastUsed: "2023-04-15 09:45:30",
  },
  {
    id: "VM-004",
    name: "Kali Linux",
    osType: "Kali Linux 2023.1",
    status: "Stopped",
    ipAddress: "192.168.1.104",
    createdDate: "2023-02-10",
    lastUsed: "2023-04-13 16:20:15",
  },
  {
    id: "VM-005",
    name: "macOS Sandbox",
    osType: "macOS Monterey",
    status: "Running",
    ipAddress: "192.168.1.105",
    createdDate: "2023-03-01",
    lastUsed: "2023-04-15 11:10:45",
  },
  // Add more sample data to demonstrate pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `VM-${String(6 + i).padStart(3, "0")}`,
    name: `VM-Sample-${i + 1}`,
    osType:
      i % 3 === 0
        ? "Windows 10"
        : i % 3 === 1
        ? "Ubuntu 20.04 LTS"
        : "CentOS 8",
    status: i % 2 === 0 ? "Running" : "Stopped",
    ipAddress: `192.168.1.${110 + i}`,
    createdDate: `2023-03-${(i % 30) + 1}`,
    lastUsed: `2023-04-${(i % 15) + 1} ${10 + (i % 10)}:${10 + (i % 50)}:${
      10 + (i % 50)
    }`,
  })),
];

export default function VirtualMachinesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredVMs = virtualMachines.filter(
    (vm) =>
      vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.osType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredVMs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is valid after filtering or changing page size
  const validCurrentPage = Math.min(currentPage, totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  // Get current page items
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredVMs.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-green-500";
      case "Stopped":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Virtual Machines</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search VMs..."
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when search changes
                }}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New VM
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>OS Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((vm, idx) => (
                  <TableRow key={vm.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{vm.name}</TableCell>
                    <TableCell>{vm.osType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vm.status)}>
                        {vm.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{vm.ipAddress}</TableCell>
                    <TableCell>{vm.createdDate}</TableCell>
                    <TableCell>{vm.lastUsed}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {vm.status === "Running" ? (
                            <DropdownMenuItem>Stop</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Start</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No virtual machines found matching your search. Try
                    adjusting your search term.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <DataTablePagination
            currentPage={validCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
