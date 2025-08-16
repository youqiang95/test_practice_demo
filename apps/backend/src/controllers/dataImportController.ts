import { Request, Response } from 'express';
import prisma from '../prisma';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { DataImportError, CSVFieldValidationError } from '../types/errors';
import { RoiData } from '../types/roi';
import { RawCsvRowSchema } from '../types/api/data-import';

export const importCsv = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new DataImportError('No file uploaded');
  }
  if (!req.file.buffer) {
    throw new DataImportError('File is empty');
  }
  
  const fileContent = req.file.buffer.toString();
  if (!fileContent.trim()) {
    throw new DataImportError('File is empty');
  }

  const results: RoiData[] = [];
  const stream = Readable.from(fileContent).pipe(csv());

  // 事务处理
  await prisma.$transaction(async (tx) => {
    // 清空现有数据
    await tx.roiData.deleteMany({});

    // 一次性处理所有CSV数据
    for await (const row of stream) {
      results.push(transformRow(row));
    }

    await tx.roiData.createMany({ data: results });
  });

  res.json({ success: true, count: results.length });
};

function transformRow(row: any): RoiData {
  const result = RawCsvRowSchema.safeParse(row);
  if (!result.success) {
    throw new CSVFieldValidationError(`CSV字段验证失败: ${result.error.format()}`);
  }
  const parsed = result.data;
  const dateStr = parsed['日期'].split('(')[0];
    
    const parseRoi = (value: string | null): number | null => {
      if (!value) return null;
      return parseFloat(value.replace('%', '')) / 100;
    };

    return {
      date: new Date(dateStr),
      app: parsed['app'],
      bidType: parsed['出价类型'],
      country: parsed['国家地区'],
      installs: parsed['应用安装.总次数'],
      dailyRoi: parseRoi(parsed['当日ROI']),
      roi1d: parseRoi(parsed['1日ROI']),
      roi3d: parseRoi(parsed['3日ROI']),
      roi7d: parseRoi(parsed['7日ROI']),
      roi14d: parseRoi(parsed['14日ROI']),
      roi30d: parseRoi(parsed['30日ROI']),
      roi60d: parseRoi(parsed['60日ROI']),
      roi90d: parseRoi(parsed['90日ROI'])
    };
}
