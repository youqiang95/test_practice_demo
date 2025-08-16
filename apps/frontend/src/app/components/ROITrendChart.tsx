'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts'

type ROIChartData = {
  date: string
  dailyROI: number
  roi1d: number
  roi3d: number
  roi7d: number
  roi14d: number
  roi30d: number
  roi60d: number
  roi90d: number
}

type ROITrendChartProps = {
  app: string
  country: string
  displayMode: 'raw' | 'average'
  scaleType: 'linear' | 'log'
}

export default function ROITrendChart({
  app,
  country,
  displayMode,
  scaleType,
  refreshKey
}: ROITrendChartProps & { refreshKey?: number }) {
  const [data, setData] = useState<ROIChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/rois?app=${app}&country=${country}`)
      if (!response.ok) {
        throw new Error('获取数据失败')
      }
      
      const result = await response.json()
      
      // 转换数据格式
      const formattedData = result.map((item: any) => ({
        date: item.date,
        dailyROI: item.roi.daily,
        roi1d: item.roi.day1,
        roi3d: item.roi.day3,
        roi7d: item.roi.day7,
        roi14d: item.roi.day14,
        roi30d: item.roi.day30,
        roi60d: item.roi.day60,
        roi90d: item.roi.day90
      }))
      
      setData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [app, country, refreshKey])

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载数据中...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>
  }

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full">暂无数据</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 'dataMax + 100']} />
        <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
        <Legend />
        <ReferenceLine y={100} stroke="red" label="100%回本线" />

        {/* ROI Trend Lines */}
        <Line
          type="monotone"
          dataKey="dailyROI"
          stroke="#8884d8"
          name="当日ROI"
        />
        <Line
          type="monotone"
          dataKey="roi1d"
          stroke="#82ca9d"
          name="1日ROI"
        />
        <Line
          type="monotone"
          dataKey="roi3d"
          stroke="#ffc658"
          name="3日ROI"
        />
        <Line
          type="monotone"
          dataKey="roi7d"
          stroke="#0088FE"
          name="7日ROI"
        />
        <Line
          type="monotone"
          dataKey="roi14d"
          stroke="#00C49F"
          name="14日ROI"
        />
        <Line
          type="monotone"
          dataKey="roi30d"
          stroke="#FFBB28"
          name="30日ROI"
        />
        <Line
          type="monotone"
          dataKey="roi60d"
          stroke="#FF8042"
          name="60日ROI"
        />
        <Line
          type="monotone"
          dataKey="roi90d"
          stroke="#8884d8"
          name="90日ROI"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
