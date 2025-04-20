"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Eye, Filter, Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DataTablePagination } from "@/components/data-table-pagination"

// Sample data for task history with added task type and incident type
const taskHistory = [
  {
    id: "TASK-0995",
    fileName: "report.docx",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    fileTime: "2023-04-10 09:32:10",
    createdTime: "2023-04-10 09:35:22",
    fileSize: "1.8 MB",
    status: "Completed",
    type: "File",
    incidentType: "Malware",
    date: new Date("2023-04-10"),
  },
  {
    id: "TASK-0996",
    fileName: "malware_sample.bin",
    sha256: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    fileTime: "2023-04-11 11:10:45",
    createdTime: "2023-04-11 11:12:30",
    fileSize: "3.2 MB",
    status: "Failed",
    type: "File",
    incidentType: "Ransomware",
    date: new Date("2023-04-11"),
  },
  {
    id: "TASK-0997",
    fileName: "system.dll",
    sha256: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f",
    fileTime: "2023-04-12 14:05:12",
    createdTime: "2023-04-12 14:10:00",
    fileSize: "0.7 MB",
    status: "Completed",
    type: "File",
    incidentType: "Malware",
    date: new Date("2023-04-12"),
  },
  {
    id: "TASK-0998",
    fileName: "setup.exe",
    sha256: "2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f",
    fileTime: "2023-04-13 16:22:33",
    createdTime: "2023-04-13 16:25:10",
    fileSize: "4.5 MB",
    status: "Completed",
    type: "File",
    incidentType: "None",
    date: new Date("2023-04-13"),
  },
  {
    id: "TASK-0999",
    fileName: "trojan.js",
    sha256: "3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f",
    fileTime: "2023-04-14 18:15:40",
    createdTime: "2023-04-14 18:20:05",
    fileSize: "0.3 MB",
    status: "Failed",
    type: "File",
    incidentType: "Malware",
    date: new Date("2023-04-14"),
  },
  {
    id: "TASK-1000",
    fileName: "https://phishing-site.com",
    sha256: "4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0a1b2c3d4e5f",
    fileTime: "2023-04-15 10:25:30",
    createdTime: "2023-04-15 10:30:45",
    fileSize: "N/A",
    status: "Completed",
    type: "URL",
    incidentType: "Phishing",
    date: new Date("2023-04-15"),
  },
  {
    id: "TASK-1001",
    fileName: "https://suspicious-domain.net/login.php",
    sha256: "5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f",
    fileTime: "2023-04-16 14:15:20",
    createdTime: "2023-04-16 14:20:35",
    fileSize: "N/A",
    status: "Completed",
    type: "URL",
    incidentType: "Phishing",
    date: new Date("2023-04-16"),
  },
  // Add more sample data to demonstrate pagination
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `TASK-${900 + i}`,
    fileName: `history_file_${i + 1}.exe`,
    sha256: `history_hash_${i + 1}_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
    fileTime: `2023-03-${(i % 30) + 1} 10:00:00`,
    createdTime: `2023-03-${(i % 30) + 1} 10:05:00`,
    fileSize: "1.0 MB",
    status: i % 2 === 0 ? "Completed" : "Failed",
    type: i % 2 === 0 ? "File" : "URL",
    incidentType: i % 4 === 0 ? "Malware" : i % 4 === 1 ? "Ransomware" : i % 4 === 2 ? "Phishing" : "None",
    date: new Date(`2023-03-${(i % 30) + 1}`),
  })),
]

// Filter options
const taskTypes = ["All", "File", "URL"]
const incidentTypes = ["All", "None", "Malware", "Ransomware", "Phishing"]
const statusTypes = ["All", "Completed", "Failed"]

export default function TaskHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [incidentFilter, setIncidentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [showFilters, setShowFilters] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredTasks = taskHistory.filter((task) => {
    // Text search filter
    const matchesSearch =
      task.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.sha256.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType = typeFilter === "All" || task.type === typeFilter

    // Incident filter
    const matchesIncident = incidentFilter === "All" || task.incidentType === incidentFilter

    // Status filter
    const matchesStatus = statusFilter === "All" || task.status === statusFilter

    // Date range filter
    const matchesDateFrom = !dateFrom || task.date >= dateFrom
    const matchesDateTo = !dateTo || task.date <= dateTo

    return matchesSearch && matchesType && matchesIncident && matchesStatus && matchesDateFrom && matchesDateTo
  })

  // Calculate pagination
  const totalItems = filteredTasks.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Ensure current page is valid after filtering or changing page size
  const validCurrentPage = Math.min(currentPage, totalPages)
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage)
  }

  // Get current page items
  const startIndex = (validCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const currentItems = filteredTasks.slice(startIndex, endIndex)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "Failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getIncidentColor = (incidentType: string) => {
    switch (incidentType) {
      case "Malware":
        return "bg-orange-500"
      case "Ransomware":
        return "bg-red-500"
      case "Phishing":
        return "bg-blue-500"
      case "None":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const resetFilters = () => {
    setTypeFilter("All")
    setIncidentFilter("All")
    setStatusFilter("All")
    setDateFrom(undefined)
    setDateTo(undefined)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  const activeFilterCount = [
    typeFilter !== "All",
    incidentFilter !== "All",
    statusFilter !== "All",
    !!dateFrom,
    !!dateTo,
  ].filter(Boolean).length

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Task History</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page when search changes
                }}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && <Badge className="ml-2 bg-primary">{activeFilterCount}</Badge>}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <div className="px-6 py-3 border-b">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Type:</span>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => {
                    setTypeFilter(value)
                    setCurrentPage(1) // Reset to first page when filter changes
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Incident:</span>
                <Select
                  value={incidentFilter}
                  onValueChange={(value) => {
                    setIncidentFilter(value)
                    setCurrentPage(1) // Reset to first page when filter changes
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select incident" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setCurrentPage(1) // Reset to first page when filter changes
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Date From:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground",
                      )}
                      onClick={() => {
                        if (dateFrom) {
                          setCurrentPage(1) // Reset to first page when filter changes
                        }
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => {
                        setDateFrom(date)
                        setCurrentPage(1) // Reset to first page when filter changes
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Date To:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground",
                      )}
                      onClick={() => {
                        if (dateTo) {
                          setCurrentPage(1) // Reset to first page when filter changes
                        }
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => {
                        setDateTo(date)
                        setCurrentPage(1) // Reset to first page when filter changes
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto">
                  <X className="mr-2 h-3 w-3" />
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        )}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>SHA256</TableHead>
                <TableHead>File Time</TableHead>
                <TableHead>Created Time</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Incident Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.fileName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-[150px]">{task.sha256}</TableCell>
                    <TableCell>{task.fileTime}</TableCell>
                    <TableCell>{task.createdTime}</TableCell>
                    <TableCell>{task.fileSize}</TableCell>
                    <TableCell>
                      <Badge className={getIncidentColor(task.incidentType)}>{task.incidentType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/tasks/history/${task.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No tasks found matching your filters. Try adjusting your search or filters.
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
  )
}
