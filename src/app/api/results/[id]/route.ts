import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db/prisma';

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
