import { Request, Response } from 'express';
import prisma from '../prisma';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { DataImportError, CSVFieldValidationError } from '../types/errors';
import { RoiData } from '../types/roi';

const FIELD_NAME_MAPPING: Record<string, string> = {
  date: '日期',
  bidType: '出价类型',
  country: '国家地区',
  installs: '应用安装.总次数',
  dailyRoi: '当日ROI',
  roi1d: '1日ROI',
  roi3d: '3日ROI',
  roi7d: '7日ROI',
  roi14d: '14日ROI',
  roi30d: '30日ROI',
  roi60d: '60日ROI',
  roi90d: '90日ROI'
};

const ENGLISH_HEADER = 'date,app,bidType,country,installs,dailyRoi,roi1d,roi3d,roi7d,roi14d,roi30d,roi60d,roi90d';

const replaceCsvHeader = (content: string): string => {
  const lines = content.split('\n');
  if (lines.length > 0) {
    lines[0] = ENGLISH_HEADER;
  }
  return lines.join('\n');
};

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

  const processedContent = replaceCsvHeader(fileContent);
  const results: RoiData[] = [];
  const stream = Readable.from(processedContent).pipe(csv());

  // 事务处理
  await prisma.$transaction(async (tx) => {
    // 清空现有数据
    await tx.roiData.deleteMany({});

    // 一次性处理所有CSV数据
    let lineNumber = 1; // CSV 行号从1开始
    for await (const row of stream) {
      results.push(transformRow(row, lineNumber++));
    }

    await tx.roiData.createMany({ data: results });
  });

  res.json({ success: true, count: results.length });
};

function validateRow(row: any, lineNumber: number): void {
  // 日期格式校验 (只需要以 YYYY-MM-DD 开头)
  if (!/^\d{4}-\d{2}-\d{2}/.test(row['date'])) {
    throw new CSVFieldValidationError(`第 ${lineNumber} 行: ${FIELD_NAME_MAPPING['date']}格式无效: ${row['date']}`);
  }

  // app 枚举校验
  const validApps = ['App-1', 'App-2', 'App-3', 'App-4', 'App-5'];
  if (!validApps.includes(row['app'])) {
    throw new CSVFieldValidationError(`第 ${lineNumber} 行: app 值无效: ${row['app']}`);
  }

  // 出价类型校验
  if (row['bidType'] !== 'CPI') {
    throw new CSVFieldValidationError(`第 ${lineNumber} 行: ${FIELD_NAME_MAPPING['bidType']}必须为CPI: ${row['bidType']}`);
  }

  // 国家地区校验
  const validCountries = ['美国', '英国'];
  if (!validCountries.includes(row['country'])) {
    throw new CSVFieldValidationError(`第 ${lineNumber} 行: ${FIELD_NAME_MAPPING['country']}无效: ${row['country']}`);
  }

  // 应用安装.总次数校验
  if (!/^[\d,]+$/.test(row['installs'])) {
    throw new CSVFieldValidationError(`第 ${lineNumber} 行: ${FIELD_NAME_MAPPING['installs']}必须为整数: ${row['installs']}`);
  }

  // ROI 值校验
  const roiFields = ['dailyRoi', 'roi1d', 'roi3d', 'roi7d', 'roi14d', 'roi30d', 'roi60d', 'roi90d'];
  for (const field of roiFields) {
    if (row[field] && !/^-?[\d,]+\.?[\d,]*%?$/.test(row[field])) {
      throw new CSVFieldValidationError(`第 ${lineNumber} 行 ${FIELD_NAME_MAPPING[field]} 格式无效: ${row[field]}`);
    }
  }
}

function transformRow(row: any, lineNumber: number): RoiData {
  validateRow(row, lineNumber);
  
  const dateStr = row['date'].substring(0, 10);
    
  const parseRoi = (value: string | null): number | null => {
    if (!value) return null;
    const numStr = value.replace(/%/g, '').replace(/,/g, '');
    return parseFloat(numStr) / 100;
  };

  return {
    date: new Date(dateStr),
    app: row['app'],
    bidType: row['bidType'],
    country: row['country'],
    installs: Number(row['installs'].replace(/,/g, '')),
    dailyRoi: parseRoi(row['dailyRoi']),
    roi1d: parseRoi(row['roi1d']),
    roi3d: parseRoi(row['roi3d']),
    roi7d: parseRoi(row['roi7d']),
    roi14d: parseRoi(row['roi14d']),
    roi30d: parseRoi(row['roi30d']),
    roi60d: parseRoi(row['roi60d']),
    roi90d: parseRoi(row['roi90d'])
  };
}
