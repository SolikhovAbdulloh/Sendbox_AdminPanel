'use client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getImageUrl } from '@/lib/api-config';
import { useAxios } from '@/share/hook/useAxios';
import { useQueryApi } from '@/share/hook/useQuery';
import { get } from 'lodash';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import path from 'path';
import React, { useState } from 'react';

// Utility function to map severity to color classes
function getSeverityColor(severity: number) {
  if (severity >= 4) return 'bg-red-500 text-white';
  if (severity === 3) return 'bg-orange-400 text-white';
  if (severity === 2) return 'bg-yellow-400 text-black';
  if (severity === 1) return 'bg-blue-400 text-white';
  return 'bg-gray-300 text-black';
}

export default function ApkTaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const getStatusColor = (severity: number | string) => {
    const sev = Number(severity);
    switch (sev) {
      case 1:
        return 'bg-green-900';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-red-500';
      default:
        return 'bg-green-900';
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const { id: taskId } = React.use(params);

  // Get category from URL search params
  const category = searchParams.get('category') || 'apk';

  const { data } = useQueryApi({
    url: `1/cape/tasks/get/screenshot/${taskId}`,
    pathname: 'screenphotos',
  });

  // APK-specific API call
  const {
    data: Taskinfo,
    isLoading,
    isFetching,
  } = useQueryApi({
    url: `1/cape/tasks/get/report/${taskId}?category=${category}`,
    pathname: 'apkTaskInformation',
  });

  console.log('APK Task Info:', Taskinfo);
  const downloadFile = async (taskId: string) => {
    try {
      const axios = useAxios();
      const response = await axios({
        url: `/1/cape/tasks/download/report/${taskId}`,
        method: 'GET',
      });

      const jsonData = JSON.stringify(response, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `apk_report_${taskId}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Faylni yuklab olishda xatolik:', error);
    }
  };

  if (isLoading || isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading APK task details...</p>
        </div>
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
          <h1 className="text-xl font-semibold">APK Task Details: {get(Taskinfo, 'md5')}</h1>
          <Badge className="bg-blue-500 ml-2">{get(Taskinfo, 'info.machine.status', 'APK')}</Badge>
        </div>
        <Button onClick={() => downloadFile(taskId)}>
          <Download className="mr-2 h-4 w-4" />
          Download APK Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>APK Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analysis">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="analysis">Analysis Info</TabsTrigger>
              <TabsTrigger value="machine">File Info</TabsTrigger>
              <TabsTrigger value="apk">APP Info</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="signatures">Signatures</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            {/* Analysis Information Tab */}
            <TabsContent value="analysis" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">Category</TableCell>
                    <TableCell>{get(Taskinfo, 'info.category', 'file')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Package</TableCell>
                    <TableCell>{path.extname(get(Taskinfo, 'file_name')) || 'null'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Created</TableCell>
                    <TableCell>{get(Taskinfo, 'timestamp', 'null')}</TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell className="font-medium">Completed</TableCell>
                    <TableCell>{get(Taskinfo, 'info.ended', 'null')}</TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell className="font-medium">Security Score</TableCell>
                    <TableCell>{get(Taskinfo, 'appsec.security_score', 'null')}/100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Trackers Detection</TableCell>
                    <TableCell>
                      {get(Taskinfo, 'trackers.detected_trackers', 'null')}/
                      {get(Taskinfo, 'trackers.total_trackers', 'null')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* File Information Tab */}
            <TabsContent value="machine" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">File Name</TableCell>
                    <TableCell>{get(Taskinfo, 'file_name', 'Android')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Size</TableCell>
                    <TableCell>{get(Taskinfo, 'size', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MD5</TableCell>
                    <TableCell>{get(Taskinfo, 'md5', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHA1</TableCell>
                    <TableCell>{get(Taskinfo, 'sha1', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHA256</TableCell>
                    <TableCell>{get(Taskinfo, 'sha256', 'null')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* App Info Tab */}
            <TabsContent value="apk" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">App Name</TableCell>
                    <TableCell>{get(Taskinfo, 'app_name', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Package Name</TableCell>
                    <TableCell>{get(Taskinfo, 'package_name', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Main Activity</TableCell>
                    <TableCell>{get(Taskinfo, 'main_activity', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Target SDK</TableCell>
                    <TableCell>{get(Taskinfo, 'target_sdk', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Min SDK</TableCell>
                    <TableCell>{get(Taskinfo, 'min_sdk', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Max SDK</TableCell>
                    <TableCell>{get(Taskinfo, 'max_sdk', 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Android Version Name</TableCell>
                    <TableCell>{get(Taskinfo, 'version_name', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Android Version Code</TableCell>
                    <TableCell>{get(Taskinfo, 'version_code', 'null')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">APK Permissions</h3>
                {Array.isArray(get(Taskinfo, 'apkinfo.permissions', [])) &&
                get(Taskinfo, 'apkinfo.permissions', []).length > 0 ? (
                  <ul className="space-y-2">
                    {get(Taskinfo, 'apkinfo.permissions', []).map(
                      (permission: string, index: number) => (
                        <li key={index} className="border rounded-md p-3 bg-gray-50">
                          <code className="text-sm font-mono">{permission}</code>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p>No permissions found.</p>
                )}
              </div>
            </TabsContent>

            {/* Signatures Tab */}
            <TabsContent value="signatures" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detected Behaviors</h3>
                {Array.isArray(get(Taskinfo, 'signatures', [])) &&
                get(Taskinfo, 'signatures', []).length > 0 ? (
                  <ul className="space-y-2">
                    {get(Taskinfo, 'signatures', []).map((signature: any, index: number) => (
                      <li
                        key={index}
                        className={`border rounded-md p-4 ${getStatusColor(signature.severity)}`}
                      >
                        <h4
                          className={`text-md font-semibold ${
                            signature.severity == 2 ? 'text-black' : 'text-white'
                          }`}
                        >
                          {signature.description || 'Unknown Name'}
                        </h4>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No signatures detected.</p>
                )}
              </div>
            </TabsContent>

            {/* Screenshots Tab - Same as original */}
            <TabsContent value="screenshots" className="mt-6">
              <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(330px,1fr))]">
                {data?.map((screenshot: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-md overflow-hidden w-[300px] h-[230px]"
                    onClick={() => setSelectedImage(screenshot)}
                  >
                    <div className="relative cursor-pointer">
                      <img
                        src={`${getImageUrl(screenshot)}` || '/placeholder.svg'}
                        alt={`Screenshot ${index + 1}`}
                        className="object-contain bg-[green]"
                      />
                    </div>
                    <div className="p-2 bg-muted">
                      <p className="text-xs text-center">Screenshot {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Modal code same as original */}
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="mt-4">
              <div className="flex flex-col justify-start gap-6">
                <div className="space-y-4">
                  {/* APK-specific summary data */}
                  {Taskinfo?.apkinfo?.activities?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Activities</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {get(Taskinfo, 'apkinfo.activities', []).map(
                          (activity: string, index: number) => (
                            <li key={index} className="text-sm font-mono break-all">
                              {activity}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {Taskinfo?.apkinfo?.services?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Services</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {get(Taskinfo, 'apkinfo.services', []).map(
                          (service: string, index: number) => (
                            <li key={index} className="text-sm font-mono break-all">
                              {service}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {Taskinfo?.apkinfo?.receivers?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Receivers</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {get(Taskinfo, 'apkinfo.receivers', []).map(
                          (receiver: string, index: number) => (
                            <li key={index} className="text-sm font-mono break-all">
                              {receiver}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
