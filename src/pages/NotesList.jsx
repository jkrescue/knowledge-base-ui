import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Calendar, Tag, FileText, X, ChevronDown } from 'lucide-react'
import { api } from '../api'

// 模拟数据
const mockNotes = [
  { id: '2026-04-12', title: '2026-04-12 日报', date: new Date().toISOString(), type: 'daily', tags: ['daily', 'project'], content: '今天完成了...' },
  { id: '2026-04-11', title: '2026-04-11 日报', date: new Date(Date.now() - 86400000).toISOString(), type: 'daily', tags: ['daily'], content: '测试了...' },
  { id: 'karpathy-wiki', title: 'Karpathy LLM Wiki 升级', date: new Date(Date.now() - 172800000).toISOString(), type: 'projects', tags: ['project', 'ai'], content: '知识库升级...' },
  { id: 'voice-assistant', title: '工作日报语音助手', date: new Date(Date.now() - 259200000).toISOString(), type: 'projects', tags: ['project', 'voice'], content: '语音助手...' },
  { id: 'llm-concept', title: 'LLM Wiki 模式', date: new Date(Date.now() - 345600000).toISOString(), type: 'concepts', tags: ['concept', 'ai'], content: '知识库架构...' },
]

const typeColors = {
  daily: 'bg-blue-50 text-blue-600',
  projects: 'bg-pink-50 text-pink-600',
  ai: 'bg-orange-50 text-orange-600',
  concepts: 'bg-teal-50 text-teal-600',
  life: 'bg-purple-50 text-purple-600',
  meetings: 'bg-yellow-50 text-yellow-600',
  people: 'bg-indigo-50 text-indigo-600',
}

const typeLabels = {
  daily: '日报',
  projects: '项目',
  ai: 'AI研究',
  concepts: '概念',
  life: '生活',
  meetings: '会议',
  people: '人脉',
}

const sortOptions = [
  { value: 'date-desc', label: '最新发布' },
  { value: 'date-asc', label: '最早发布' },
  { value: 'title-asc', label: '标题 A-Z' },
  { value: 'title-desc', label: '标题 Z-A' },
]

function NotesList() {
  const [notes, setNotes] = useState(mockNotes)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [viewMode, setViewMode] = useState('list')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  // 日期范围筛选
  const [dateRange, setDateRange] = useState('all')
  const dateRangeOptions = [
    { value: 'all', label: '全部时间' },
    { value: 'today', label: '今天' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'year', label: '今年' },
  ]

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.getNotes()
        if (response.success && response.data.length > 0) {
          setNotes(response.data)
        }
      } catch (err) {
        console.error('Error fetching notes:', err)
        setError('无法连接到后端服务，显示演示数据')
      }
    }

    fetchNotes()
  }, [])

  // 计算标签统计
  const tagCounts = notes.reduce((acc, note) => {
    const type = note.type || 'other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const tagFilters = [
    { id: 'all', label: '全部', count: notes.length },
    { id: 'daily', label: '日报', count: tagCounts.daily || 0 },
    { id: 'projects', label: '项目', count: tagCounts.projects || 0 },
    { id: 'ai', label: 'AI研究', count: tagCounts.ai || 0 },
    { id: 'concepts', label: '概念', count: tagCounts.concepts || 0 },
    { id: 'life', label: '生活', count: tagCounts.life || 0 },
  ]

  // 筛选和排序逻辑
  const filteredAndSortedNotes = React.useMemo(() => {
    let result = [...notes]

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(note => 
        note.title.toLowerCase().includes(query) ||
        (note.content && note.content.toLowerCase().includes(query))
      )
    }

    // 标签筛选
    if (selectedTag !== 'all') {
      result = result.filter(note => note.type === selectedTag)
    }

    // 日期范围筛选
    if (dateRange !== 'all') {
      const now = new Date()
      result = result.filter(note => {
        const noteDate = new Date(note.date)
        switch (dateRange) {
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

    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date)
        case 'date-asc':
          return new Date(a.date) - new Date(b.date)
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return result
  }, [notes, searchQuery, selectedTag, dateRange, sortBy])

  // 分页
  const totalPages = Math.ceil(filteredAndSortedNotes.length / itemsPerPage)
  const paginatedNotes = filteredAndSortedNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 重置页码当筛选条件改变
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTag, dateRange, sortBy])

  const formatDate = (dateString) => {
    if (!dateString) return '未知日期'
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 清除所有筛选
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTag('all')
    setDateRange('all')
    setSortBy('date-desc')
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">笔记列表</h2>
          <p className="text-gray-500 mt-1">
            共 {filteredAndSortedNotes.length} 篇笔记
            {filteredAndSortedNotes.length !== notes.length && ` (筛选自 ${notes.length} 篇)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            列表视图
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            网格视图
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索笔记标题和内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-12 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Tag Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-400" />
            {tagFilters.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`tag transition-colors ${
                  selectedTag === tag.id 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag.label}
                <span className="ml-1.5 opacity-70">{tag.count}</span>
              </button>
            ))}
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
          >
            更多筛选
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(searchQuery || selectedTag !== 'all' || dateRange !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X size={14} />
              清除筛选
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="card p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
              <div className="flex gap-2 flex-wrap">
                {dateRangeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setDateRange(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      dateRange === option.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {paginatedNotes.map((note) => (
          <Link
            key={note.id}
            to={`/note/${note.id}`}
            className="card card-hover p-5 block"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[note.type] || 'bg-gray-100'}`}>
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{note.title}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {(note.content || '').replace(/[#*\[\]]/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className={`tag ${typeColors[note.type] || 'bg-gray-100 text-gray-600'} text-xs`}>
                      {typeLabels[note.type] || note.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(note.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      )}

      {/* Empty State */}
      {paginatedNotes.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">没有找到笔记</h3>
          <p className="text-gray-500 mt-1">尝试调整搜索条件或筛选标签</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            清除所有筛选
          </button>
        </div>
      )}
    </div>
  )
}

export default NotesList
