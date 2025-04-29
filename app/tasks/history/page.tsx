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
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Eye, Filter, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "@/components/data-table-pagination";
import { useQueryApi } from "@/share/hook/useQuery";
import { useLanguage } from "@/contexts/language-context";

// Filter options
const taskTypes = ["All", "File", "URL"];
const incidentTypes = ["All", "None", "Malware", "Ransomware", "Phishing"];
const statusTypes = ["All", "Completed", "Failed"];

export default function TaskHistoryPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [incidentFilter, setIncidentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Format dates for API query
  const formatDateForApi = (date?: Date) =>
    date ? format(date, "yyyy-MM-dd") : "";

  // Construct API query URL with dynamic filters and pagination (no search parameter)
  const { data, isLoading } = useQueryApi({
    url: `/1/cape/tasks/list/history?page=${currentPage}&limit=${pageSize}&status=${
      statusFilter === "All" ? "all" : statusFilter.toLowerCase()
    }&category=${
      typeFilter === "All" ? "all" : typeFilter.toLowerCase()
    }&incidentType=${
      incidentFilter === "All" ? "all" : incidentFilter.toLowerCase()
    }${dateFrom ? `&startedAt=${formatDateForApi(dateFrom)}` : ""}${
      dateTo ? `&completedAt=${formatDateForApi(dateTo)}` : ""
    }`,
    pathname: "history",
  });

  // Handle loading state
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

  // Extract tasks and pagination metadata from API response
  const tasks = data || [];
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch =
      task.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.sha256?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  const totalItems = filteredTasks.length; // Use filteredTasks.length for client-side filtering
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
      case "reported":
        return "bg-green-500";
      case "completed":
        return "bg-yellow-500";
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
      case "None":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const resetFilters = () => {
    setTypeFilter("All");
    setIncidentFilter("All");
    setStatusFilter("All");
    setDateFrom(undefined);
    setDateTo(undefined);
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
    typeFilter !== "All",
    incidentFilter !== "All",
    statusFilter !== "All",
    !!dateFrom,
    !!dateTo,
    !!searchTerm,
  ].filter(Boolean).length;

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("tasks.historyTitle")}</CardTitle>
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
          </div>
        </CardHeader>
        {showFilters && (
          <div className="px-6 py-3 border-b">
            <div className="flex flex-wrap items-center gap-4 mb-3">
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
                    <SelectValue placeholder={t("common.selectType")} />
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
                    <SelectValue placeholder={t("common.selectIncident")} />
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t("tasks.status")}:
                </span>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder={t("common.selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All"
                          ? t("common.all")
                          : t(`tasks.${status.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("From")}:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : t("selectDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => {
                        setDateFrom(date);
                        setCurrentPage(1);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("To")}:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : t("selectDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => {
                        setDateTo(date);
                        setCurrentPage(1);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="ml-auto"
                >
                  <X className="mr-2 h-3 w-3" />
                  {t("common.resetFilters")}
                </Button>
              )}
            </div>
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
                <TableHead>{t("tasks.status")}</TableHead>
                <TableHead className="text-right">
                  {t("tasks.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((task: any, index: string) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {task.filename}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[150px]">
                      {task.sha256}
                    </TableCell>
                    <TableCell>{task.startedAt}</TableCell>
                    <TableCell>{task.completedAt}</TableCell>
                    <TableCell>{task.fileSizeMB}</TableCell>
                    <TableCell>
                      <Badge className={getIncidentColor(task.incidentType)}>
                        {task.incidentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {t(`tasks.${task.status.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/tasks/history/${task.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">
                            {t("tasks.viewDetails")}
                          </span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
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
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
