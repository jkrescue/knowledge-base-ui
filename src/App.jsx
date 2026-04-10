import React, { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Share2, 
  Calendar, 
  FolderOpen, 
  Search,
  Settings,
  User,
  Menu,
  X,
  Database,
  Tag,
  BarChart3
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import KnowledgeGraph from './pages/KnowledgeGraph'
import NotesList from './pages/NotesList'
import NoteDetail from './pages/NoteDetail'
import Topics from './pages/Topics'
import UserInterface from './pages/UserInterface'
import TagManager from './pages/TagManager'
import NoteAnalytics from './pages/NoteAnalytics'
import SearchPage from './pages/SearchPage'
import NewNote from './pages/NewNote'
import DataManager from './pages/DataManager'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: '仪表板' },
    { path: '/graph', icon: Share2, label: '知识图谱' },
    { path: '/notes', icon: Calendar, label: '日报' },
    { path: '/topics', icon: FolderOpen, label: '主题' },
    { path: '/search', icon: Search, label: '搜索' },
    { path: '/data', icon: Database, label: '数据管理' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-60' : 'w-0'} 
          bg-white border-r border-gray-200 flex flex-col transition-all duration-300
          ${sidebarOpen ? '' : 'overflow-hidden'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="font-semibold text-gray-900">Knowledge Base</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">User</p>
              <p className="text-xs text-gray-500 truncate">user@example.com</p>
            </div>
            <Settings size={16} className="text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-gray-900">知识库</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/graph" element={<KnowledgeGraph />} />
            <Route path="/notes" element={<NotesList />} />
            <Route path="/note/:id" element={<NoteDetail />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/new" element={<NewNote />} />
            <Route path="/data" element={<DataManager />} />
            <Route path="/settings" element={<UserInterface />} />
            <Route path="/tags" element={<TagManager />} />
            <Route path="/analytics" element={<NoteAnalytics />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
