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
import type { LegendPayload, TooltipProps } from 'recharts'

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`
}

const calculateMovingAverage = (data: ROIChartData[], key: keyof ROIChartData, windowSize = 7): ROIChartData[] => {
  return data.map((item, index) => {
    const start = Math.max(0, index - windowSize + 1)
    const end = index + 1
    const windowData = data.slice(start, end)
    
    // 检查窗口中是否有 null/undefined 值
    const hasNullInWindow = windowData.some(item => item[key] === null || item[key] === undefined)
    
    if (hasNullInWindow) {
      return {
        ...item,
        [key]: null
      }
    }
    
    // 计算平均值
    const sum = windowData.reduce((acc, curr) => acc + (curr[key] as number), 0)
    const average = sum / windowData.length
    
    return {
      ...item,
      [key]: average
    }
  })
}

const CustomTooltip = ({
  active,
  payload,
  label
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white p-4 border border-gray-200 rounded shadow-sm">
      <p className="font-medium">{label}</p>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color }}>
          {item.name}: {item.value !== null && item.value !== undefined ? `${item.value.toFixed(2)}%` : '缺失'}
        </p>
      ))}
    </div>
  )
}

const legendSorter = (item: LegendPayload) => {
  const order = ['当日ROI', '1日ROI', '3日ROI', '7日ROI', '14日ROI', '30日ROI', '60日ROI', '90日ROI']
  return order.indexOf(item.value)
}

type ROIApiResponse = {
  date: string
  app: string
  country: string
  installs: number
  roi: {
    daily?: number
    day1?: number
    day3?: number
    day7?: number
    day14?: number
    day30?: number
    day60?: number
    day90?: number
  }
}

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
  const [processedData, setProcessedData] = useState<ROIChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

const formatROIData = (data: ROIApiResponse[]): ROIChartData[] => {
  return data.map((item) => ({
    date: item.date,
    dailyROI: item.roi.daily !== null && item.roi.daily !== undefined ? item.roi.daily * 100 : null,
    roi1d: item.roi.day1 !== null && item.roi.day1 !== undefined ? item.roi.day1 * 100 : null,
    roi3d: item.roi.day3 !== null && item.roi.day3 !== undefined ? item.roi.day3 * 100 : null,
    roi7d: item.roi.day7 !== null && item.roi.day7 !== undefined ? item.roi.day7 * 100 : null,
    roi14d: item.roi.day14 !== null && item.roi.day14 !== undefined ? item.roi.day14 * 100 : null,
    roi30d: item.roi.day30 !== null && item.roi.day30 !== undefined ? item.roi.day30 * 100 : null,
    roi60d: item.roi.day60 !== null && item.roi.day60 !== undefined ? item.roi.day60 * 100 : null,
    roi90d: item.roi.day90 !== null && item.roi.day90 !== undefined ? item.roi.day90 * 100 : null
  }))
}

const fetchData = async () => {
  try {
    setLoading(true)
    setError(null)
    
    const response = await fetch(`/api/rois?app=${app}&country=${country}`)
    if (!response.ok) {
      throw new Error('获取数据失败')
    }
    
    const result = await response.json()
    const formattedData = formatROIData(result)
    
    setData(formattedData)
    setProcessedData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [app, country, refreshKey])

  useEffect(() => {
    if (data.length === 0) return

    let result = [...data]
    if (displayMode === 'average') {
      const keys: Array<keyof ROIChartData> = [
        'dailyROI', 'roi1d', 'roi3d', 'roi7d', 
        'roi14d', 'roi30d', 'roi60d', 'roi90d'
      ]
      keys.forEach(key => {
        result = calculateMovingAverage(result, key)
      })
    }
    setProcessedData(result)
  }, [data, displayMode])

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
        data={processedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis 
          domain={['dataMin', 'dataMax + 100']} 
          tickFormatter={(value) => `${value}%`}
          scale={scaleType}
        />
        <Tooltip content={<CustomTooltip />} filterNull={false}/>
        <Legend 
          payload={[
            { value: '当日ROI', type: 'line', id: 'dailyROI', color: '#8884d8' },
            { value: '1日ROI', type: 'line', id: 'roi1d', color: '#82ca9d' },
            { value: '3日ROI', type: 'line', id: 'roi3d', color: '#ffc658' },
            { value: '7日ROI', type: 'line', id: 'roi7d', color: '#0088FE' },
            { value: '14日ROI', type: 'line', id: 'roi14d', color: '#00C49F' },
            { value: '30日ROI', type: 'line', id: 'roi30d', color: '#FFBB28' },
            { value: '60日ROI', type: 'line', id: 'roi60d', color: '#FF8042' },
            { value: '90日ROI', type: 'line', id: 'roi90d', color: '#8884d8' }
          ]}
          itemSorter={legendSorter}
        />
        <ReferenceLine y={100} stroke="red" label="100%回本线" />

        {/* ROI Trend Lines - Ordered from shortest to longest period */}
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
