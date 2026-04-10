import React from 'react'
import { FileText, Calendar, Briefcase, TrendingUp, Clock, CheckCircle2, Circle, MoreHorizontal } from 'lucide-react'

// 模拟数据
const stats = [
  { icon: FileText, label: '总笔记', value: 49, color: 'bg-blue-50 text-blue-600' },
  { icon: Calendar, label: '本周更新', value: 12, color: 'bg-green-50 text-green-600' },
  { icon: Briefcase, label: '活跃项目', value: 3, color: 'bg-purple-50 text-purple-600' },
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
    name: 'Mini-OpenClaw', 
    progress: 30, 
    status: '研究中',
    tags: ['ai', 'agent'],
    color: 'bg-orange-50 text-orange-600'
  },
]

const recentUpdates = [
  { title: '完成了知识库升级', time: '2小时前', type: 'project' },
  { title: '测试了 work organize 命令', time: '4小时前', type: 'feature' },
  { title: '优化了关键词识别', time: '昨天', type: 'improvement' },
  { title: '创建了项目仪表板', time: '昨天', type: 'feature' },
  { title: '完成了 PRD 设计', time: '2天前', type: 'design' },
]

const todos = {
  todo: [
    { title: '知识图谱可视化', priority: 'high' },
    { title: '智能问答系统', priority: 'medium' },
  ],
  inProgress: [
    { title: '前端产品 PRD', priority: 'high' },
  ],
  done: [
    { title: '知识库架构升级', priority: 'high' },
    { title: '自动整理功能', priority: 'medium' },
  ],
}

function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">欢迎回来 👋</h2>
          <p className="text-gray-500 mt-1">这是你今天的工作概览</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <span>+ 新建笔记</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
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
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              查看全部
            </button>
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
                    <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="tag bg-gray-100 text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">最近更新</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              查看全部
            </button>
          </div>
          
          <div className="card p-5">
            <div className="space-y-4">
              {recentUpdates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-primary-500 rounded-full" />
                    {index < recentUpdates.length - 1 && (
                      <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-200 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">{update.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Todo Board */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">待办事项</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Circle size={16} className="text-gray-400" />
              <span className="font-medium text-gray-700">待办</span>
              <span className="tag bg-gray-100 text-gray-600">{todos.todo.length}</span>
            </div>
            <div className="space-y-3">
              {todos.todo.map((item, index) => (
                <div key={index} className="card p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <span className={`tag mt-2 ${
                    item.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {item.priority === 'high' ? '高优先级' : '中优先级'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-primary-500" />
              <span className="font-medium text-gray-700">进行中</span>
              <span className="tag bg-primary-50 text-primary-600">{todos.inProgress.length}</span>
            </div>
            <div className="space-y-3">
              {todos.inProgress.map((item, index) => (
                <div key={index} className="card p-4 border-l-4 border-l-primary-500 cursor-pointer hover:shadow-md transition-shadow">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <span className="tag mt-2 bg-red-50 text-red-600">高优先级</span>
                </div>
              ))}
            </div>
          </div>

          {/* Done */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="font-medium text-gray-700">已完成</span>
              <span className="tag bg-green-50 text-green-600">{todos.done.length}</span>
            </div>
            <div className="space-y-3">
              {todos.done.map((item, index) => (
                <div key={index} className="card p-4 opacity-60 cursor-pointer hover:opacity-100 transition-opacity">
                  <p className="text-sm font-medium text-gray-900 line-through">{item.title}</p>
                  <span className="tag mt-2 bg-green-50 text-green-600">已完成</span>
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
