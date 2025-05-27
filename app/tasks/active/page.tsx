"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, X as CloseIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/data-table-pagination";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useQueryApi } from "@/share/hook/useQuery";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";

// Available statuses, types, and incident types for filtering
const statuses = ["All", "Running", "Pending", "Analyzing"];
const taskTypes = ["All", "File", "URL"];
const incidentTypes = ["All", "Unknown", "Malware", "Ransomware", "Phishing"];

export default function ActiveTasksPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [incidentFilter, setIncidentFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const router = useRouter();

  // Fetch data using useQueryApi
  const { data, isLoading } = useQueryApi({
    url: `/1/cape/tasks/list/active?page=${page}&limit=20&status=${statusFilter.toLowerCase()}&category=${typeFilter.toLowerCase()}&incidentType=${incidentFilter.toLowerCase()}`,
    pathname: "tasks",
  });

  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams);
    const currentPage = parseInt(params.get("page") || "1");
    params.set("page", String(currentPage >= 7 ? 1 : currentPage + 1));
    router.push(`?${params.toString()}`);
  };

  const handleBackPage = () => {
    const params = new URLSearchParams(searchParams);
    const currentPage = parseInt(params.get("page") || "1");
    params.set("page", String(currentPage === 1 ? 1 : currentPage - 1));
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>{t("tasks.activeTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10">{t("common.loading")}</div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Extract tasks from data
  const tasks = data || [];

  // Filter tasks based on search term
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch =
      task.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.sha256?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate pagination
  const totalItems = data?.totalItems || filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is valid
  const validCurrentPage = Math.min(currentPage, totalPages);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  // Get current page items
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = filteredTasks.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "analyzing":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getIncidentColor = (incidentType: string) => {
    switch (incidentType) {
      case "Malware":
        return "bg-orange-500";
      case "Ransomware":
        return "bg-red-500";
      case "Phishing":
        return "bg-blue-500";
      case "Unknown":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const resetFilters = () => {
    setStatusFilter("All");
    setTypeFilter("All");
    setIncidentFilter("All");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const activeFilterCount = [
    statusFilter !== "All",
    typeFilter !== "All",
    incidentFilter !== "All",
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("tasks.activeTitle")}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("tasks.searchPlaceholder")}
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {t("common.filters")}
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-primary">{activeFilterCount}</Badge>
              )}
            </Button>
            <Button asChild>
              <Link href="/tasks/new">
                <Plus className="mr-2 h-4 w-4" />
                {t("common.newTask")}
              </Link>
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <div className="px-6 py-2 border-b flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t("tasks.status")}:</span>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All"
                        ? t("common.all")
                        : t(`tasks.${status.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t("tasks.type")}:</span>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All" ? t("common.all") : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {t("tasks.incidentType")}:
              </span>
              <Select
                value={incidentFilter}
                onValueChange={(value) => {
                  setIncidentFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All" ? t("common.all") : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-auto"
              >
                <CloseIcon className="mr-2 h-3 w-3" />
                {t("common.resetFilters")}
              </Button>
            )}
          </div>
        )}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>{t("tasks.fileName")}</TableHead>
                <TableHead>{t("tasks.type")}</TableHead>
                <TableHead>{t("tasks.sha256")}</TableHead>
                <TableHead>{t("tasks.fileTime")}</TableHead>
                <TableHead>{t("tasks.createdTime")}</TableHead>
                <TableHead>{t("tasks.fileSize")}</TableHead>
                <TableHead>{t("tasks.incidentType")}</TableHead>
                <TableHead>{t("common.view")}</TableHead>
                <TableHead>{t("common.delete")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((task: any, index: number) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {task.filename}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[150px]">
                      {task.sha256 ? task.sha256 : "not info"}
                    </TableCell>
                    <TableCell>
                      {task.startedAt ? task.startedAt : "N/A"}
                    </TableCell>
                    <TableCell>
                      {task.completedAt ? task.completedAt : "N/A"}
                    </TableCell>
                    <TableCell>{task.fileSizeMB || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={getIncidentColor(task.incidentType)}>
                        {task.incidentType || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4 hover:text-blue-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full max-h-[80vh] p-6">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-medium">
                              {t("tasks.remoteDesktop")} - {task.filename}
                            </DialogTitle>
                            <DialogClose asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4"
                              >
                                <CloseIcon className="h-4 w-4" />
                              </Button>
                            </DialogClose>
                          </DialogHeader>
                          <div className="flex-1 overflow-hidden">
                            <iframe
                              src="http://192.168.122.1:6080/vnc_lite.html" // Replace with dynamic/task-specific URL if needed
                              className="w-full h-[60vh] border-0 rounded-md"
                              title="Remote Desktop"
                              allowFullScreen
                            />
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">
                                {t("common.close")}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon">
                        <Trash2
                          size={18}
                          className="cursor-pointer hover:text-red-500"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    {t("tasks.noTasksFound")}
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
            nextpage={handleNextPage}
            backpage={handleBackPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
