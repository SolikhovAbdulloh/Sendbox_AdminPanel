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
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import Link from "next/link";
import { DataTablePagination } from "@/components/data-table-pagination";

// Sample data for signatures
const signatures = [
  {
    id: "SIG-001",
    name: "Ransomware Detection",
    type: "YARA",
    createdBy: "John Doe",
    createdDate: "2023-01-15",
    lastModified: "2023-04-10 14:32:10",
    status: "Active",
  },
  {
    id: "SIG-002",
    name: "Phishing Email Pattern",
    type: "Regex",
    createdBy: "Jane Smith",
    createdDate: "2023-01-20",
    lastModified: "2023-04-05 10:15:22",
    status: "Active",
  },
  {
    id: "SIG-003",
    name: "Malware Behavior",
    type: "YARA",
    createdBy: "Mike Johnson",
    createdDate: "2023-02-05",
    lastModified: "2023-04-12 09:45:30",
    status: "Inactive",
  },
  {
    id: "SIG-004",
    name: "Suspicious Network Traffic",
    type: "Suricata",
    createdBy: "Sarah Williams",
    createdDate: "2023-02-10",
    lastModified: "2023-03-20 16:20:15",
    status: "Active",
  },
  {
    id: "SIG-005",
    name: "Data Exfiltration",
    type: "YARA",
    createdBy: "David Brown",
    createdDate: "2023-03-01",
    lastModified: "2023-04-01 11:10:45",
    status: "Active",
  },
  // Add more sample data to demonstrate pagination
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `SIG-${String(6 + i).padStart(3, "0")}`,
    name: `Signature-Sample-${i + 1}`,
    type: i % 3 === 0 ? "YARA" : i % 3 === 1 ? "Regex" : "Suricata",
    createdBy:
      i % 4 === 0
        ? "John Doe"
        : i % 4 === 1
        ? "Jane Smith"
        : i % 4 === 2
        ? "Mike Johnson"
        : "Sarah Williams",
    createdDate: `2023-03-${(i % 30) + 1}`,
    lastModified: `2023-04-${(i % 15) + 1} ${10 + (i % 10)}:${10 + (i % 50)}:${
      10 + (i % 50)
    }`,
    status: i % 5 === 0 ? "Inactive" : "Active",
  })),
];

export default function SignaturesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredSignatures = signatures.filter(
    (sig) =>
      sig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredSignatures.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is valid after filtering or changing page size
  const validCurrentPage = Math.min(currentPage, totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  // Get current page items
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredSignatures.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
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
          <CardTitle>Signatures</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search signatures..."
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when search changes
                }}
              />
            </div>
            <Button asChild>
              <Link href="/signatures/new">
                <Plus className="mr-2 h-4 w-4" />
                New Signature
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((sig, idx) => (
                  <TableRow key={sig.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium">{sig.name}</TableCell>
                    <TableCell>{sig.type}</TableCell>
                    <TableCell>{sig.createdBy}</TableCell>
                    <TableCell>{sig.createdDate}</TableCell>
                    <TableCell>{sig.lastModified}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sig.status)}>
                        {sig.status}
                      </Badge>
                    </TableCell>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/signatures/${sig.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {sig.status === "Active" ? (
                            <DropdownMenuItem>Deactivate</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Activate</DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
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
                    No signatures found matching your search. Try adjusting your
                    search term.
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
