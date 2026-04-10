import React, { useState, useEffect } from 'react'
import { Network, Link2, FileText, TrendingUp, Clock } from 'lucide-react'
import { api } from '../api'

function NoteAnalytics() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalNotes: 0,
    totalLinks: 0,
    orphanedNotes: [],
    mostConnected: [],
    recentActivity: [],
    typeDistribution: {}
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [notesRes, graphRes] = await Promise.all([
        api.getNotes().catch(() => ({ success: true, data: [] })),
        api.getGraph().catch(() => ({ success: true, data: { nodes: [], links: [] } }))
      ])

      if (notesRes.success && graphRes.success) {
        const notesData = notesRes.data
        const graphData = graphRes.data

        // 计算分析数据
        const totalNotes = notesData.length
        const totalLinks = graphData.links?.length || 0

        // 找出孤立笔记（没有链接的笔记）
        const linkedNoteIds = new Set()
        graphData.links?.forEach(link => {
          linkedNoteIds.add(link.source)
          linkedNoteIds.add(link.target)
        })
        const orphanedNotes = notesData.filter(note => !linkedNoteIds.has(note.id))

        // 找出连接最多的笔记
        const connectionCount = {}
        graphData.links?.forEach(link => {
          connectionCount[link.source] = (connectionCount[link.source] || 0) + 1
          connectionCount[link.target] = (connectionCount[link.target] || 0) + 1
        })
        const mostConnected = Object.entries(connectionCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id, count]) => ({
            note: notesData.find(n => n.id === id),
            count
          }))
          .filter(item => item.note)

        // 类型分布
        const typeDistribution = notesData.reduce((acc, note) => {
          const type = note.type || 'other'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {})

        // 最近活动（按日期排序）
        const recentActivity = [...notesData]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10)

        setAnalytics({
          totalNotes,
          totalLinks,
          orphanedNotes,
          mostConnected,
          recentActivity,
          typeDistribution
        })
        setNotes(notesData)
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const typeLabels = {
    daily: '日报',
    projects: '项目',
    ai: 'AI研究',
    concepts: '概念',
    life: '生活',
    meetings: '会议',
    other: '其他'
  }

  const typeColors = {
    daily: 'bg-blue-500',
    projects: 'bg-pink-500',
    ai: 'bg-orange-500',
    concepts: 'bg-teal-500',
    life: 'bg-purple-500',
    meetings: 'bg-yellow-500',
    other: 'bg-gray-500'
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">加载分析数据...</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">笔记分析</h2>
        <p className="text-gray-500 mt-1">深入了解你的知识库结构和连接</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalNotes}</p>
              <p className="text-sm text-gray-500">总笔记数</p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Link2 size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalLinks}</p>
              <p className="text-sm text-gray-500">总连接数</p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Network size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalNotes > 0 ? (analytics.totalLinks / analytics.totalNotes).toFixed(1) : 0}
              </p>
              <p className="text-sm text-gray-500">平均连接数</p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.mostConnected.length}</p>
              <p className="text-sm text-gray-500">核心笔记</p>
            </div>
          </div>
        </div>
      </div>

      {/* Type Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">笔记类型分布</h3>
        <div className="space-y-3">
          {Object.entries(analytics.typeDistribution).map(([type, count]) => {
            const percentage = (count / analytics.totalNotes * 100).toFixed(1)
            return (
              <div key={type} className="flex items-center gap-4">
                <span className="w-20 text-sm text-gray-600">{typeLabels[type] || type}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${typeColors[type] || 'bg-gray-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-16 text-sm text-gray-500 text-right">{count} ({percentage}%)</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Connected Notes */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Network size={18} className="text-primary-500" />
            核心笔记（连接最多）
          </h3>
          {analytics.mostConnected.length > 0 ? (
            <div className="space-y-3">
              {analytics.mostConnected.map(({ note, count }) => (
                <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{note.title}</p>
                    <p className="text-xs text-gray-500">{typeLabels[note.type] || note.type}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {count} 个连接
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无连接数据</p>
          )}
        </div>

        {/* Orphaned Notes */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-orange-500" />
            孤立笔记（无连接）
          </h3>
          {analytics.orphanedNotes.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analytics.orphanedNotes.map(note => (
                <div key={note.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-900">{note.title}</span>
                  <span className="text-xs text-gray-500">{typeLabels[note.type] || note.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-green-600 font-medium">🎉 所有笔记都有连接！</p>
              <p className="text-gray-500 text-sm mt-1">你的知识网络很健康</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-primary-500" />
          最近活动
        </h3>
        <div className="space-y-3">
          {analytics.recentActivity.map(note => (
            <div key={note.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-2 h-2 rounded-full ${typeColors[note.type] || 'bg-gray-400'}`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{note.title}</p>
                <p className="text-xs text-gray-500">{typeLabels[note.type] || note.type}</p>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(note.date).toLocaleDateString('zh-CN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 优化建议</h3>
        <ul className="space-y-2 text-gray-600">
          {analytics.orphanedNotes.length > 5 && (
            <li>• 你有 {analytics.orphanedNotes.length} 篇孤立笔记，建议添加双向链接将它们连接到知识网络中</li>
          )}
          {analytics.totalLinks / analytics.totalNotes < 1 && (
            <li>• 平均每个笔记的连接数较低，尝试在笔记中添加更多 [[双向链接]]</li>
          )}
          <li>• 核心笔记是知识网络的枢纽，确保它们的内容质量高且保持更新</li>
          <li>• 定期回顾孤立笔记，看看是否可以与其他笔记建立联系</li>
        </ul>
      </div>
    </div>
  )
}

export default NoteAnalytics
