import React, { useState } from 'react'
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react'

function DataManager() {
  const [importStatus, setImportStatus] = useState(null)
  const [exportStatus, setExportStatus] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // 导出数据
  const handleExport = async () => {
    setExportStatus('exporting')
    try {
      const response = await fetch('http://localhost:3001/api/notes')
      const data = await response.json()
      
      if (data.success) {
        // 创建 JSON 文件下载
        const exportData = {
          exportDate: new Date().toISOString(),
          totalNotes: data.data.length,
          notes: data.data
        }
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `knowledge-base-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setExportStatus('success')
        setTimeout(() => setExportStatus(null), 3000)
      }
    } catch (err) {
      console.error('Export error:', err)
      setExportStatus('error')
    }
  }

  // 导入数据
  const handleImport = async (file) => {
    setImportStatus('importing')
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!data.notes || !Array.isArray(data.notes)) {
        throw new Error('Invalid file format')
      }

      // 发送到后端导入
      const response = await fetch('http://localhost:3001/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setImportStatus('success')
        setTimeout(() => setImportStatus(null), 3000)
      } else {
        throw new Error('Import failed')
      }
    } catch (err) {
      console.error('Import error:', err)
      setImportStatus('error')
    }
  }

  // 拖拽处理
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImport(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">数据管理</h2>
        <p className="text-gray-500 mt-1">导入、导出你的知识库数据</p>
      </div>

      {/* Export Section */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">导出数据</h3>
            <p className="text-gray-500 mt-1">将所有笔记导出为 JSON 文件，用于备份或迁移</p>
            
            <button
              onClick={handleExport}
              disabled={exportStatus === 'exporting'}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {exportStatus === 'exporting' ? '导出中...' : '导出 JSON'}
            </button>

            {exportStatus === 'success' && (
              <div className="mt-3 flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span>导出成功！</span>
              </div>
            )}
            {exportStatus === 'error' && (
              <div className="mt-3 flex items-center gap-2 text-red-600">
                <AlertCircle size={18} />
                <span>导出失败，请重试</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Upload size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">导入数据</h3>
            <p className="text-gray-500 mt-1">从 JSON 文件导入笔记到知识库</p>
            
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
            >
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                拖拽文件到此处，或
                <label className="text-primary-600 hover:text-primary-700 cursor-pointer ml-1">
                  点击选择文件
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-400 mt-2">支持 .json 格式</p>
            </div>

            {importStatus === 'importing' && (
              <div className="mt-3 text-gray-600">导入中...</div>
            )}
            {importStatus === 'success' && (
              <div className="mt-3 flex items-center gap-2 text-green-600">
                <CheckCircle size={18} />
                <span>导入成功！</span>
              </div>
            )}
            {importStatus === 'error' && (
              <div className="mt-3 flex items-center gap-2 text-red-600">
                <AlertCircle size={18} />
                <span>导入失败，请检查文件格式</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">💡 数据管理提示</h3>
        <ul className="text-sm text-gray-500 space-y-2">
          <li>• 定期导出数据作为备份</li>
          <li>• 导入前建议先导出当前数据备份</li>
          <li>• 导入的文件必须是有效的 JSON 格式</li>
          <li>• 重复的笔记会根据标题自动跳过</li>
        </ul>
      </div>
    </div>
  )
}

export default DataManager
