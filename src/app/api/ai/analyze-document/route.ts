import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { analyzeDocument, extractKeyTerms, identifyRisks } from '@/lib/ai/document-analyzer';
import { downloadFile } from '@/lib/integrations/storage';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { documentId, organizationId, analysisType = 'full' } = body;

    // Verify user has access
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
    });

    if (!orgUser) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get document
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        organizationId,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Create AI job
    const aiJob = await prisma.aIJob.create({
      data: {
        organizationId,
        type: 'DOCUMENT_ANALYSIS',
        status: 'PROCESSING',
        input: { documentId, analysisType },
        entityType: 'document',
        entityId: documentId,
      },
    });

    try {
      // Download document content
      const fileContent = await downloadFile(document.storageKey);
      if (!fileContent) {
        throw new Error('Failed to download document');
      }

      // For text-based documents, convert to string
      const textContent = document.textContent || fileContent.toString('utf-8');

      let result: any;

      switch (analysisType) {
        case 'key_terms':
          result = await extractKeyTerms(textContent);
          break;
        case 'risks':
          result = await identifyRisks(textContent);
          break;
        case 'full':
        default:
          result = await analyzeDocument(textContent, document.category);
      }

      // Update document with analysis
      await prisma.document.update({
        where: { id: documentId },
        data: {
          isAnalyzed: true,
          aiSummary: result.summary,
          aiKeyTerms: result.keyTerms || result,
          aiRiskFlags: result.risks,
        },
      });

      // Update AI job
      await prisma.aIJob.update({
        where: { id: aiJob.id },
        data: {
          status: 'COMPLETED',
          output: result,
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        analysis: result,
        jobId: aiJob.id,
      });
    } catch (analysisError) {
      await prisma.aIJob.update({
        where: { id: aiJob.id },
        data: {
          status: 'FAILED',
          error: analysisError instanceof Error ? analysisError.message : 'Analysis failed',
        },
      });
      throw analysisError;
    }
  } catch (error) {
    console.error('Document analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
