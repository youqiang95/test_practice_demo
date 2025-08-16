import { z } from 'zod';
import { RoiData } from '../roi';

// 文件上传Schema
export const DataImportFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.number()
});

// 原始CSV行验证Schema
export const RawCsvRowSchema = z.object({
  '日期': z.string().regex(/^\d{4}-\d{2}-\d{2}(?:\([\u4e00-\u9fa5]\))?$/),
  'app': z.enum(['App-1', 'App-2', 'App-3', 'App-4', 'App-5']),
  '出价类型': z.literal('CPI'),
  '国家地区': z.enum(['美国', '英国']),
  '应用安装.总次数': z.string().regex(/^\d+$/).transform(Number),
  '当日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable(),
  '1日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable(),
  '3日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable(),
  '7日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable(),
  '14日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable(),
  '30日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable(),
  '60日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable(),
  '90日ROI': z.string().regex(/^-?\d+\.?\d*%?$/).nullable()
});

// 响应Schema
export const DataImportResponseSchema = z.object({
  success: z.boolean(),
  count: z.number()
});

// 导出类型
export type DataImportResponse = z.infer<typeof DataImportResponseSchema>;
