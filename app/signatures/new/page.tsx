'use client';

import type React from 'react';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/language-context';
import { useUploadSignature } from '@/share/hook/useQuery/useQueryAction';
import { AlertCircle, FileUp, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function NewSignaturePage() {
  const router = useRouter();
  const { t } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [signatureName, setSignatureName] = useState('');
  const [signatureType, setSignatureType] = useState('YARA');
  const [signatureCode, setSignatureCode] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { mutate, isPending, isSuccess } = useUploadSignature();

  const payload = {
    name: signatureName,
    type: signatureType,
    rule: signatureCode,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      alert('Fayl tanlanmadi');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    mutate(formData);
  };
  useEffect(() => {
    if (isSuccess) {
      router.push('/signatures');
    }
  }, [isSuccess]);

  const handleCancel = () => {
    router.push('/signatures');
  };

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let detectedType = 'Custom';

    if (fileExtension === 'yar' || fileExtension === 'yara') {
      detectedType = 'YARA';
    } else if (fileExtension === 'rules' || fileExtension === 'rule') {
      detectedType = 'Suricata';
    } else if (fileExtension === 'regex' || fileExtension === 'txt') {
      detectedType = 'Regex';
    }

    // Read file content
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;

        // Extract name from file name (remove extension)
        const fileName = file.name.replace(/\.[^/.]+$/, '');

        // Set form values based on file content
        setSignatureName(fileName);
        setSignatureType(detectedType);
        setSignatureCode(content);

        // Try to extract description from YARA rules
        if (detectedType === 'YARA') {
          const descriptionMatch = content.match(/description\s*=\s*["']([^"']+)["']/i);
          if (descriptionMatch && descriptionMatch[1]) {
          }
        }

        setUploadSuccess(`File "${file.name}" uploaded successfully.`);
      } catch (error) {
        console.error('Error parsing file:', error);
        setUploadError('Failed to parse the signature file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading the file. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
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

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>{t('signatures.create')}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* File Upload Section */}
            <div className="grid gap-3">
              <Label>{t('signatures.uploadSignature')}</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".yar,.yara,.rules,.rule,.regex,.txt"
                  onChange={handleFileInputChange}
                />
                <FileUp className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">{t('signatures.dragDropSignature')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('signatures.supportsSignatureTypes')}
                </p>
              </div>
            </div>

            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            {uploadSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{uploadSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-3">
              <Label htmlFor="signature-name">{t('signatures.signatureName')}</Label>
              <Input
                id="signature-name"
                placeholder="Enter signature name"
                value={signatureName}
                onChange={e => setSignatureName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="signature-type">{t('signatures.signatureType')}</Label>
              <Select value={signatureType} onValueChange={setSignatureType}>
                <SelectTrigger id="signature-type">
                  <SelectValue placeholder="Select signature type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yar">YARA</SelectItem>
                  {/* <SelectItem value="Regex">Regex</SelectItem>
                  <SelectItem value="Suricata">Suricata</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="signature-code">{t('signatures.ruleEditor')}</Label>
              <div className="relative border rounded-md overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted border-r flex flex-col text-xs text-muted-foreground select-none">
                  {signatureCode.split('\n').map((_, i) => (
                    <div key={i} className="h-6 flex items-center justify-center">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <Textarea
                  id="signature-code"
                  placeholder="Enter your signature rule here..."
                  className="font-mono text-sm h-64 resize-none pl-12 pr-4 py-2 bg-muted/30 focus-visible:bg-background"
                  value={signatureCode}
                  onChange={e => setSignatureCode(e.target.value)}
                  required
                  style={{ lineHeight: '1.5rem' }}
                />
              </div>
              {signatureType === 'YARA' && (
                <p className="text-xs text-muted-foreground">{t('signatures.yaraExample')}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {isPending ? 'Loading...' : 'Save Signature'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  );
}
