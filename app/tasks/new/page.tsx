"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileUp, Info, Send, X } from "lucide-react";
import { useCreateFile } from "@/share/hook/useQuery/useQueryAction";

// Sample data for dropdowns
const analysisPackages = [
  {
    value: "exe",
    label: "Windows Executable (exe)",
    description: "Analyzes Windows executable files",
  },
  {
    value: "dll",
    label: "Windows DLL (dll)",
    description: "Analyzes Windows DLL files",
  },
  {
    value: "pdf",
    label: "PDF Document (pdf)",
    description: "Analyzes PDF documents for malicious content",
  },
  {
    value: "doc",
    label: "Office Document (doc)",
    description: "Analyzes Microsoft Office documents",
  },
  {
    value: "zip",
    label: "Archive (zip)",
    description: "Extracts and analyzes archive contents",
  },
  {
    value: "js",
    label: "JavaScript (js)",
    description: "Analyzes JavaScript files",
  },
  {
    value: "url",
    label: "URL Analysis (url)",
    description: "Analyzes URLs and captures network traffic",
  },
];

const machines = [
  { value: "win10", label: "Windows 10 x64 #1" },
  // { value: "win10x64-2", label: "Windows 10 x64 #2" },
  // { value: "win7x86-1", label: "Windows 7 x86 #1" },
  // { value: "ubuntu2004-1", label: "Ubuntu 20.04 #1" },
  // { value: "macos-1", label: "macOS Monterey #1" },
];

export default function NewTaskPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preScriptRef = useRef<HTMLInputElement>(null);
  const duringScriptRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("file");
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [analysisPackage, setAnalysisPackage] = useState("");
  const [machine, setMachine] = useState("");
  const [options, setOptions] = useState("");
  const [priority, setPriority] = useState("medium");
  const [preScript, setPreScript] = useState<File | null>(null);
  const [duringScript, setDuringScript] = useState<File | null>(null);
  const { mutate, isSuccess, isPending, isError } = useCreateFile();

  const handleCancel = () => {
    router.push(`/tasks/active`);
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);

    // Auto-select analysis package based on file extension
    const extension = uploadedFile.name.split(".").pop()?.toLowerCase();
    if (extension) {
      const matchingPackage = analysisPackages.find(
        (pkg) => pkg.value === extension
      );
      if (matchingPackage) {
        setAnalysisPackage(matchingPackage.value);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handlePreScriptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPreScript(files[0]);
    }
  };

  const handleDuringScriptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setDuringScript(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerPreScriptInput = () => {
    preScriptRef.current?.click();
  };

  const triggerDuringScriptInput = () => {
    duringScriptRef.current?.click();
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ file, machine });
    console.log({
      // type: activeTab,
      file,
      // url,
      // analysisPackage,
      machine,
      // options,
      // priority,
      // preScript,
      // duringScript,
    });
  };
  useEffect(() => {
    if (isSuccess) {
      router.push("/tasks/active");
    }
  }, [isSuccess, router]);
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <Tabs
              defaultValue="file"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">File Upload</TabsTrigger>
                <TabsTrigger value="url">URL Input</TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-6 pt-4">
                <div className="grid gap-3">
                  <Label>Upload File for Analysis</Label>
                  <div
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      accept=".zip, .msi"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                    {file ? (
                      <div>
                        <FileUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-sm font-medium mb-1">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                        >
                          Change file
                        </Button>
                      </div>
                    ) : (
                      <>
                        <FileUp className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          Drag and drop your file here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports various file types for malware analysis
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-6 pt-4">
                <div className="grid gap-3">
                  <Label htmlFor="url-input">Suspicious URL</Label>
                  <Input
                    id="url-input"
                    placeholder="https://example.com/suspicious-page"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required={activeTab === "url"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL to analyze. The system will visit the URL and
                    capture network traffic and behavior.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="analysis-package">Analysis Package</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>
                          Select the appropriate analysis package based on the
                          file type you're analyzing.
                        </p>
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                          {analysisPackages.map((pkg) => (
                            <li key={pkg.value} className="text-xs">
                              <span className="font-semibold">
                                {pkg.label}:
                              </span>{" "}
                              {pkg.description}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={analysisPackage}
                  onValueChange={setAnalysisPackage}
                  required
                >
                  <SelectTrigger id="analysis-package">
                    <SelectValue placeholder="Select analysis package" />
                  </SelectTrigger>
                  <SelectContent>
                    {analysisPackages.map((pkg) => (
                      <SelectItem key={pkg.value} value={pkg.value}>
                        {pkg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="machine">Machine</Label>
                <Select value={machine} onValueChange={setMachine} required>
                  <SelectTrigger id="machine">
                    <SelectValue placeholder="Select machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="options">Options</Label>
              <Input
                id="options"
                placeholder="timeout=120,enforce_timeout=1,process_memory=1"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of options to pass to the analyzer (e.g.,
                timeout=120,enforce_timeout=1)
              </p>
            </div>

            <div className="grid gap-3">
              <Label>Priority</Label>
              <RadioGroup
                value={priority}
                onValueChange={setPriority}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low" className="cursor-pointer">
                    Low
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label htmlFor="priority-medium" className="cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high" className="cursor-pointer">
                    High
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-3">
                <Label>Python Pre-Execution Script (optional)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={preScriptRef}
                    className="hidden"
                    accept=".py"
                    onChange={handlePreScriptChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={triggerPreScriptInput}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    {preScript ? preScript.name : "Choose .py file"}
                  </Button>
                  {preScript && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreScript(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  This script will run before the main analysis starts
                </p>
              </div>

              <div className="grid gap-3">
                <Label>Python During-Execution Script (optional)</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={duringScriptRef}
                    className="hidden"
                    accept=".py"
                    onChange={handleDuringScriptChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    onClick={triggerDuringScriptInput}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    {duringScript ? duringScript.name : "Choose .py file"}
                  </Button>
                  {duringScript && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDuringScript(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  This script will run during the analysis process
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              {isPending ? "Loading..." : "Submit Task"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
}
