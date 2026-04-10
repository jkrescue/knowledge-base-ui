import React, { useState, useEffect } from 'react'
import { Moon, Sun, Monitor, Keyboard, Bell, Shield } from 'lucide-react'
import { useTheme } from '../ThemeContext'

export function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    autoSave: true,
    autoSaveInterval: 30,
    showLineNumbers: false,
    fontSize: 14,
    notifications: true,
    keyboardShortcuts: true,
  })

  // 加载设置
  useEffect(() => {
    const saved = localStorage.getItem('kb_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  // 保存设置
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('kb_settings', JSON.stringify(newSettings))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">设置</h2>
        <p className="text-gray-500 mt-1">自定义你的知识库体验</p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Monitor size={20} />
          外观
        </h3>
        
        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">主题</p>
              <p className="text-sm text-gray-500">选择你喜欢的界面主题</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light' 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Sun size={18} />
                浅色
              </button>
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Moon size={18} />
                深色
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">字体大小</p>
              <p className="text-sm text-gray-500">调整编辑器字体大小</p>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value={12}>小 (12px)</option>
              <option value={14}>中 (14px)</option>
              <option value={16}>大 (16px)</option>
              <option value={18}>特大 (18px)</option>
            </select>
          </div>

          {/* Line Numbers */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">显示行号</p>
              <p className="text-sm text-gray-500">在编辑器中显示行号</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showLineNumbers}
                onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Keyboard size={20} />
          编辑器
        </h3>
        
        <div className="space-y-4">
          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">自动保存</p>
              <p className="text-sm text-gray-500">自动保存你的编辑内容</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          {/* Auto Save Interval */}
          {settings.autoSave && (
            <div className="flex items-center justify-between pl-4 border-l-2 border-gray-200">
              <div>
                <p className="font-medium text-gray-900">自动保存间隔</p>
                <p className="text-sm text-gray-500">每隔多久自动保存一次</p>
              </div>
              <select
                value={settings.autoSaveInterval}
                onChange={(e) => updateSetting('autoSaveInterval', parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value={10}>10 秒</option>
                <option value={30}>30 秒</option>
                <option value={60}>1 分钟</option>
                <option value={300}>5 分钟</option>
              </select>
            </div>
          )}

          {/* Keyboard Shortcuts */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">快捷键</p>
              <p className="text-sm text-gray-500">启用键盘快捷键</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.keyboardShortcuts}
                onChange={(e) => updateSetting('keyboardShortcuts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={20} />
          通知
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">启用通知</p>
            <p className="text-sm text-gray-500">接收操作反馈和提醒</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
      </div>

      {/* About */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">关于</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Knowledge Base v1.0</p>
          <p>基于 React + Tailwind CSS + Node.js</p>
          <p>本地优先的个人知识管理系统</p>
        </div>
      </div>
    </div>
  )
}

export default Settings
