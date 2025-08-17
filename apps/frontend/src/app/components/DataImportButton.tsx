'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function DataImportButton({ onImportSuccess }: { onImportSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/data/import', {
        method: 'POST',
        body: formData
      })

      const resData = await response.json()

      if (!response.ok) {
        toast.error(`CSV数据导入失败 ${resData.message}`)
        throw new Error(resData.message)
      }

      if (!resData.success) {
        toast.error(`CSV数据导入失败 ${resData.message}`)
        throw new Error(resData.message)
      }

      toast.success(`CSV数据已成功导入系统, 导入${resData.count}行`)
      onImportSuccess?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      e.target.value = '' // 重置input
    }
  }

  return (
    <div className="relative">
      <Button asChild variant="outline" disabled={isLoading}>
        <label>
          {isLoading ? '导入中...' : '导入CSV数据'}
          <input 
            type="file" 
            accept=".csv"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>
      </Button>
    </div>
  )
}
