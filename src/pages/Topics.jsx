import React, { useState, useEffect } from 'react'
import { Search, FileText, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api'

// 模拟数据
const mockTopics = [
  { id: 'ai-research', name: 'AI 研究', count: 8, color: 'bg-orange-50 text-orange-600' },
  { id: 'projects', name: '项目追踪', count: 10, color: 'bg-pink-50 text-pink-600' },
  { id: 'concepts', name: '概念知识', count: 6, color: 'bg-teal-50 text-teal-600' },
  { id: 'life', name: '生活记录', count: 5, color: 'bg-purple-50 text-purple-600' },
  { id: 'meetings', name: '会议纪要', count: 3, color: 'bg-yellow-50 text-yellow-600' },
  { id: 'people', name: '人脉网络', count: 2, color: 'bg-indigo-50 text-indigo-600' },
]

function Topics() {
  const [topics, setTopics] = useState(mockTopics)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 尝试从 API 获取数据
    const fetchTopics = async () => {
      try {
        const response = await api.getNotes()
        if (response.success) {
          // 统计各主题数量
          const counts = {}
          response.data.forEach(note => {
            const type = note.type || 'other'
            counts[type] = (counts[type] || 0) + 1
          })
          
          // 更新主题数量
          const updatedTopics = topics.map(t => ({
            ...t,
            count: counts[t.id] || t.count
          }))
          setTopics(updatedTopics)
        }
      } catch (err) {
        console.log('使用模拟数据')
      }
    }

    fetchTopics()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">加载中...</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">主题分类</h2>
          <p className="text-gray-500 mt-1">按主题浏览你的知识库</p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/notes?topic=${topic.id}`}
            className="card card-hover p-6 block"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${topic.color}`}>
                <FileText size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{topic.count}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">{topic.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{topic.count} 篇笔记</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="card p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{topics.length}</p>
            <p className="text-sm text-gray-500">主题数量</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {topics.reduce((sum, t) => sum + t.count, 0)}
            </p>
            <p className="text-sm text-gray-500">总笔记数</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topics
