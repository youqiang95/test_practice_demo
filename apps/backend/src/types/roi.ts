export interface RoiQueryParams {
  app?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
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
