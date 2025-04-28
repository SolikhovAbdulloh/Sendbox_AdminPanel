"use client";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import React from "react";

// Sample data for task details
const taskDetails = {
  id: "TASK-0997",
  fileName: "hello.zip",
  status: "Completed",
  analysisInfo: {
    category: "Archive",
    package: "Zip",
    started: "2023-04-12 14:05:12",
    completed: "2023-04-12 14:10:00",
    duration: "4m 48s",
    options: "timeout=120,enforce_timeout=1",
    logs: ["cuckoo.log", "analysis.log"],
  },
  machineInfo: {
    name: "win10x64-1",
    os: "Windows 10 x64",
    manager: "VirtualBox",
    startedOn: "2023-04-12 14:05:15",
    shutdownOn: "2023-04-12 14:10:00",
  },
  fileDetails: {
    fileName: "hello.zip",
    fileType:
      "Zip archive data, at least v5.1 to extract, compression method=AES Encrypted",
    fileSize: "35701 bytes",
    md5: "aa19a88db99b687796502271ccd551b7",
    sha1: "95f39105a191f0bd4ec6859a08a0e65df0dddb6a",
    sha256: "0e63c86b93b22be65982ef9317005b319ea9bba896920d8704a538b8135a2f0b",
    sha3_384:
      "de2cf735507a716059c313d7ca5c526a60ca20306dcaaab19d369105e56dd43ec1bf508923fe544ac32905f793c8662d",
    crc32: "E2D2A769",
    tlsh: "T157F2F2C34A0AD11BDC9B38B0259E13A211630E271F22DC17BA7C53499E47B05EBEF15E",
    ssdeep:
      "768:vwOjw68Ee5YXmi1e0BJnJx6htc0OJqli4G4Bpro0uNjZDjb14h0:viNHYXmiJx6g013Bojdu0",
  },
  signatures: [
    "Checks available memory",
    "Queries computer hostname",
    "Attempts to connect to a dead IP:Port (1 unique times)",
    "Queries the keyboard layout",
    "Queries the computer locale (possible geofencing)",
    "SetUnhandledExceptionFilter detected (possible anti-debug)",
    "Possible date expiration check, exits too soon after checking local time",
    "Checks system language via registry key (possible geofencing)",
    "Resumed a thread in another process",
    "Tries to unhook or modify Windows functions monitored by CAPE",
    "A document or script file initiated network communications indicative of a potential exploit or payload download",
    "Attempts to modify Microsoft Office security settings",
    "The EQNEDT32 process established a network connection, potentially exploiting CVE-2017-11882",
  ],
  screenshots: [
    "/screenshots/screenshot1.jpg",
    "/screenshots/screenshot2.jpg",
    "/screenshots/screenshot3.jpg",
  ],
  summary: {
    accessedFiles: [
      "C:\\Windows\\System32\\kernel32.dll",
      "C:\\Windows\\System32\\user32.dll",
      "C:\\Users\\Admin\\AppData\\Local\\Temp\\hello.exe",
    ],
    readFiles: [
      "C:\\Windows\\System32\\config\\systemprofile\\AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files\\Content.IE5\\index.dat",
      "C:\\Windows\\System32\\drivers\\etc\\hosts",
    ],
    modifiedFiles: [
      "C:\\Users\\Admin\\AppData\\Local\\Temp\\temp.dat",
      "C:\\Users\\Admin\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\autorun.bat",
    ],
    deletedFiles: ["C:\\Users\\Admin\\AppData\\Local\\Temp\\~tmp0001.tmp"],
    registryKeys: [
      "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion",
      "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    ],
    readRegistryKeys: [
      "HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Nls\\Language",
      "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SystemRoot",
    ],
    modifiedRegistryKeys: [
      "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Malware",
      "HKEY_CURRENT_USER\\Software\\Microsoft\\Office\\Common\\Security\\Trusted",
    ],
    deletedRegistryKeys: [
      "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce\\DeleteMe",
    ],
    executedCommands: [
      "cmd.exe /c whoami",
      "powershell.exe -ExecutionPolicy Bypass -File script.ps1",
    ],
    mutexes: ["Global\\MalwareMutex", "Local\\TempMutex"],
    startedServices: ["MalwareService", "PersistenceService"],
  },
};

export default function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: taskId } = React.use(params);
  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Task Details: {taskId}</h1>
          <Badge className="bg-green-500 ml-2">{taskDetails.status}</Badge>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results for {taskDetails.fileName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analysis">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="analysis">Analysis Information</TabsTrigger>
              <TabsTrigger value="machine">Machine Information</TabsTrigger>
              <TabsTrigger value="file">File Details</TabsTrigger>
              <TabsTrigger value="signatures">Signatures</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            {/* Analysis Information Tab */}
            <TabsContent value="analysis" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">
                      Category
                    </TableCell>
                    <TableCell>{taskDetails.analysisInfo.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Package</TableCell>
                    <TableCell>{taskDetails.analysisInfo.package}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Started</TableCell>
                    <TableCell>{taskDetails.analysisInfo.started}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Completed</TableCell>
                    <TableCell>{taskDetails.analysisInfo.completed}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Duration</TableCell>
                    <TableCell>{taskDetails.analysisInfo.duration}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Options</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5">
                        {taskDetails.analysisInfo.options}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Log(s)</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {taskDetails.analysisInfo.logs.map((log) => (
                          <Button
                            key={log}
                            variant="link"
                            className="h-auto p-0 justify-start"
                          >
                            <Download className="mr-1 h-3 w-3" />
                            {log}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* Machine Information Tab */}
            <TabsContent value="machine" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">Name</TableCell>
                    <TableCell>{taskDetails.machineInfo.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">OS</TableCell>
                    <TableCell>{taskDetails.machineInfo.os}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Manager</TableCell>
                    <TableCell>{taskDetails.machineInfo.manager}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Started On</TableCell>
                    <TableCell>{taskDetails.machineInfo.startedOn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Shutdown On</TableCell>
                    <TableCell>{taskDetails.machineInfo.shutdownOn}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* File Details Tab */}
            <TabsContent value="file" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">
                      File Name
                    </TableCell>
                    <TableCell>{taskDetails.fileDetails.fileName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">File Type</TableCell>
                    <TableCell>{taskDetails.fileDetails.fileType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">File Size</TableCell>
                    <TableCell>{taskDetails.fileDetails.fileSize}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MD5</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {taskDetails.fileDetails.md5}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHA1</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {taskDetails.fileDetails.sha1}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHA256</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                          {taskDetails.fileDetails.sha256}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          title="VirusTotal"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">VirusTotal</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          title="MWDB"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">MWDB</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          title="Bazaar"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">Bazaar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHA3-384</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {taskDetails.fileDetails.sha3_384}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CRC32</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {taskDetails.fileDetails.crc32}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TLSH</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {taskDetails.fileDetails.tlsh}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ssdeep</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {taskDetails.fileDetails.ssdeep}
                      </code>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* Signatures Tab */}
            <TabsContent value="signatures" className="mt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Detected Behaviors</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {taskDetails.signatures.map((signature, index) => (
                    <li key={index} className="text-sm">
                      {signature}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Screenshots Tab */}
            <TabsContent value="screenshots" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {taskDetails.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="border rounded-md overflow-hidden"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={screenshot || "/placeholder.svg"}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="p-2 bg-muted">
                      <p className="text-xs text-center">
                        Screenshot {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Accessed Files</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.accessedFiles.map((file, index) => (
                        <li key={index} className="text-sm font-mono break-all">
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Read Files</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.readFiles.map((file, index) => (
                        <li key={index} className="text-sm font-mono break-all">
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Modified Files</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.modifiedFiles.map((file, index) => (
                        <li key={index} className="text-sm font-mono break-all">
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Deleted Files</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.deletedFiles.map((file, index) => (
                        <li key={index} className="text-sm font-mono break-all">
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Executed Commands
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.executedCommands.map(
                        (cmd, index) => (
                          <li
                            key={index}
                            className="text-sm font-mono break-all"
                          >
                            {cmd}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Registry Keys</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.registryKeys.map((key, index) => (
                        <li key={index} className="text-sm font-mono break-all">
                          {key}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Read Registry Keys
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.readRegistryKeys.map(
                        (key, index) => (
                          <li
                            key={index}
                            className="text-sm font-mono break-all"
                          >
                            {key}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Modified Registry Keys
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.modifiedRegistryKeys.map(
                        (key, index) => (
                          <li
                            key={index}
                            className="text-sm font-mono break-all"
                          >
                            {key}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Deleted Registry Keys
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.deletedRegistryKeys.map(
                        (key, index) => (
                          <li
                            key={index}
                            className="text-sm font-mono break-all"
                          >
                            {key}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Mutexes</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.mutexes.map((mutex, index) => (
                        <li key={index} className="text-sm font-mono break-all">
                          {mutex}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Started Services
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {taskDetails.summary.startedServices.map(
                        (service, index) => (
                          <li
                            key={index}
                            className="text-sm font-mono break-all"
                          >
                            {service}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
