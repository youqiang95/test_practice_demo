'use client'

import { useState } from 'react'

type FilterProps = {
  onFilterChange: (filters: {
    app: string
    country: string
    displayMode: 'raw' | 'average'
    scaleType: 'linear' | 'log'
  }) => void
}

export default function ChartFilters({ onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState({
    app: 'App-1',
    country: '美国',
    displayMode: 'average' as const,
    scaleType: 'linear' as const
  })

  const handleChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-4">
      {/* First Row Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">应用选择</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.app}
            onChange={(e) => handleChange('app', e.target.value)}
          >
            {['App-1', 'App-2', 'App-3', 'App-4', 'App-5'].map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">国家地区</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.country}
            onChange={(e) => handleChange('country', e.target.value)}
          >
            {['美国', '英国'].map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Second Row Controls */}
      <div className="flex flex-wrap gap-8 pt-2">
        <div>
          <label className="block text-sm font-medium mb-2">数据显示模式</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.displayMode === 'average'}
                onChange={() => handleChange('displayMode', 'average')}
              />
              <span>显示移动平均值</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.displayMode === 'raw'}
                onChange={() => handleChange('displayMode', 'raw')}
              />
              <span>显示原始数据</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Y轴刻度</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.scaleType === 'linear'}
                onChange={() => handleChange('scaleType', 'linear')}
              />
              <span>线性刻度</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={filters.scaleType === 'log'}
                onChange={() => handleChange('scaleType', 'log')}
              />
              <span>对数刻度</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
