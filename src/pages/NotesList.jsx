import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search, Filter, Calendar, ChevronRight, AlertCircle } from 'lucide-react'
import { api } from '../api'

// 模拟数据
const mockNotes = [
  { id: '2026-04-12', title: '2026-04-12 日报', date: new Date().toISOString(), type: 'daily', content: '今天完成了知识库升级...' },
  { id: '2026-04-11', title: '2026-04-11 日报', date: new Date(Date.now() - 86400000).toISOString(), type: 'daily', content: '测试了知识库系统...' },
  { id: '2026-04-10', title: '2026-04-10 日报', date: new Date(Date.now() - 172800000).toISOString(), type: 'daily', content: '完成了PRD设计...' },
  { id: 'karpathy-wiki', title: 'Karpathy LLM Wiki 升级', date: new Date(Date.now() - 259200000).toISOString(), type: 'projects', content: '基于Karpathy理念的知识库升级...' },
  { id: 'voice-assistant', title: '工作日报语音助手', date: new Date(Date.now() - 345600000).toISOString(), type: 'projects', content: '语音工作记录工具...' },
  { id: 'llm-concept', title: 'LLM Wiki 模式', date: new Date(Date.now() - 432000000).toISOString(), type: 'concepts', content: 'Andrej Karpathy提出的知识库架构...' },
  { id: 'mini-openclaw', title: 'Mini-OpenClaw', date: new Date(Date.now() - 518400000).toISOString(), type: 'projects', content: 'AI Agent框架研究...' },
  { id: 'ai-research', title: 'AI 研究笔记', date: new Date(Date.now() - 604800000).toISOString(), type: 'ai', content: '大语言模型研究...' },
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

function NotesList() {
  const [notes, setNotes] = useState(mockNotes)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 组件挂载时尝试获取真实数据，但默认显示模拟数据
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.getNotes()
        if (response.success && response.data.length > 0) {
          setNotes(response.data)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching notes:', err)
        setError('无法连接到后端服务，显示演示数据。如需查看真实数据，请在本地运行后端服务。')
        // 保持模拟数据
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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTag = selectedTag === 'all' || note.type === selectedTag
    return matchesSearch && matchesTag
  })

  const formatDate = (dateString) => {
    if (!dateString) return '未知日期'
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
      {/* 警告提示 */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-yellow-800">{error}</p>
            <p className="text-xs text-yellow-600 mt-1">
              如需查看真实数据，请在本地运行后端服务: cd kb-server && npm start
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">笔记列表</h2>
          <p className="text-gray-500 mt-1">共 {filteredNotes.length} 篇笔记</p>
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
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-full border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400 mr-2" />
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
      </div>

      {/* Notes List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
        {filteredNotes.map((note) => (
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
                  <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
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

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">没有找到笔记</h3>
          <p className="text-gray-500 mt-1">尝试调整搜索条件或筛选标签</p>
        </div>
      )}
    </div>
  )
}

export default NotesList
