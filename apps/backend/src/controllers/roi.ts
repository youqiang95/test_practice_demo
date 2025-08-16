import { Request, Response } from 'express';
import prisma from '../prisma';
import { RoiQueryParams, RoiData } from '../types/roi';
import { DatabaseError } from '../types/errors';

export const getRoiData = async (req: Request, res: Response) => {
  const query = req.query as unknown as RoiQueryParams;
  
  const data = await prisma.roiData.findMany({
    where: {
      app: query.app,
      country: query.country,
      date: {
        gte: query.startDate ? new Date(query.startDate) : undefined,
        lte: query.endDate ? new Date(query.endDate) : undefined
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  res.json(data.map((item: RoiData) => ({
    date: item.date.toISOString().split('T')[0],
    app: item.app,
    country: item.country,
    installs: item.installs,
    roi: {
      daily: item.dailyRoi,
      day1: item.roi1d,
      day3: item.roi3d,
      day7: item.roi7d,
      day14: item.roi14d,
      day30: item.roi30d,
      day60: item.roi60d,
      day90: item.roi90d
    }
  })));
};
