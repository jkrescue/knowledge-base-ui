// API 配置
const API_BASE_URL = 'http://localhost:3001/api';

// 通用请求函数
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
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
};

export default api;
