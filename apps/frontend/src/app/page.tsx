'use client'

import { Suspense, useState, useCallback } from 'react'
import DataImportButton from './components/DataImportButton'
import ChartFilters from './components/ChartFilters'
import ROITrendChart from './components/ROITrendChart'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState<{
    app: string
    country: string
    displayMode: 'raw' | 'average'
    scaleType: 'linear' | 'log'
  }>({
    app: 'App-1',
    country: '美国',
    displayMode: 'average',
    scaleType: 'linear'
  })

  const handleFilterChange = (newFilters: {
    app: string
    country: string
    displayMode: 'raw' | 'average'
    scaleType: 'linear' | 'log'
  }) => {
    setFilters(newFilters)
    // TODO: 触发数据重新获取
    console.log('Filters changed:', newFilters)
  }
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Title Section */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{filters.app}-多时间维度ROI趋势</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filters.displayMode === 'average' ? '(7日移动平均)' : '(原始数据)'}
          </p>
        </div>
        <DataImportButton onImportSuccess={() => setRefreshKey(k => k + 1)} />
      </header>

      {/* Filters Section */}
      <section className="mb-8">
        <Suspense fallback={<div>加载筛选器...</div>}>
          <ChartFilters onFilterChange={handleFilterChange} />
        </Suspense>
      </section>

      {/* Chart Section */}
      <section className="h-[600px]">
        <Suspense fallback={<div>加载图表数据...</div>}>
          <ROITrendChart 
            app={filters.app}
            country={filters.country}
            displayMode={filters.displayMode}
            scaleType={filters.scaleType}
            refreshKey={refreshKey}
          />
        </Suspense>
      </section>
    </div>
  )
}
