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

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: {
    value: number
    dataKey: string
    name: string
    color: string
    hide?: boolean
  }[]
  label?: string
}

const lineKeyMap = {
  '当日ROI': 'dailyROI',
  '1日ROI': 'roi1d',
  '3日ROI': 'roi3d',
  '7日ROI': 'roi7d',
  '14日ROI': 'roi14d',
  '30日ROI': 'roi30d',
  '60日ROI': 'roi60d',
  '90日ROI': 'roi90d'
} as const

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(2)}%`
}

const predictMissingValues = (data: ROIChartData[]): ROIChartData[] => {
  const result = [...data];
  const roiKeys = ['roi1d', 'roi3d', 'roi7d', 'roi14d', 'roi30d', 'roi60d', 'roi90d'] as const;

  roiKeys.forEach(key => {
    // 1. 计算比值平均数
    let sum = 0;
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      const dailyROI = result[i].dailyROI;
      const currentROI = result[i][key];
      if (dailyROI !== null && dailyROI > 0 && currentROI !== null) {
        sum += currentROI / dailyROI;
        count++;
      }
    }

    // 2. 如果有有效数据则进行预测
    if (count > 0) {
      const ratioAvg = sum / count;
      for (let i = 0; i < data.length; i++) {
        if (result[i][key] === null) {
          const dailyROI = result[i].dailyROI;
          result[i] = {
            ...result[i],
            [key]: dailyROI !== null ? dailyROI * ratioAvg : null,
            [`${key}IsPredicted`]: true // 标记为预测值
          };
        }
      }
    }
  });

  return result;
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
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white p-4 border border-gray-200 rounded shadow-sm">
      <p className="font-medium">{label}</p>
      {payload.map((item) => {
        const isPredicted = item.dataKey.endsWith('Pred')
        const realDataKey = isPredicted ? item.dataKey.slice(0, -4) : item.dataKey
        const realName = isPredicted ? item.name.slice(0, -3) : item.name
        if (item.value === null  || item.value === undefined){
          return  null
        }
        if (item.hide){
          return null
        }
        return (
          <p key={item.name} style={{ color: item.color }}>
            {realName}: {
              isPredicted
                ? `${item.value.toFixed(2)}% (预测值)`
                : item.value <= 0.5
                  ? '0%' 
                  : `${item.value.toFixed(2)}%`
            }
          </p>
        )
      })}
    </div>
  )
}

const legendSorter = (item: LegendPayload) => {
  const order = ['当日ROI', '1日ROI', '3日ROI', '7日ROI', '14日ROI', '30日ROI', '60日ROI', '90日ROI']
  return item.value ? order.indexOf(item.value) : order.length
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
  roi1d: number | null
  roi3d: number | null
  roi7d: number | null
  roi14d: number | null
  roi30d: number | null
  roi60d: number | null
  roi90d: number | null
  roi1dIsPredicted?: boolean
  roi3dIsPredicted?: boolean
  roi7dIsPredicted?: boolean
  roi14dIsPredicted?: boolean
  roi30dIsPredicted?: boolean
  roi60dIsPredicted?: boolean
  roi90dIsPredicted?: boolean
}

type TransformedROIData = {
  date: string
  dailyROI: number | null
  roi1d: number | null
  roi3d: number | null
  roi7d: number | null
  roi14d: number | null
  roi30d: number | null
  roi60d: number | null
  roi90d: number | null
  roi1dPred: number | null
  roi3dPred: number | null
  roi7dPred: number | null
  roi14dPred: number | null
  roi30dPred: number | null
  roi60dPred: number | null
  roi90dPred: number | null
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
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({
    dailyROI: true,
    roi1d: true,
    roi3d: true,
    roi7d: true,
    roi14d: true,
    roi30d: true,
    roi60d: true,
    roi90d: true
  })

  const handleLegendClick = (data: { value: string }) => {
    // 添加类型保护，确保 data.value 是 lineKeyMap 的有效键
    if (data.value in lineKeyMap) {
      const lineKey = lineKeyMap[data.value as keyof typeof lineKeyMap]
      if (lineKey) {
        setVisibleLines(prev => ({
          ...prev,
          [lineKey]: !prev[lineKey]
        }))
      }
    }
  }

const formatROIData = (data: ROIApiResponse[]): ROIChartData[] => {
  return data.map((item) => {
    // Convert ROI values to percentage and handle 0 values for log scale
    const convertValue = (value: number | null | undefined): number | null => {
      if (value === null || value === undefined) return null
      const percentage = value * 100
      return percentage < 0.5 ? 0.5 : percentage
    }

    return {
      date: item.date,
      dailyROI: convertValue(item.roi.daily),
      roi1d: convertValue(item.roi.day1),
      roi3d: convertValue(item.roi.day3),
      roi7d: convertValue(item.roi.day7),
      roi14d: convertValue(item.roi.day14),
      roi30d: convertValue(item.roi.day30),
      roi60d: convertValue(item.roi.day60),
      roi90d: convertValue(item.roi.day90)
    }
  })
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
    // 添加预测处理
    result = predictMissingValues(result)
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
        data={processedData.map(item => ({
          date: item.date,
          dailyROI: item.dailyROI,
          roi1d: item.roi1dIsPredicted ? null : item.roi1d,
          roi3d: item.roi3dIsPredicted ? null : item.roi3d,
          roi7d: item.roi7dIsPredicted ? null : item.roi7d,
          roi14d: item.roi14dIsPredicted ? null : item.roi14d,
          roi30d: item.roi30dIsPredicted ? null : item.roi30d,
          roi60d: item.roi60dIsPredicted ? null : item.roi60d,
          roi90d: item.roi90dIsPredicted ? null : item.roi90d,
          roi1dPred: item.roi1dIsPredicted ? item.roi1d : null,
          roi3dPred: item.roi3dIsPredicted ? item.roi3d : null,
          roi7dPred: item.roi7dIsPredicted ? item.roi7d : null,
          roi14dPred: item.roi14dIsPredicted ? item.roi14d : null,
          roi30dPred: item.roi30dIsPredicted ? item.roi30d : null,
          roi60dPred: item.roi60dIsPredicted ? item.roi60d : null,
          roi90dPred: item.roi90dIsPredicted ? item.roi90d : null
        }))}
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
          itemSorter={legendSorter}
          onClick={handleLegendClick}
          formatter={(value, entry, index) => {
            const key = lineKeyMap[value as keyof typeof lineKeyMap]
            const isActive = visibleLines[key]
            return (
              <span style={{
                color: isActive ? entry.color : '#999',
                opacity: isActive ? 1 : 0.6,
                textDecoration: isActive ? 'none' : 'line-through',
                cursor: 'pointer'
              }}>
                {value}
              </span>
            )
          }}
        />
        <ReferenceLine y={100} stroke="red" label="100%回本线" />

        {/* ROI Trend Lines - Ordered from shortest to longest period */}
        <Line
          type="monotone"
          dataKey="dailyROI"
          stroke="#8884d8"
          name="当日ROI"
          hide={!visibleLines.dailyROI}
        />
        <Line
          type="monotone"
          dataKey="roi1d"
          stroke="#82ca9d"
          name="1日ROI"
          hide={!visibleLines.roi1d}
        />
        <Line
          type="monotone"
          dataKey="roi3d"
          stroke="#ffc658"
          name="3日ROI"
          hide={!visibleLines.roi3d}
        />
        <Line
          type="monotone"
          dataKey="roi7d"
          stroke="#0088FE"
          name="7日ROI"
          hide={!visibleLines.roi7d}
        />
        <Line
          type="monotone"
          dataKey="roi14d"
          stroke="#00C49F"
          name="14日ROI"
          hide={!visibleLines.roi14d}
        />
        <Line
          type="monotone"
          dataKey="roi30d"
          stroke="#FFBB28"
          name="30日ROI"
          hide={!visibleLines.roi30d}
        />
        <Line
          type="monotone"
          dataKey="roi60d"
          stroke="#FF8042"
          name="60日ROI"
          hide={!visibleLines.roi60d}
        />
        <Line
          type="monotone"
          dataKey="roi90d"
          stroke="#8884d8"
          name="90日ROI"
          hide={!visibleLines.roi90d}
        />
        {/* Prediction Lines */}
        <Line
          type="monotone"
          dataKey="roi1dPred"
          stroke="#82ca9d"
          strokeDasharray="5 5"
          name="1日ROI-预测"
          hide={!visibleLines.roi1d}
          legendType="none"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="roi3dPred"
          stroke="#ffc658"
          strokeDasharray="5 5"
          name="3日ROI-预测"
          hide={!visibleLines.roi3d}
          legendType="none"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="roi7dPred"
          stroke="#0088FE"
          strokeDasharray="5 5"
          name="7日ROI-预测"
          hide={!visibleLines.roi7d}
          legendType="none"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="roi14dPred"
          stroke="#00C49F"
          strokeDasharray="5 5"
          name="14日ROI-预测"
          hide={!visibleLines.roi14d}
          legendType="none"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="roi30dPred"
          stroke="#FFBB28"
          strokeDasharray="5 5"
          name="30日ROI-预测"
          hide={!visibleLines.roi30d}
          legendType="none"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="roi60dPred"
          stroke="#FF8042"
          strokeDasharray="5 5"
          name="60日ROI-预测"
          hide={!visibleLines.roi60d}
          legendType="none"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="roi90dPred"
          stroke="#8884d8"
          strokeDasharray="5 5"
          name="90日ROI-预测"
          hide={!visibleLines.roi90d}
          legendType="none"
          dot={false}
        />
      </LineChart>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>• 实线是真实数值，虚线是缺失数据(例如日期不足)时的预测数值</p>
        <p>• 真实0%的情况，会用实线展示</p>
        <p>• 日期不足导致的0%的情况，系统已自动判定为缺失数据，并在预测曲线(虚线)上展示</p>
      </div>
    </ResponsiveContainer>
  )
}
