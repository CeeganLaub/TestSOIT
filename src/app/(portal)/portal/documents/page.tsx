'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  PenTool,
  Clock,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  File,
  Image as ImageIcon,
  X,
} from 'lucide-react';

type Document = {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'other';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  caseTitle: string;
  category: string;
  requiresSignature: boolean;
  signed: boolean;
  viewedAt?: string;
};

// Mock documents
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Settlement Offer Letter.pdf',
    type: 'pdf',
    size: '245 KB',
    uploadedAt: '2024-01-18',
    uploadedBy: 'Robert Anderson',
    caseTitle: 'Smith v. ABC Corp',
    category: 'Correspondence',
    requiresSignature: true,
    signed: false,
  },
  {
    id: '2',
    name: 'Discovery Response.pdf',
    type: 'pdf',
    size: '1.2 MB',
    uploadedAt: '2024-01-15',
    uploadedBy: 'Robert Anderson',
    caseTitle: 'Smith v. ABC Corp',
    category: 'Discovery',
    requiresSignature: false,
    signed: false,
    viewedAt: '2024-01-16',
  },
  {
    id: '3',
    name: 'Medical Records Summary.pdf',
    type: 'pdf',
    size: '3.5 MB',
    uploadedAt: '2024-01-10',
    uploadedBy: 'Legal Assistant',
    caseTitle: 'Smith v. ABC Corp',
    category: 'Medical',
    requiresSignature: false,
    signed: false,
    viewedAt: '2024-01-12',
  },
  {
    id: '4',
    name: 'Retainer Agreement.pdf',
    type: 'pdf',
    size: '156 KB',
    uploadedAt: '2023-08-15',
    uploadedBy: 'Robert Anderson',
    caseTitle: 'Smith v. ABC Corp',
    category: 'Agreements',
    requiresSignature: true,
    signed: true,
  },
  {
    id: '5',
    name: 'Accident Scene Photos.zip',
    type: 'image',
    size: '12.4 MB',
    uploadedAt: '2023-09-01',
    uploadedBy: 'John Smith',
    caseTitle: 'Smith v. ABC Corp',
    category: 'Evidence',
    requiresSignature: false,
    signed: false,
    viewedAt: '2023-09-02',
  },
];

const categories = ['All', 'Correspondence', 'Discovery', 'Medical', 'Agreements', 'Evidence'];

const typeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  doc: <File className="h-5 w-5 text-blue-500" />,
  image: <ImageIcon className="h-5 w-5 text-green-500" />,
  other: <File className="h-5 w-5 text-gray-500" />,
};

export default function ClientDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [showSignature, setShowSignature] = useState<string | null>(null);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pendingSignatures = mockDocuments.filter((d) => d.requiresSignature && !d.signed);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <p className="text-gray-500">View and manage your case documents</p>
        </div>
        <Button variant="navy" size="sm" onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Pending Signatures Alert */}
      {pendingSignatures.length > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">
                  {pendingSignatures.length} document{pendingSignatures.length > 1 ? 's' : ''}{' '}
                  require your signature
                </p>
                <p className="text-sm text-yellow-700">
                  Please review and sign these documents at your earliest convenience.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                onClick={() => setShowSignature(pendingSignatures[0].id)}
              >
                Sign Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-law-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">{typeIcons[doc.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{doc.name}</h3>
                    {doc.requiresSignature && !doc.signed && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Signature Required
                      </span>
                    )}
                    {doc.signed && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Signed
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span>{doc.category}</span>
                    <span>{doc.size}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                    <span>by {doc.uploadedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  {doc.requiresSignature && !doc.signed && (
                    <Button
                      variant="navy"
                      size="sm"
                      onClick={() => setShowSignature(doc.id)}
                    >
                      <PenTool className="h-4 w-4 mr-1" />
                      Sign
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-1">No documents found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Document</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your files here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <Button variant="outline">Browse Files</Button>
                <p className="text-xs text-gray-500 mt-4">
                  Supported: PDF, DOC, DOCX, JPG, PNG (max 25MB)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Document Category</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select category...</option>
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg min-h-[80px]"
                  placeholder="Add any notes about this document..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
                <Button variant="navy">Upload</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Signature Modal */}
      {showSignature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sign Document</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowSignature(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Document preview would appear here</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-2">Your Signature</p>
                <div className="border-2 border-dashed rounded-lg p-8 text-center bg-white">
                  <p className="text-gray-500 mb-4">Draw or type your signature</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <PenTool className="h-4 w-4 mr-2" />
                      Draw
                    </Button>
                    <Button variant="outline" size="sm">
                      Type
                    </Button>
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="agree" className="mt-1" />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  I agree that my electronic signature is the legal equivalent of my manual
                  signature on this document.
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowSignature(null)}>
                  Cancel
                </Button>
                <Button variant="navy">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply Signature
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
