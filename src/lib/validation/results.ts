import { z } from 'zod';

export const answerMapSchema = z.record(z.string(), z.string());

export const createResultRequestSchema = z.object({
  answers: answerMapSchema.default({}),
  utmSource: z.string().trim().min(1).optional().nullable(),
  utmMedium: z.string().trim().min(1).optional().nullable(),
  utmCampaign: z.string().trim().min(1).optional().nullable(),
});
