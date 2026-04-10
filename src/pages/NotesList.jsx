import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Tag,
  ChevronRight
} from 'lucide-react'

// 模拟笔记数据
const notesData = [
  {
    id: '2026-04-12',
    title: '2026-04-12 日报',
    summary: '完成了知识库升级，测试了 work organize 命令。学习了 Karpathy 的 LLM Wiki 理念...',
    date: '2026-04-12',
    tags: ['daily', 'karpathy-wiki', 'project'],
    type: 'daily',
  },
  {
    id: '2026-04-11',
    title: '2026-04-11 日报',
    summary: '测试了知识库升级系统。完成了代码审查，修复了3个bug。参加了技术分享会...',
    date: '2026-04-11',
    tags: ['daily', 'test', 'project'],
    type: 'daily',
  },
  {
    id: 'karpathy-wiki',
    title: 'Karpathy LLM Wiki 升级',
    summary: '基于 Karpathy 理念的个人知识库升级项目。从时间线记录升级为知识网络...',
    date: '2026-04-10',
    tags: ['knowledge-base', 'llm', 'obsidian'],
    type: 'projects',
  },
  {
    id: 'voice-assistant',
    title: '工作日报语音助手',
    summary: '完整的语音工作记录工具。支持语音转文字、自然语言解析、自动生成日报...',
    date: '2026-03-26',
    tags: ['voice', 'automation', 'daily-report'],
    type: 'projects',
  },
  {
    id: 'llm-concept',
    title: 'LLM Wiki 模式',
    summary: 'Andrej Karpathy 提出的知识库架构。Markdown 优先 + LLM 主动维护 + 双向链接...',
    date: '2026-04-10',
    tags: ['concept', 'knowledge-base', 'llm'],
    type: 'concepts',
  },
  {
    id: 'mini-openclaw',
    title: 'Mini-OpenClaw',
    summary: 'AI Agent 框架研究项目。研究和理解 Mini-OpenClaw 的技术架构...',
    date: '2026-03-29',
    tags: ['ai', 'agent', 'framework'],
    type: 'projects',
  },
]

const tagFilters = [
  { id: 'all', label: '全部', count: notesData.length },
  { id: 'daily', label: '日报', count: notesData.filter(n => n.type === 'daily').length },
  { id: 'projects', label: '项目', count: notesData.filter(n => n.type === 'projects').length },
  { id: 'ai', label: 'AI研究', count: notesData.filter(n => n.type === 'ai').length },
  { id: 'concepts', label: '概念', count: notesData.filter(n => n.type === 'concepts').length },
]

const typeColors = {
  daily: 'bg-blue-50 text-blue-600',
  projects: 'bg-pink-50 text-pink-600',
  ai: 'bg-orange-50 text-orange-600',
  concepts: 'bg-teal-50 text-teal-600',
  life: 'bg-purple-50 text-purple-600',
}

function NotesList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const filteredNotes = notesData.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === 'all' || note.type === selectedTag
    return matchesSearch && matchesTag
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{note.summary}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="tag bg-gray-100 text-gray-600 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {note.date}
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
