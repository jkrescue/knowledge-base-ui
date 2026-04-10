import React, { useState, useEffect } from 'react'
import { Search, FileText, X, Calendar, Tag, Filter, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'

// 搜索历史存储
const SEARCH_HISTORY_KEY = 'kb_search_history'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // 高级筛选
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    hasTags: false
  })

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (history) {
      setSearchHistory(JSON.parse(history).slice(0, 10))
    }
  }, [])

  // 保存搜索历史
  const saveToHistory = (searchQuery) => {
    if (!searchQuery.trim()) return
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
  }

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim() && filters.type === 'all' && filters.dateRange === 'all') {
      setResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)
    saveToHistory(query)

    try {
      const response = await api.getNotes()
      if (response.success) {
        let filtered = response.data

        // 关键词搜索（高亮匹配）
        if (query.trim()) {
          const searchLower = query.toLowerCase()
          filtered = filtered.filter(note => 
            note.title.toLowerCase().includes(searchLower) ||
            (note.content && note.content.toLowerCase().includes(searchLower))
          )
        }

        // 类型筛选
        if (filters.type !== 'all') {
          filtered = filtered.filter(note => note.type === filters.type)
        }

        // 日期范围筛选
        if (filters.dateRange !== 'all') {
          const now = new Date()
          filtered = filtered.filter(note => {
            const noteDate = new Date(note.date)
            switch (filters.dateRange) {
              case 'today':
                return noteDate.toDateString() === now.toDateString()
              case 'week':
                const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
                return noteDate >= weekAgo
              case 'month':
                return noteDate.getMonth() === now.getMonth() && 
                       noteDate.getFullYear() === now.getFullYear()
              case 'year':
                return noteDate.getFullYear() === now.getFullYear()
              default:
                return true
            }
          })
        }

        // 按相关性排序（标题匹配优先）
        if (query.trim()) {
          filtered.sort((a, b) => {
            const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase())
            const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase())
            if (aTitleMatch && !bTitleMatch) return -1
            if (!aTitleMatch && bTitleMatch) return 1
            return new Date(b.date) - new Date(a.date)
          })
        }

        setResults(filtered)
      } else {
        setResults([])
      }
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
    setFilters({ type: 'all', dateRange: 'all', hasTags: false })
  }

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : part
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const typeLabels = {
    daily: '日报',
    projects: '项目',
    ai: 'AI研究',
    concepts: '概念',
    life: '生活',
    meetings: '会议',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">搜索</h2>
        <p className="text-gray-500 mt-1">搜索你的知识库笔记</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
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

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <Filter size={16} />
            {showAdvanced ? '隐藏高级筛选' : '高级筛选'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="card p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">笔记类型</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">全部类型</option>
                  <option value="daily">日报</option>
                  <option value="projects">项目</option>
                  <option value="ai">AI研究</option>
                  <option value="concepts">概念</option>
                  <option value="life">生活</option>
                  <option value="meetings">会议</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                  <option value="year">今年</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Search History */}
      {!hasSearched && searchHistory.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock size={16} />
              搜索历史
            </h3>
            <button
              onClick={() => {
                setSearchHistory([])
                localStorage.removeItem(SEARCH_HISTORY_KEY)
              }}
              className="text-xs text-gray-500 hover:text-red-600"
            >
              清除
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(term)
                  handleSearch()
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              搜索结果 {results.length > 0 && `(${results.length})`}
            </h3>
            {(query || filters.type !== 'all' || filters.dateRange !== 'all') && (
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1"
              >
                <X size={14} />
                清除筛选
              </button>
            )}
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
                      <h4 className="font-medium text-gray-900">
                        {highlightText(note.title, query)}
                      </h4>
                      {note.content && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {highlightText(
                            note.content.replace(/[#*\[\]]/g, '').substring(0, 200),
                            query
                          )}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(note.date)}
                        </span>
                        {note.type && (
                          <span className="flex items-center gap-1">
                            <Tag size={12} />
                            {typeLabels[note.type] || note.type}
                          </span>
                        )}
                      </div>
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
              <p className="text-gray-500 mt-1">尝试其他关键词或调整筛选条件</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Tips */}
      {!hasSearched && (
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">💡 搜索技巧</h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• 输入关键词搜索笔记标题和内容</li>
            <li>• 使用高级筛选按类型、时间范围过滤</li>
            <li>• 搜索结果按相关性排序，标题匹配优先</li>
            <li>• 匹配的关键词会在结果中高亮显示</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchPage
