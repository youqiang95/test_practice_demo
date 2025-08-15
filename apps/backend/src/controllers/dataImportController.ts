import { Request, Response } from 'express';
import prisma from '../prisma';
import csv from 'csv-parser';
import { Readable } from 'stream';

export const importCsv = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results: any[] = [];
    const batchSize = 1000;
    let processedCount = 0;

    // 创建CSV解析流
    const stream = Readable.from(req.file.buffer.toString())
      .pipe(csv());

    // 事务处理
    await prisma.$transaction(async (tx) => {
      // 清空现有数据
      await tx.roiData.deleteMany({});

      // 分批处理CSV数据
      for await (const row of stream) {
        results.push(transformRow(row));
        
        if (results.length >= batchSize) {
          await tx.roiData.createMany({ data: results });
          processedCount += results.length;
          results.length = 0; // 清空数组
        }
      }

      // 处理剩余数据
      if (results.length > 0) {
        await tx.roiData.createMany({ data: results });
        processedCount += results.length;
      }
    });

    console.log(`Successfully imported ${processedCount} records`);
    res.json({ success: true, count: processedCount });
  } catch (error) {
    console.error('CSV import failed:', error);
    res.status(500).json({ error: 'Import failed', details: error.message });
  }
};

function transformRow(row: any) {
  return {
    date: new Date(row['日期']),
    app: row['app'],
    bidType: row['出价类型'],
    country: row['国家地区'],
    installs: parseInt(row['应用安装.总次数']),
    dailyRoi: parseFloat(row['当日ROI'].replace('%', '')) / 100,
    roi1d: parseFloat(row['1日ROI'].replace('%', '')) / 100,
    roi3d: parseFloat(row['3日ROI'].replace('%', '')) / 100,
    roi7d: parseFloat(row['7日ROI'].replace('%', '')) / 100,
    roi14d: parseFloat(row['14日ROI'].replace('%', '')) / 100,
    roi30d: parseFloat(row['30日ROI'].replace('%', '')) / 100,
    roi60d: parseFloat(row['60日ROI'].replace('%', '')) / 100,
    roi90d: parseFloat(row['90日ROI'].replace('%', '')) / 100
  };
}
