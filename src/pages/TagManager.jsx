import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

function TagManager() {
  const [tags, setTags] = useState([])
  const [newTagName, setNewTagName] = useState('')

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      setTags([...tags, { name: newTagName.trim() }])
      setNewTagName('')
    }
  }

  const handleDeleteTag = (name) => {
    setTags(tags.filter(tag => tag.name !== name))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">标签管理</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="新建标签..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <button
            onClick={handleCreateTag}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            <Plus size={16} /> 创建
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {tags.map((tag, index) => (
          <div key={index} className="flex justify-between items-center border-b py-2">
            <span>{tag.name}</span>
            <button
              onClick={() => handleDeleteTag(tag.name)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} /> 删除
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TagManager
