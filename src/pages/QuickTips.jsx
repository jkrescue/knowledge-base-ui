import React from 'react'
import { useTheme } from '../ThemeContext'

function QuickTips() {
  const { toggleTheme } = useTheme()

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">快速提示</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>利用快捷键提升工作效率</li>
        <li>保存常用笔记模板以便快速使用</li>
        <li>定期导出数据以防丢失</li>
        <li>使用标签组织你的笔记</li>
        <li>若想调整界面主题，前往设置调整</li>
      </ul>
      <button
        onClick={toggleTheme}
        className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        切换主题
      </button>
    </div>
  )
}

export default QuickTips
