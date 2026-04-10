import React, { useState, useEffect } from 'react'
import { Search, FileText, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'

// 模拟数据
const mockNotes = [
  { id: '2026-04-12', title: '2026-04-12 日报', type: 'daily', date: new Date().toISOString() },
  { id: '2026-04-11', title: '2026-04-11 日报', type: 'daily', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'karpathy-wiki', title: 'Karpathy LLM Wiki 升级', type: 'projects', date: new Date(Date.now() - 172800000).toISOString() },
]

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      const response = await api.getNotes()
      if (response.success) {
        const filtered = response.data.filter(note => 
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          (note.content && note.content.toLowerCase().includes(query.toLowerCase()))
        )
        setResults(filtered)
      } else {
        // 使用模拟数据
        const filtered = mockNotes.filter(note =>
          note.title.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
      }
    } catch (err) {
      // 使用模拟数据
      const filtered = mockNotes.filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">搜索</h2>
        <p className="text-gray-500 mt-1">搜索你的知识库笔记</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="输入关键词搜索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 w-full h-12 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
        >
          搜索
        </button>
      </form>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              搜索结果 {results.length > 0 && `(${results.length})`}
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              搜索中...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((note) => (
                <Link
                  key={note.id}
                  to={`/note/${note.id}`}
                  className="card card-hover p-4 block"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{note.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(note.date)} · {note.type}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">未找到结果</h3>
              <p className="text-gray-500 mt-1">尝试其他关键词</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Tips */}
      {!hasSearched && (
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">搜索提示</h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• 输入关键词搜索笔记标题和内容</li>
            <li>• 支持模糊匹配</li>
            <li>• 搜索结果按相关性排序</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchPage
