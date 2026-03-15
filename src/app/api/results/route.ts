import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';
import { calculateResult, type AnswerMap } from '@/lib/scoring/calculateResult';
import { createResultRequestSchema } from '@/lib/validation/results';

export async function GET() {
  const prisma = getPrisma();
  const results = await prisma.assessmentResult.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({ results });
}

export async function POST(request: Request) {
  const prisma = getPrisma();
  const json = await request.json();
  const parsed = createResultRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const answers = parsed.data.answers as AnswerMap;
  const { utmSource, utmMedium, utmCampaign, leadName, leadEmail, leadRole, feedbackRating, feedbackText } = parsed.data;
  const computed = calculateResult(answers);

  const created = await prisma.assessmentResult.create({
    data: {
      answers,
      scores: computed.scores,
      primaryKey: computed.primary?.key ?? 'CM',
      primaryName: computed.primary?.name ?? 'Central Midfielder',
      primaryScore: computed.primary?.score ?? 0,
      primaryArchetype: computed.primary?.archetype ?? 'Box-to-Box Controller',
      secondaryKey: computed.secondary?.key ?? null,
      secondaryName: computed.secondary?.name ?? null,
      secondaryScore: computed.secondary?.score ?? null,
      secondaryArchetype: computed.secondary?.archetype ?? null,
      tertiaryKey: computed.tertiary?.key ?? null,
      tertiaryName: computed.tertiary?.name ?? null,
      tertiaryScore: computed.tertiary?.score ?? null,
      tertiaryArchetype: computed.tertiary?.archetype ?? null,
      strengths: computed.strengths,
      watchouts: computed.watchouts,
      summary: computed.summary,
      leadName: leadName ?? null,
      leadEmail: leadEmail ?? null,
      leadRole: leadRole ?? null,
      leadCapturedAt: leadName || leadEmail || leadRole ? new Date() : null,
      feedbackRating: feedbackRating ?? null,
      feedbackText: feedbackText ?? null,
      feedbackSubmittedAt: feedbackRating || feedbackText ? new Date() : null,
      utmSource: utmSource ?? null,
      utmMedium: utmMedium ?? null,
      utmCampaign: utmCampaign ?? null,
    },
  });

  return NextResponse.json({ result: created, computed }, { status: 201 });
}

export async function DELETE() {
  const prisma = getPrisma();
  await prisma.assessmentResult.deleteMany();
  return NextResponse.json({ ok: true });
}
