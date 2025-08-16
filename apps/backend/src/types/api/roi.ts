import { z } from 'zod';

const ALLOWED_APPS = ['App-1', 'App-2', 'App-3', 'App-4', 'App-5'] as const;
const ALLOWED_COUNTRIES = ['美国', '英国'] as const;

// 请求参数Schema
export const RoiQuerySchema = z.object({
  app: z.enum(ALLOWED_APPS).optional(),
  country: z.enum(ALLOWED_COUNTRIES).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

// 响应数据Schema
export const RoiResponseSchema = z.object({
  date: z.string(),
  app: z.string(),
  country: z.string(),
  installs: z.number(),
  roi: z.object({
    daily: z.number().nullable(),
    day1: z.number().nullable(),
    day3: z.number().nullable(),
    day7: z.number().nullable(),
    day14: z.number().nullable(),
    day30: z.number().nullable(),
    day60: z.number().nullable(),
    day90: z.number().nullable()
  }),
  isZeroDueToDate: z.boolean()
});

// 导出类型
export type RoiQueryParams = z.infer<typeof RoiQuerySchema>;
export type RoiResponse = z.infer<typeof RoiResponseSchema>;
