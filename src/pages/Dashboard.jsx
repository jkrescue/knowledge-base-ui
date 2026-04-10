import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Calendar, Briefcase, TrendingUp, Clock, CheckCircle2, Circle, AlertCircle, RefreshCw } from 'lucide-react'
import { api } from '../api'
import ConnectionStatus from './ConnectionStatus'

// 模拟数据（当 API 不可用时使用）
const mockStats = { totalNotes: 41, weeklyUpdates: 5, activeProjects: 10 }

const mockRecentNotes = [
  { id: '2026-04-12', title: '2026-04-12 日报', date: new Date().toISOString(), type: 'daily' },
  { id: '2026-04-11', title: '2026-04-11 日报', date: new Date(Date.now() - 86400000).toISOString(), type: 'daily' },
  { id: '2026-04-10', title: '2026-04-10 日报', date: new Date(Date.now() - 172800000).toISOString(), type: 'daily' },
  { id: 'karpathy-wiki', title: 'Karpathy LLM Wiki 升级', date: new Date(Date.now() - 259200000).toISOString(), type: 'projects' },
  { id: 'voice-assistant', title: '工作日报语音助手', date: new Date(Date.now() - 345600000).toISOString(), type: 'projects' },
]

function Dashboard() {
  return (
    <div>
      <ConnectionStatus />
      {/* 其他内容 */}
  const [stats, setStats] = useState(mockStats)
  const [recentNotes, setRecentNotes] = useState(mockRecentNotes)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingMockData, setUsingMockData] = useState(true)
  const [backendConnected, setBackendConnected] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 首先检查后端健康状态
      const healthResponse = await api.healthCheck().catch(() => null)
      
      if (!healthResponse?.success) {
        throw new Error('后端服务未连接')
      }
      
      setBackendConnected(true)

      // 并行获取统计数据和笔记
      const [statsResponse, notesResponse] = await Promise.all([
        api.getStats().catch(() => null),
        api.getNotes().catch(() => null)
      ])

      if (statsResponse?.success) {
        setStats(statsResponse.data)
      }

      if (notesResponse?.success && notesResponse.data.length > 0) {
        // 按日期排序，取最新的5条
        const sorted = notesResponse.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        )
        setRecentNotes(sorted.slice(0, 5))
        setUsingMockData(false)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('后端服务未连接，显示演示数据。如需查看真实数据，请在本地运行后端服务。')
      setBackendConnected(false)
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // 每30秒自动刷新一次
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const statCards = [
    { 
      icon: FileText, 
      label: '总笔记', 
      value: stats.totalNotes, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      icon: Calendar, 
      label: '本周更新', 
      value: stats.weeklyUpdates, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      icon: Briefcase, 
      label: '活跃项目', 
      value: stats.activeProjects, 
      color: 'bg-purple-50 text-purple-600' 
    },
  ]

  const projects = [
    { 
      name: 'Karpathy LLM Wiki 升级', 
      progress: 85, 
      status: '进行中',
      tags: ['knowledge-base', 'llm'],
      color: 'bg-pink-50 text-pink-600'
    },
    { 
      name: '工作日报语音助手', 
      progress: 100, 
      status: '已完成',
      tags: ['voice', 'automation'],
      color: 'bg-green-50 text-green-600'
    },
    { 
      name: 'Mini-OpenClaw 研究', 
      progress: 60, 
      status: '进行中',
      tags: ['openclaw', 'architecture'],
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      name: 'AutoDL + Cursor 配置', 
      progress: 90, 
      status: '测试中',
      tags: ['dev-tools', 'remote'],
      color: 'bg-orange-50 text-orange-600'
    },
  ]

  const todos = [
    { id: 1, text: '完成知识库前端开发', done: true },
    { id: 2, text: '优化移动端体验', done: false },
    { id: 3, text: '添加数据导出功能', done: true },
    { id: 4, text: '部署到 Netlify', done: false },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-1">
              <p className="text-yellow-800">{error}</p>
              <p className="text-yellow-600 text-sm mt-1">
                本地运行: cd kb-server && npm start
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
              重试
            </button>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">欢迎回来 👋</h2>
          <p className="text-gray-500 mt-1">这是你今天的工作概览</p>
        </div>
        <Link to="/new" className="btn-primary flex items-center gap-2">
          <span>+ 新建笔记</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card card-hover p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Projects - 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">活跃项目</h3>
            <Link to="/topics" className="text-sm text-primary-600 hover:text-primary-700 font-medium" id="view-all-projects">
              查看全部
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <div key={index} className="card card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 line-clamp-1">{project.name}</h4>
                  <span className={`tag ${project.color}`}>{project.status}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-10 text-right">{project.progress}%</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag bg-gray-100 text-gray-600 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Updates */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary-500" />
                最近更新
              </h3>
              <Link to="/notes" className="text-sm text-primary-600 hover:text-primary-700" id="view-all-updates">
                查看全部
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentNotes.map((note, index) => (
                <Link 
                  key={index}
                  to={`/note/${note.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {note.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(note.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Todo Board */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              待办事项
            </h3>
            
            <div className="space-y-2">
              {todos.map((todo) => (
                <div 
                  key={todo.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {todo.done ? (
                    <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle size={18} className="text-gray-300 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${todo.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
