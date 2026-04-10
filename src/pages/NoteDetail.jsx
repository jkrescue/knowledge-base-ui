import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag, Link2 } from 'lucide-react'

// 模拟笔记详情数据
const noteDetails = {
  '2026-04-12': {
    title: '2026-04-12 日报',
    date: '2026-04-12',
    tags: ['daily', 'karpathy-wiki', 'project'],
    content: `
# 2026-04-12 日报

## 🌅 今日概览
- **日期**: 2026-04-12
- **心情**: 😊
- **能量值**: ⭐⭐⭐⭐⭐

## ✅ 今日完成

### 健康运动
- [x] 早晨跑步 5 公里
- [x] 晚上瑜伽 30 分钟
- [x] 健康饮食，控制碳水摄入

### 阅读学习
- [x] 阅读《深度学习》第 3 章
- [x] 学习了 PyTorch 的新特性
- [x] 整理了读书笔记

### 项目进展
- [x] 完成了知识库升级的测试
- [x] 优化了 organize 脚本的关键词识别
- [x] 修复了 Home.md 更新的 bug

## 📝 今日收获

1. **健康习惯养成**
   - 运动让生活更有活力
   - 冥想帮助集中注意力

2. **学习效率提升**
   - 读书笔记整理到知识库
   - 使用双向链接关联知识点

## 🔗 相关链接

- [[Topics/Life/|生活记录]]
- [[Topics/Projects/Karpathy-LLM-Wiki|项目主页]]
- [[Home|知识库首页]]
    `,
    backlinks: [
      { id: 'karpathy-wiki', title: 'Karpathy LLM Wiki 升级' },
      { id: 'life', title: '生活记录' },
    ]
  },
  'karpathy-wiki': {
    title: 'Karpathy LLM Wiki 升级',
    date: '2026-04-10',
    tags: ['knowledge-base', 'llm', 'obsidian'],
    content: `
# Karpathy LLM Wiki 升级

> 基于 Karpathy 理念的个人知识库升级项目

## 📋 项目信息

- **状态**: 进行中
- **进度**: 85%
- **优先级**: P1
- **开始时间**: 2026-04-10
- **标签**: #knowledge-base #llm #obsidian

## 🎯 目标

将现有的时间线记录系统升级为 AI 主动维护的知识网络。

## ✅ 已完成

- [x] 创建 Topics/ 目录结构
- [x] 实现双向链接系统
- [x] 建立标签规范
- [x] 开发 \`work organize\` 命令
- [x] 迁移历史笔记
- [x] 设置自动整理
- [x] 扩展关键词识别
- [x] 知识图谱可视化
- [ ] 前端产品 PRD ← 当前

## 🔗 相关链接

- [[Topics/AI-Research/|AI 研究]]
- [[../../Home|知识库首页]]
- [[../../../.openclaw/workspace/CORE-WORKFLOW|工作模式文档]]
    `,
    backlinks: [
      { id: '2026-04-12', title: '2026-04-12 日报' },
      { id: '2026-04-11', title: '2026-04-11 日报' },
    ]
  },
}

function NoteDetail() {
  const { id } = useParams()
  const note = noteDetails[id] || {
    title: '笔记详情',
    date: '2026-04-10',
    tags: ['note'],
    content: '# 笔记内容\n\n暂无详细内容',
    backlinks: []
  }

  // 简单的 Markdown 渲染
  const renderMarkdown = (content) => {
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
        
        // 空行
        if (line.trim() === '') {
          return <div key={index} className="h-4" />
        }
        
        // 普通段落
        return <p key={index} className="text-gray-700 leading-relaxed mb-2">{renderInlineMarkdown(line)}</p>
      })
  }

  const renderInlineMarkdown = (text) => {
    // 处理内联样式
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/topics" className="hover:text-primary-600">Topics</Link>
        <span>/</span>
        <Link to="/topics" className="hover:text-primary-600">Projects</Link>
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
        {note.tags.map((tag, index) => (
          <span key={index} className="tag bg-primary-50 text-primary-600">
            #{tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <article className="card p-8">
        <div className="prose prose-gray max-w-none">
          {renderMarkdown(note.content)}
        </div>
      </article>

      {/* Backlinks */}
      {note.backlinks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Link2 size={20} />
            反向链接
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {note.backlinks.map((link, index) => (
              <Link
                key={index}
                to={`/note/${link.id}`}
                className="card card-hover p-4 block"
              >
                <h4 className="font-medium text-gray-900">{link.title}</h4>
                <p className="text-sm text-gray-500 mt-1">点击查看相关笔记</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="mt-8 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>创建于 {note.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag size={14} />
          <span>{note.tags.length} 个标签</span>
        </div>
      </div>
    </div>
  )
}

export default NoteDetail
