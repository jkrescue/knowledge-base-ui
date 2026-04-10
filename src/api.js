// API 配置 - 支持环境变量配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 通用请求函数
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
}

// API 方法
export const api = {
  // 获取所有笔记
  getNotes: () => apiRequest('/notes'),
  
  // 获取单个笔记
  getNote: (id) => apiRequest(`/notes/${id}`),
  
  // 获取最近笔记
  getRecentNotes: (limit = 5) => apiRequest(`/notes/recent?limit=${limit}`),
  
  // 获取统计数据
  getStats: () => apiRequest('/stats'),
  
  // 获取知识图谱
  getGraph: () => apiRequest('/graph'),
  
  // 健康检查
  healthCheck: () => apiRequest('/health'),
  
  // 更新笔记
  updateNote: (id, data) => apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // 删除笔记
  deleteNote: (id) => apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  }),
  
  // 创建笔记
  createNote: (data) => apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // 导出数据
  exportData: () => apiRequest('/export'),
  
  // 导入数据
  importData: (data) => apiRequest('/import', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export default api;
