'use client'

import { Suspense, useState } from 'react'
import ChartFilters from './components/ChartFilters'
import ROITrendChart from './components/ROITrendChart'

export default function Home() {
  const [filters, setFilters] = useState({
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
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">App ROI数据分析系统</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">多时间维度ROI趋势 (7日移动平均)</p>
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
          />
        </Suspense>
      </section>

      {/* Footer Section */}
      <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>数据范围: 最近90天</p>
      </footer>
    </div>
  )
}
