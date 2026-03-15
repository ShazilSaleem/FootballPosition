import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { updateResultRequestSchema } from '@/lib/validation/results';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  const result = await prisma.assessmentResult.findUnique({
    where: { id: params.id },
  });

  if (!result) {
    return NextResponse.json({ error: 'Result not found' }, { status: 404 });
  }

  return NextResponse.json({ result });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const prisma = getPrisma();
  const json = await request.json();
  const parsed = updateResultRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { leadName, leadEmail, feedbackRating, feedbackText } = parsed.data;
  const result = await prisma.assessmentResult.update({
    where: { id: params.id },
    data: {
      ...(leadName !== undefined ? { leadName } : {}),
      ...(leadEmail !== undefined ? { leadEmail } : {}),
      ...(leadName !== undefined || leadEmail !== undefined
        ? { leadCapturedAt: leadName || leadEmail ? new Date() : null }
        : {}),
      ...(feedbackRating !== undefined ? { feedbackRating } : {}),
      ...(feedbackText !== undefined ? { feedbackText } : {}),
      ...(feedbackRating !== undefined || feedbackText !== undefined
        ? { feedbackSubmittedAt: feedbackRating || feedbackText ? new Date() : null }
        : {}),
    },
  });

  return NextResponse.json({ result });
}
