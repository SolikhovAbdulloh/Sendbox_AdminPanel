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
import { useQueryApi } from "@/share/hook/useQuery";
import { useLanguage } from "@/contexts/language-context";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useractiveSignature,
  userDeactiveSignature,
} from "@/share/hook/useQuery/useQueryAction";

// Sample data for signatures

export default function SignaturesPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const page = parseInt(searchParams.get("page") || "1");
  const { data, isLoading } = useQueryApi<{}>({
    url: `/1/signature/all?page=${page}&limit=100`,
    pathname: "signatures",
  });

  const filteredSignatures = data?.filter(
    (sig: any) =>
      sig?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sig?.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredSignatures?.length || [];
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is valid after filtering or changing page size
  const validCurrentPage = Math.min(currentPage, totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  // Get current page items
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredSignatures?.slice(startIndex, endIndex) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-green-500";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams);
    const currentPage = parseInt(params.get("page") || "1");
    params.set("page", String(currentPage >= 7 ? 1  : currentPage + 1));
    router.push(`?${params.toString()}`);
  };
  const handleBackPage = () => {
    const params = new URLSearchParams(searchParams);
    const currentPage = parseInt(params.get("page") || "1");
    params.set("page", String(currentPage == 1 ? 1 : currentPage - 1));
    router.push(`?${params.toString()}`);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);

    setCurrentPage(1); // Reset to first page when page size changes
  };
  const { mutate: Deactivate, isPending: DeactivatePanding } =
    userDeactiveSignature();
  const { mutate: activate, isPending: ActivatePanding } =
    useractiveSignature();
  function Active(id: string) {
    activate(id);
  }
  function Deactive(id: string) {
    Deactivate(id);
  }
  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>{t("tasks.historyTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">{t("common.loading")}</div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("signatures.title")}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("signatures.searchPlaceholder")}
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
                {t("signatures.newTitle")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>{t("signatures.name")}</TableHead>
                <TableHead>{t("signatures.type")}</TableHead>
                <TableHead>{t("signatures.createdBy")}</TableHead>
                <TableHead>{t("signatures.createdDate")}</TableHead>
                <TableHead>{t("signatures.lastModified")}</TableHead>
                <TableHead>{t("signatures.status")}</TableHead>
                <TableHead className="text-right">
                  {t("signatures.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((sig: any, index: string) => (
                  <TableRow key={sig.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{sig.name}</TableCell>
                    <TableCell>{sig.type}</TableCell>
                    <TableCell>{sig.uploadedBy.username}</TableCell>
                    <TableCell>{sig.createdAt}</TableCell>
                    <TableCell>{sig.lastModifiedAt}</TableCell>
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
                          {sig.status === "active" ? (
                            <DropdownMenuItem onClick={() => Deactive(sig.id)}>
                              {ActivatePanding ? "loading" : "Deactivate"}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => Active(sig.id)}>
                              {DeactivatePanding ? "loading" : "Activate"}
                            </DropdownMenuItem>
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
            nextpage={handleNextPage}
            backpage={handleBackPage}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
