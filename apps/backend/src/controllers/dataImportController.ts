import { Request, Response } from 'express';
import prisma from '../prisma';
import csv from 'csv-parser';
import { Readable } from 'stream';
import fs from 'fs';
import { DataImportError, CSVMissingRequiredFieldError } from '../types/errors';

export const importCsv = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new DataImportError('No file uploaded');
  }

  // Check for empty file
  if (req.file.size === 0) {
    throw new DataImportError('File is empty');
  }

  const results: any[] = [];
  let fileContent: string;
  let processedCount = 0;
  
  if (req.file.buffer) {
    fileContent = req.file.buffer.toString();
  } else {
    fileContent = fs.readFileSync(req.file.path, 'utf8');
  }

  if (!fileContent.trim()) {
    throw new DataImportError('File content is empty');
  }

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
    processedCount = results.length;
  });

  console.log(`Successfully imported ${processedCount} records`);
  res.json({ success: true, count: processedCount });
};

function transformRow(row: any) {
  // Validate required fields
  const requiredFields = ['日期', 'app', '国家地区', '应用安装.总次数'];
  for (const field of requiredFields) {
    if (!row[field]) {
      throw new CSVMissingRequiredFieldError(field);
    }
  }

  // Safe number parsing
  const safeParseFloat = (str: string) => {
    if (!str) return null;
    return parseFloat(str.toString().replace('%', '')) / 100;
  };

  return {
    date: new Date(row['日期']),
    app: row['app'],
    bidType: row['出价类型'] || null,
    country: row['国家地区'],
    installs: parseInt(row['应用安装.总次数']),
    dailyRoi: safeParseFloat(row['当日ROI']),
    roi1d: safeParseFloat(row['1日ROI']),
    roi3d: safeParseFloat(row['3日ROI']),
    roi7d: safeParseFloat(row['7日ROI']),
    roi14d: safeParseFloat(row['14日ROI']),
    roi30d: safeParseFloat(row['30日ROI']),
    roi60d: safeParseFloat(row['60日ROI']),
    roi90d: safeParseFloat(row['90日ROI'])
  };
}
