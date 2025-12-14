'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, X, Check, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const categories = [
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'COURT_FILING', label: 'Court Filing' },
  { value: 'CORRESPONDENCE', label: 'Correspondence' },
  { value: 'EVIDENCE', label: 'Evidence' },
  { value: 'INTAKE', label: 'Intake Form' },
  { value: 'ID_DOCUMENT', label: 'ID Document' },
  { value: 'MEDICAL_RECORD', label: 'Medical Record' },
  { value: 'POLICE_REPORT', label: 'Police Report' },
  { value: 'ENGAGEMENT_LETTER', label: 'Engagement Letter' },
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'OTHER', label: 'Other' },
];

type UploadedFile = {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'analyzing' | 'complete' | 'error';
  error?: string;
  documentId?: string;
};

export default function DocumentUploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [category, setCategory] = useState('OTHER');
  const [runAiAnalysis, setRunAiAnalysis] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    for (const uploadFile of files) {
      if (uploadFile.status !== 'pending') continue;

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 0 } : f
        )
      );

      try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', uploadFile.file);
        formData.append('category', category);
        formData.append('runAiAnalysis', runAiAnalysis.toString());

        // Upload file
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();

        // Update to analyzing or complete
        if (runAiAnalysis) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, status: 'analyzing', progress: 100, documentId: result.document.id }
                : f
            )
          );

          // Run AI analysis
          await fetch('/api/ai/analyze-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              documentId: result.document.id,
              organizationId: result.document.organizationId,
            }),
          });
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: 'complete', progress: 100, documentId: result.document.id }
              : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );
      }
    }

    toast({
      title: 'Upload Complete',
      description: `${files.length} document(s) uploaded successfully.`,
      variant: 'success',
    });
  };

  const completedCount = files.filter((f) => f.status === 'complete').length;
  const hasFiles = files.length > 0;
  const allComplete = files.length > 0 && completedCount === files.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link
        href="/documents"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Documents
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Documents</h1>
        <p className="text-gray-500">Upload and analyze your legal documents with AI.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-law-navy"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={runAiAnalysis}
              onChange={(e) => setRunAiAnalysis(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Run AI Analysis</span>
              </div>
              <p className="text-sm text-blue-700">
                Automatically extract key terms, dates, and risks from documents
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-law-navy bg-law-navy/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Drag and drop files here
            </h3>
            <p className="text-gray-500 mb-4">
              or click to browse your computer
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Supported: PDF, Word, Excel, Images (max 50MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {hasFiles && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Selected Files ({completedCount}/{files.length} complete)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <FileText className="h-8 w-8 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {uploadFile.status === 'uploading' && (
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-law-navy transition-all"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'pending' && (
                      <span className="text-xs text-gray-500">Ready</span>
                    )}
                    {uploadFile.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-law-navy" />
                    )}
                    {uploadFile.status === 'analyzing' && (
                      <span className="flex items-center gap-1 text-xs text-blue-600">
                        <Brain className="h-4 w-4 animate-pulse" />
                        Analyzing...
                      </span>
                    )}
                    {uploadFile.status === 'complete' && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {uploadFile.status === 'error' && (
                      <span className="text-xs text-red-500">{uploadFile.error}</span>
                    )}
                    {uploadFile.status === 'pending' && (
                      <button
                        onClick={() => removeFile(uploadFile.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
        {allComplete ? (
          <Button
            variant="navy"
            className="flex-1"
            onClick={() => router.push('/documents')}
          >
            Done
          </Button>
        ) : (
          <Button
            variant="navy"
            className="flex-1"
            onClick={uploadFiles}
            disabled={!hasFiles || files.some((f) => f.status === 'uploading' || f.status === 'analyzing')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload {files.filter((f) => f.status === 'pending').length} File(s)
          </Button>
        )}
      </div>
    </div>
  );
}
