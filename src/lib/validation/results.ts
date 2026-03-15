import { z } from 'zod';

export const answerMapSchema = z.record(z.string(), z.string());
export const feedbackRatingSchema = z.enum(['yes', 'somewhat', 'no']);

export const createResultRequestSchema = z.object({
  answers: answerMapSchema.default({}),
  utmSource: z.string().trim().min(1).optional().nullable(),
  utmMedium: z.string().trim().min(1).optional().nullable(),
  utmCampaign: z.string().trim().min(1).optional().nullable(),
  leadName: z.string().trim().min(1).max(100).optional().nullable(),
  leadEmail: z.string().trim().email().max(255).optional().nullable(),
  feedbackRating: feedbackRatingSchema.optional().nullable(),
  feedbackText: z.string().trim().min(1).max(1000).optional().nullable(),
});

export const updateResultRequestSchema = z.object({
  leadName: z.string().trim().min(1).max(100).optional().nullable(),
  leadEmail: z.string().trim().email().max(255).optional().nullable(),
  feedbackRating: feedbackRatingSchema.optional().nullable(),
  feedbackText: z.string().trim().min(1).max(1000).optional().nullable(),
});
