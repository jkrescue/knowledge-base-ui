import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  const handleKeyDown = useCallback((e) => {
    // 忽略输入框中的快捷键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // 但保留 Escape 键
      if (e.key !== 'Escape') return
    }

    // 需要 Cmd/Ctrl 的快捷键
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'k':
          // Cmd/Ctrl + K: 打开搜索
          e.preventDefault()
          navigate('/search')
          break
        case 'n':
          // Cmd/Ctrl + N: 新建笔记
          e.preventDefault()
          navigate('/new')
          break
        case 's':
          // Cmd/Ctrl + S: 保存（在编辑页面）
          // 由编辑页面自己处理
          break
        case '1':
          e.preventDefault()
          navigate('/')
          break
        case '2':
          e.preventDefault()
          navigate('/notes')
          break
        case '3':
          e.preventDefault()
          navigate('/graph')
          break
        case '4':
          e.preventDefault()
          navigate('/topics')
          break
        default:
          break
      }
    } else {
      // 不需要 Cmd/Ctrl 的快捷键
      switch (e.key) {
        case 'Escape':
          // Escape: 返回上一页或关闭弹窗
          if (window.history.length > 1) {
            window.history.back()
          }
          break
        case '?':
          // ?: 显示快捷键帮助
          if (!e.shiftKey) {
            // 可以显示一个快捷键帮助弹窗
            console.log('快捷键帮助')
          }
          break
        default:
          break
      }
    }
  }, [navigate])

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('kb_settings') || '{}')
    if (settings.keyboardShortcuts !== false) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

// 快捷键帮助组件
export function KeyboardShortcutsHelp() {
  const shortcuts = [
    { key: 'Cmd/Ctrl + K', description: '打开搜索' },
    { key: 'Cmd/Ctrl + N', description: '新建笔记' },
    { key: 'Cmd/Ctrl + S', description: '保存笔记' },
    { key: 'Cmd/Ctrl + 1', description: '跳转到仪表板' },
    { key: 'Cmd/Ctrl + 2', description: '跳转到日报' },
    { key: 'Cmd/Ctrl + 3', description: '跳转到知识图谱' },
    { key: 'Cmd/Ctrl + 4', description: '跳转到主题' },
    { key: 'Escape', description: '返回上一页' },
  ]

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">键盘快捷键</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-gray-600">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}
