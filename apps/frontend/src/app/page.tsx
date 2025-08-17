'use client'

import { Suspense, useState } from 'react'
import DataImportButton from './components/DataImportButton'
import ChartFilters from './components/ChartFilters'
import ROITrendChart from './components/ROITrendChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState({
    app: 'App-1',
    country: '美国',
    displayMode: 'average' as 'raw' | 'average',
    scaleType: 'linear' as 'linear' | 'log'
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    console.log('Filters changed:', newFilters)
  }

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center">请选择您的登录身份</h1>
          <Select onValueChange={(v) => setUserRole(v as 'user' | 'admin')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择身份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">普通用户</SelectItem>
              <SelectItem value="admin">管理员</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900 transition-colors duration-200">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{filters.app}-多时间维度ROI趋势</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userRole === 'admin' ? '管理员模式' : '普通用户模式'}
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost"
            onClick={() => setUserRole(null)}
            className="text-sm"
          >
            切换身份
          </Button>
          {userRole === 'admin' && (
            <DataImportButton onImportSuccess={() => setRefreshKey(k => k + 1)} />
          )}
        </div>
      </header>

      <section className="mb-8">
        <Suspense fallback={<div>加载筛选器...</div>}>
          <ChartFilters onFilterChange={handleFilterChange} />
        </Suspense>
      </section>

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
