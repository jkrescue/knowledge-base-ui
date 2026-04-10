import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, X, FileText } from 'lucide-react'

function NewNote() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('daily')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('请输入标题')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type })
      })

      if (response.ok) {
        const data = await response.json()
        navigate(`/note/${data.data.id}`)
      } else {
        const err = await response.json()
        throw new Error(err.error || '保存失败')
      }
    } catch (err) {
      console.error('Save error:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const insertTemplate = () => {
    const template = `## 🌅 今日概览
- **日期**: ${new Date().toLocaleDateString('zh-CN')}
- **心情**: 
- **能量值**: ⭐⭐⭐⭐⭐

## ✅ 今日完成

- [ ] 任务 1
- [ ] 任务 2

## 📝 今日收获

1. 
2. 

## 🔗 相关链接

- 
`
    setContent(template)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600">
          <ArrowLeft size={18} />
          <span>返回</span>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">新建笔记</h2>
        <div className="w-20"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="card p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">标题 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入笔记标题..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="daily">日报</option>
            <option value="projects">项目</option>
            <option value="ai">AI研究</option>
            <option value="concepts">概念</option>
            <option value="life">生活</option>
            <option value="meetings">会议</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">内容 (Markdown)</label>
            <button
              type="button"
              onClick={insertTemplate}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              插入模板
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入笔记内容..."
            rows={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-6 card p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">💡 提示</h3>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>• 支持 Markdown 语法</li>
          <li>• 使用 <code className="bg-gray-100 px-1 rounded">[[笔记名]]</code> 创建双向链接</li>
          <li>• 使用 <code className="bg-gray-100 px-1 rounded">- [ ]</code> 创建待办事项</li>
        </ul>
      </div>
    </div>
  )
}

export default NewNote
