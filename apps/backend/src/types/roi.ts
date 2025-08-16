export interface RoiQueryParams {
  app?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
}

export interface RoiData {
  id: number;
  date: Date;
  app: string;
  bidType: string;
  country: string;
  installs: number;
  dailyRoi: number | null;
  roi1d: number | null;
  roi3d: number | null;
  roi7d: number | null;
  roi14d: number | null;
  roi30d: number | null;
  roi60d: number | null;
  roi90d: number | null;
}

export interface RoiResponse {
  date: string;
  app: string;
  country: string;
  installs: number;
  roi: {
    daily: number | null;
    day1: number | null;
    day3: number | null;
    day7: number | null;
    day14: number | null;
    day30: number | null;
    day60: number | null;
    day90: number | null;
  };
  isZeroDueToDate: boolean;
}
