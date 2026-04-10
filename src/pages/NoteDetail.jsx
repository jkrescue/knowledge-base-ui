import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag, Edit2, Save, X, Trash2, AlertCircle } from 'lucide-react'
import { api } from '../api'

function NoteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [editedTitle, setEditedTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.getNote(id)
        if (response.success) {
          setNote(response.data)
          setEditedContent(response.data.content)
          setEditedTitle(response.data.title)
        }
      } catch (err) {
        console.error('Error fetching note:', err)
        setError('无法加载笔记')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [id])

  // 保存笔记
  const handleSave = async () => {
    setSaveStatus('保存中...')
    try {
      // 调用后端 API 保存
      const response = await fetch(`http://localhost:3001/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent
        })
      })
      
      if (response.ok) {
        setNote({ ...note, title: editedTitle, content: editedContent })
        setIsEditing(false)
        setSaveStatus('保存成功！')
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        throw new Error('保存失败')
      }
    } catch (err) {
      console.error('Save error:', err)
      setSaveStatus('保存失败，请重试')
    }
  }

  // 删除笔记
  const handleDelete = async () => {
    if (!window.confirm('确定要删除这篇笔记吗？此操作不可撤销。')) {
      return
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/notes/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        navigate('/notes')
      } else {
        throw new Error('删除失败')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('删除失败，请重试')
    }
  }

  // 取消编辑
  const handleCancel = () => {
    setEditedContent(note.content)
    setEditedTitle(note.title)
    setIsEditing(false)
  }

  // Markdown 渲染
  const renderMarkdown = (content) => {
    if (!content) return null
    
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>
        }
        if (line.startsWith('> ')) {
          return <blockquote key={index} className="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-gray-50 italic text-gray-700">{line.slice(2)}</blockquote>
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 list-disc text-gray-700">{renderInlineMarkdown(line.slice(2))}</li>
        }
        if (line.startsWith('- [x] ')) {
          return <li key={index} className="ml-6 list-none text-gray-700 flex items-center gap-2"><span className="text-green-500">✓</span>{renderInlineMarkdown(line.slice(6))}</li>
        }
        if (line.startsWith('- [ ] ')) {
          return <li key={index} className="ml-6 list-none text-gray-700 flex items-center gap-2"><span className="text-gray-300">☐</span>{renderInlineMarkdown(line.slice(6))}</li>
        }
        if (line.trim() === '') {
          return <div key={index} className="h-4" />
        }
        return <p key={index} className="text-gray-700 leading-relaxed mb-2">{renderInlineMarkdown(line)}</p>
      })
  }

  const renderInlineMarkdown = (text) => {
    if (!text) return null
    let result = text
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
    result = result.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    result = result.replace(/\[\[(.+?)\]\]/g, '<span class="text-primary-600 hover:underline cursor-pointer">$1</span>')
    return <span dangerouslySetInnerHTML={{ __html: result }} />
  }

  const formatDate = (dateString) => {
    if (!dateString) return '未知日期'
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">加载中...</div>
  }

  if (error || !note) {
    return <div className="flex items-center justify-center h-64 text-red-500">{error || '笔记不存在'}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/notes" className="hover:text-primary-600">笔记</Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{note.title}</span>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/notes" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600">
          <ArrowLeft size={18} />
          <span>返回列表</span>
        </Link>

        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className={`text-sm ${saveStatus.includes('成功') ? 'text-green-600' : 'text-yellow-600'}`}>
              {saveStatus}
            </span>
          )}
          
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors"
              >
                <Save size={18} />
                保存
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
                编辑
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                删除
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tags */}
      {!isEditing && (
        <div className="flex items-center gap-2 mb-6">
          <span className="tag bg-primary-50 text-primary-600">
            {note.type === 'daily' ? '日报' : note.type}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="card">
        {isEditing ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">内容 (Markdown)</label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        ) : (
          <article className="p-8 prose prose-gray max-w-none">
            {renderMarkdown(note.content)}
          </article>
        )}
      </div>

      {/* Meta */}
      {!isEditing && (
        <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>创建于 {formatDate(note.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={14} />
            <span>类型: {note.type}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoteDetail
