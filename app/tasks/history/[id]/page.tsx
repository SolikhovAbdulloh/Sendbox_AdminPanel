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
import * as Dialog from '@radix-ui/react-dialog';
import { get } from 'lodash';
import { ArrowLeft, Download, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Utility function to map severity to color classes
function getSeverityColor(severity: number) {
  if (severity >= 4) return 'bg-red-500 text-white';
  if (severity === 3) return 'bg-orange-400 text-white';
  if (severity === 2) return 'bg-yellow-400 text-black';
  if (severity === 1) return 'bg-blue-400 text-white';
  return 'bg-gray-300 text-black';
}

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
  const [selectedImage, setSelectedImage] = useState(null);
  const { id: taskId } = React.use(params);
  const { data } = useQueryApi({
    url: `1/cape/tasks/get/screenshot/${taskId}`,
    pathname: 'screenphotos',
  });
  const {
    data: Taskinfo,
    isLoading,
    isFetching,
  } = useQueryApi({
    url: `1/cape/tasks/get/report/${taskId}?category=${'file'}`,
    pathname: 'taskInformation',
  });

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
      link.setAttribute('download', `report_${taskId}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Faylni yuklab olishda xatolik:', error);
    }
  };
  const downloadLogFIle = async (taskId: string) => {
    const axios = useAxios();
    const response = await axios({
      url: `/1/cape/tasks/download/log/${taskId}`,
      method: 'GET',
    });

    // const jsonData = JSON.stringify(response, null, 4);

    const blob = new Blob([response], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `log${taskId}.log`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  if (isLoading || isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading task details...</p>
        </div>
      </DashboardLayout>
    );
  }
  // console.log(Taskinfo?.target?.file);

  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Task Details: {taskId}</h1>
          <Badge className="bg-green-500 ml-2">
            {' '}
            {get(Taskinfo, 'info.machine.status', '123')}
          </Badge>
        </div>
        <Button onClick={() => downloadFile(taskId)}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results for </CardTitle>
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
                    <TableCell className="font-medium w-1/4">Category</TableCell>
                    <TableCell>{get(Taskinfo, 'info.category', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Package</TableCell>
                    <TableCell>{get(Taskinfo, 'info.package', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Started</TableCell>
                    <TableCell>{get(Taskinfo, 'info.started', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Completed</TableCell>
                    <TableCell>{get(Taskinfo, 'info.ended', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Duration</TableCell>
                    <TableCell>{get(Taskinfo, 'info.duration', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Options</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5">
                        {get(Taskinfo, 'info.options.isolated', 'password')}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Log(s)</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => downloadLogFIle(taskId)}
                          variant="link"
                          className="h-auto p-0 justify-start"
                        >
                          <Download className="mr-1 h-3 w-3" />
                        </Button>
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
                    <TableCell>{get(Taskinfo, 'target.file.name', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">OS</TableCell>
                    <TableCell>{get(Taskinfo, 'info.machine.platform', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Manager</TableCell>
                    <TableCell>{get(Taskinfo, 'info.machine.manager', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Started On</TableCell>
                    <TableCell>{get(Taskinfo, 'info.machine.started_on', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Shutdown On</TableCell>
                    <TableCell>{get(Taskinfo, 'info.machine.shutdown_on', 'null')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* File Details Tab */}
            <TabsContent value="file" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">File Name</TableCell>
                    <TableCell>{get(Taskinfo, 'target.file.name', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">File Type</TableCell>
                    <TableCell>{get(Taskinfo, 'target.file.type', 'null')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">File Size</TableCell>
                    <TableCell>
                      {get(Taskinfo, 'target.file2.size', 'null') / (1024 * 1024)} MB
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MD5</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {get(Taskinfo, 'target.file2.md5', 'null')}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHA1</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {get(Taskinfo, 'target.file2.sha1', 'null')}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SHA256</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                          {get(Taskinfo, 'target.file2.sha256', 'null')}
                        </code>
                        <Button variant="ghost" size="icon" className="h-6 w-6" title="VirusTotal">
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">VirusTotal</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" title="MWDB">
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">MWDB</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" title="Bazaar">
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
                        {get(Taskinfo, 'target.file2.sha3_384', 'null')}
                      </code>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CRC32</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {get(Taskinfo, 'target.file2.crc32', 'null')}
                      </code>
                    </TableCell>
                  </TableRow>
                  {Taskinfo?.target?.file2?.tlsh && (
                    <TableRow>
                      <TableCell className="font-medium">TLSH</TableCell>
                      <TableCell>
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                          {get(Taskinfo, 'target.file2.tlsh', 'null')}
                        </code>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Ssdeep</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {get(Taskinfo, 'target.file2.ssdeep', 'null')}
                      </code>
                    </TableCell>
                  </TableRow>
                  {Taskinfo?.target?.file?.yara[0] && (
                    <TableRow>
                      <TableCell className="font-medium w-1/4">Yara</TableCell>
                      <TableCell>
                        <div className="flex gap-3 items-center justify-items-start text-20">
                          <span className="hover:text-[red] justify-start">
                            {get(Taskinfo, 'target.file.yara[0].name')}
                          </span>
                          <span>{get(Taskinfo, 'target.file.yara[0].meta.description')}</span>
                          Author:{get(Taskinfo, 'target.file.yara[0].meta.author')}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                        className={`border rounded-md p-4  ${getStatusColor(signature.severity)}`}
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

            {/* Screenshots Tab */}
            {/* // ...existing code... */}
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
              <Dialog.Root
                open={!!selectedImage}
                onOpenChange={open => {
                  if (!open) setSelectedImage(null);
                }}
              >
                <Dialog.Portal>
                  <Dialog.Overlay
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSelectedImage(null)}
                  />
                  <Dialog.Content
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    onClick={() => setSelectedImage(null)}
                  >
                    <div
                      className="relative w-full max-w-4xl max-h-[90vh] overflow-auto"
                      onClick={e => e.stopPropagation()}
                    >
                      <Dialog.Title className="text-xl font-semibold mb-2">
                        Image Preview
                      </Dialog.Title>
                      <img
                        src={selectedImage ? getImageUrl(selectedImage) : '/placeholder.svg'}
                        alt="Zoomed Screenshot"
                        width={1200}
                        height={800}
                        className="rounded-lg object-contain"
                      />
                    </div>
                    <Dialog.Close asChild>
                      <button
                        aria-label="close"
                        className="absolute top-3 right-5 rounded-full p-4 bg-black/70 text-white hover:bg-black transition"
                      >
                        <X size={25} />
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </TabsContent>

            <TabsContent value="summary" className="mt-4">
              <div className="flex flex-col justify-start gap-6">
                <div className="space-y-4">
                  {Taskinfo?.behavior?.summary?.files?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Accessed Files</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {get(Taskinfo, 'behavior.summary.files', []).map(
                          (file: string, index: number | string) => (
                            <li key={index} className="text-sm font-mono break-all">
                              {file}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {Taskinfo?.behavior?.summary?.read_files?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Read Files</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {get(Taskinfo, 'behavior.summary.read_files', []).map(
                          (file: string, index: number | string) => (
                            <li key={index} className="text-sm font-mono break-all">
                              {file}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {Taskinfo?.behavior?.summary?.delete_files?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Deleted Files</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {get(Taskinfo, 'behavior.summary.delete_files', []).map(
                          (file: string, index: number | string) => (
                            <li key={index} className="text-sm font-mono break-all">
                              {file}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {Taskinfo?.behavior?.summary?.executed_commands?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Executed Commands</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {get(Taskinfo, 'behavior.summary.executed_commands', []).map(
                          (file: string, index: number | string) => (
                            <li key={index} className="text-sm font-mono break-all">
                              {file}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                {Taskinfo?.behavior?.summary?.keys?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Registry Keys</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {get(Taskinfo, 'behavior.summary.keys', []).map(
                        (file: string, index: number | string) => (
                          <li key={index} className="text-sm font-mono break-all">
                            {file}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
                {Taskinfo?.behavior?.summary?.read_keys?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Read Registry Keys</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {get(Taskinfo, 'behavior.summary.read_keys', []).map(
                        (file: string, index: number | string) => (
                          <li key={index} className="text-sm font-mono break-all">
                            {file}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {Taskinfo?.behavior?.summary?.delete_keys?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Deleted Registry Keys</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {get(Taskinfo, 'behavior.summary.delete_keys', []).map(
                        (file: string, index: number | string) => (
                          <li key={index} className="text-sm font-mono break-all">
                            {file}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
                {Taskinfo?.behavior?.started?.services?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Mutexes</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {get(Taskinfo, 'behavior.summary.mutexes', []).map(
                        (file: string, index: number | string) => (
                          <li key={index} className="text-sm font-mono break-all">
                            {file}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
                {Taskinfo?.behavior?.started?.services?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Started Services</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {get(Taskinfo, 'behavior.started.services', []).map(
                        (file: string, index: number | string) => (
                          <li key={index} className="text-sm font-mono break-all">
                            {file}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
