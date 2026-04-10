import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag, Link2 } from 'lucide-react'
import { api } from '../api'

function NoteDetail() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.getNote(id)
        if (response.success) {
          setNote(response.data)
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

  // 简单的 Markdown 渲染
  const renderMarkdown = (content) => {
    if (!content) return null
    
    return content
      .split('\n')
      .map((line, index) => {
        // 标题
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-4 mb-2">{line.slice(4)}</h3>
        }
        
        // 引用块
        if (line.startsWith('> ')) {
          return <blockquote key={index} className="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-gray-50 italic text-gray-700">{line.slice(2)}</blockquote>
        }
        
        // 列表项
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 list-disc text-gray-700">{renderInlineMarkdown(line.slice(2))}</li>
        }
        if (line.startsWith('- [x] ')) {
          return <li key={index} className="ml-6 list-none text-gray-700 flex items-center gap-2"><span className="text-green-500">✓</span>{renderInlineMarkdown(line.slice(6))}</li>
        }
        if (line.startsWith('- [ ] ')) {
          return <li key={index} className="ml-6 list-none text-gray-700 flex items-center gap-2"><span className="text-gray-300">☐</span>{renderInlineMarkdown(line.slice(6))}</li>
        }
        
        // 空行
        if (line.trim() === '') {
          return <div key={index} className="h-4" />
        }
        
        // 普通段落
        return <p key={index} className="text-gray-700 leading-relaxed mb-2">{renderInlineMarkdown(line)}</p>
      })
  }

  const renderInlineMarkdown = (text) => {
    if (!text) return null
    
    let result = text
    
    // 加粗
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 代码
    result = result.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // 双向链接
    result = result.replace(/\[\[(.+?)\]\]/g, '<span class="text-primary-600 hover:underline cursor-pointer">$1</span>')
    
    return <span dangerouslySetInnerHTML={{ __html: result }} />
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error || '笔记不存在'}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/notes" className="hover:text-primary-600">笔记</Link>
        <span>/</span>
        <span className="text-gray-900">{note.title}</span>
      </div>

      {/* Back Button */}
      <Link 
        to="/notes" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft size={18} />
        <span>返回列表</span>
      </Link>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-6">
        <span className="tag bg-primary-50 text-primary-600">
          {note.type === 'daily' ? '日报' : note.type}
        </span>
      </div>

      {/* Content */}
      <article className="card p-8">
        <div className="prose prose-gray max-w-none">
          {renderMarkdown(note.content)}
        </div>
      </article>

      {/* Meta */}
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
    </div>
  )
}

export default NoteDetail
