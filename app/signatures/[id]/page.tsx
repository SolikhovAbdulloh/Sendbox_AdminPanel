"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Save, X } from "lucide-react";
import { useQueryApi } from "@/share/hook/useQuery";
import { useLanguage } from "@/contexts/language-context";
import { useEditSignature } from "@/share/hook/useQuery/useQueryAction";

interface Signature {
  id: string;
  name: string;
  category: string;
  description: string | null;
  rule: string;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  lastModifiedAt: string;
}

export default function SignatureDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: signatureId } = React.use(params);
  const { data, isLoading } = useQueryApi<Signature>({
    url: `/1/signature/signature/${signatureId}`,
    pathname: "signatureById",
  });
  const router = useRouter();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatureType, setSignatureType] = useState("");
  const [signatureCode, setSignatureCode] = useState("");

  const { mutate, isPending } = useEditSignature();

  // Sync state with fetched data
  useEffect(() => {
    if (data) {
      setSignatureName(data.name ?? "");
      setSignatureType(data.category ?? "");
      setSignatureCode(data.rule ?? "");
    }
  }, [data]);
  console.log({
    id: signatureId,

    type: signatureType,
    name: signatureName,
    rule: signatureCode,
  });

  const handleSave = async () => {
    try {
      await mutate(
        {
          id: signatureId,
          data: {
            type: signatureType,
            name: signatureName,
            rule: signatureCode,
          },
        },
        {
          onSuccess: () => {
            alert("Signature updated successfully!");
            router.push("/signatures");
          },
        }
      );
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update signature. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form values to original data
    setSignatureName(data?.name ?? "");
    setSignatureType(data?.category ?? "");
    setSignatureCode(data?.rule ?? "");
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent>
            <div className="text-center py-10">{t("common.loading")}</div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">
            Signature Details: {signatureId}
          </h1>
          <Badge className={getStatusColor(data?.status)}>{data?.status}</Badge>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Signature
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Signature Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="signature-name">Signature Name</Label>
                  {isEditing ? (
                    <Input
                      id="signature-name"
                      placeholder="Enter signature name"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      required
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/30">
                      {data?.name}
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="signature-type">Signature Type</Label>
                  {isEditing ? (
                    <Select
                      value={signatureType}
                      onValueChange={setSignatureType}
                    >
                      <SelectTrigger id="signature-type">
                        <SelectValue placeholder="Select signature type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yar">yar</SelectItem>
                        <SelectItem value="Regex">Regex</SelectItem>
                        <SelectItem value="Suricata">Suricata</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/30">
                      {data?.category}
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="grid gap-3">
                <Label htmlFor="signature-description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="signature-description"
                    value={signatureDescription}
                    onChange={(e) => setSignatureDescription(e.target.value)}
                    className="resize-none"
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/30">
                    {data?.description || "No description"}
                  </div>
                )}
              </div> */}

              <div className="grid gap-3">
                <Label htmlFor="signature-code">Rule Editor</Label>
                {isEditing ? (
                  <div className="relative border rounded-md overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted border-r flex flex-col text-xs text-muted-foreground select-none">
                      {(signatureCode || "").split("\n").map((_, i) => (
                        <div
                          key={i}
                          className="h-6 flex items-center justify-center"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <Textarea
                      id="signature-code"
                      value={signatureCode}
                      onChange={(e) => setSignatureCode(e.target.value)}
                      className="font-mono text-sm h-96 resize-none pl-12 pr-4 py-2 bg-muted/30 focus-visible:bg-background"
                      style={{ lineHeight: "1.5rem" }}
                      required
                    />
                  </div>
                ) : (
                  <div className="relative border rounded-md overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted border-r flex flex-col text-xs text-muted-foreground select-none">
                      {(data?.rule || "")
                        .split("\n")
                        .map((_: any, i: string) => (
                          <div
                            key={i}
                            className="h-6 flex items-center justify-center"
                          >
                            {i + 1}
                          </div>
                        ))}
                    </div>
                    <pre
                      className="font-mono text-sm overflow-auto h-96 pl-12 pr-4 py-2 bg-muted/30 m-0"
                      style={{ lineHeight: "1.5rem" }}
                    >
                      {data?.rule || "No rule defined"}
                    </pre>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label>Created By</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {data?.uploadedBy}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Created Date</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {data?.uploadedAt}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Last Modified</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {data?.lastModifiedAt}
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Status</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    <Badge className={getStatusColor(data?.status)}>
                      {data?.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Signature Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Matched On</TableHead>
                    <TableHead>Task ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Placeholder: Populate with actual match data */}
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No matches found
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
