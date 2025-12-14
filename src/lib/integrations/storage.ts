import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'lawfirm-platform-documents';

export type UploadOptions = {
  file: Buffer;
  fileName: string;
  mimeType: string;
  organizationId: string;
  folder?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
};

export async function uploadFile(options: UploadOptions): Promise<{
  success: boolean;
  key?: string;
  url?: string;
  error?: string;
}> {
  try {
    const fileExtension = options.fileName.split('.').pop() || '';
    const uniqueId = nanoid();
    const key = options.folder
      ? `${options.organizationId}/${options.folder}/${uniqueId}.${fileExtension}`
      : `${options.organizationId}/${uniqueId}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: options.file,
      ContentType: options.mimeType,
      Metadata: {
        originalName: options.fileName,
        organizationId: options.organizationId,
        ...options.metadata,
      },
      ACL: options.isPublic ? 'public-read' : 'private',
    });

    await s3Client.send(command);

    const url = options.isPublic
      ? `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
      : await getSignedDownloadUrl(key);

    return { success: true, key, url };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn = 3600 // 1 hour default
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function getSignedUploadUrl(
  key: string,
  mimeType: string,
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(key: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}

export async function getFileMetadata(key: string): Promise<{
  size: number;
  contentType: string;
  lastModified: Date;
  metadata: Record<string, string>;
} | null> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    return {
      size: response.ContentLength || 0,
      contentType: response.ContentType || 'application/octet-stream',
      lastModified: response.LastModified || new Date(),
      metadata: response.Metadata || {},
    };
  } catch {
    return null;
  }
}

// Generate presigned URL for direct browser upload
export async function generatePresignedUpload(
  organizationId: string,
  fileName: string,
  mimeType: string,
  folder?: string
): Promise<{
  uploadUrl: string;
  key: string;
  expiresAt: Date;
}> {
  const fileExtension = fileName.split('.').pop() || '';
  const uniqueId = nanoid();
  const key = folder
    ? `${organizationId}/${folder}/${uniqueId}.${fileExtension}`
    : `${organizationId}/${uniqueId}.${fileExtension}`;

  const uploadUrl = await getSignedUploadUrl(key, mimeType, 3600);
  const expiresAt = new Date(Date.now() + 3600 * 1000);

  return { uploadUrl, key, expiresAt };
}

// Download file content
export async function downloadFile(key: string): Promise<Buffer | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (response.Body) {
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }

    return null;
  } catch (error) {
    console.error('Download error:', error);
    return null;
  }
}

// Copy file within S3
export async function copyFile(
  sourceKey: string,
  destinationKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { S3Client, CopyObjectCommand } = await import('@aws-sdk/client-s3');

    const command = new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Copy error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Copy failed',
    };
  }
}
