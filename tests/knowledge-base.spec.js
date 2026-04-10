import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5174';

test.describe('Knowledge Base - 端到端测试', () => {
  
  test.describe('后端 API 测试', () => {
    
    test('API 健康检查', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/health`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.status).toBe('healthy');
    });

    test('获取统计信息', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/stats`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('totalNotes');
      expect(data.data).toHaveProperty('weeklyUpdates');
      expect(data.data).toHaveProperty('activeProjects');
    });

    test('获取笔记列表', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/notes`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    test('获取知识图谱', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/graph`);
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('nodes');
      expect(data.data).toHaveProperty('edges'); // 实际返回的是 edges 不是 links
    });
  });

  test.describe('前端页面测试', () => {
    
    test('仪表板页面加载', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/`);
      
      // 检查页面标题
      await expect(page).toHaveTitle(/Knowledge Base/);
      
      // 检查关键元素
      await expect(page.locator('h2:has-text("欢迎回来")')).toBeVisible();
      await expect(page.locator('text=总笔记').first()).toBeVisible();
      await expect(page.locator('h3:has-text("活跃项目")')).toBeVisible();
    });

    test('知识图谱页面', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/graph`);
      
      // 检查页面标题
      await expect(page.locator('h2:has-text("知识图谱")')).toBeVisible();
      
      // 检查图谱容器（使用更具体的选择器）
      await expect(page.locator('svg.w-full.h-full')).toBeVisible();
      
      // 检查图例
      await expect(page.locator('text=图例')).toBeVisible();
    });

    test('笔记列表页面', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/notes`);
      
      // 检查搜索框
      await expect(page.locator('input[placeholder="搜索笔记..."]')).toBeVisible();
      
      // 检查标签筛选（使用 first() 避免多个匹配）
      await expect(page.locator('text=全部').first()).toBeVisible();
      await expect(page.locator('text=日报').first()).toBeVisible();
    });

    test('侧边栏导航', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/`);
      
      // 检查导航链接（使用 role 定位避免歧义）
      await expect(page.getByRole('link', { name: '仪表板' })).toBeVisible();
      await expect(page.getByRole('link', { name: '知识图谱' })).toBeVisible();
      await expect(page.getByRole('link', { name: '日报' })).toBeVisible();
      
      // 点击导航
      await page.getByRole('link', { name: '知识图谱' }).click();
      await expect(page).toHaveURL(/\/graph/);
    });
  });

  test.describe('前后端集成测试', () => {
    
    test('前端显示后端数据', async ({ page, request }) => {
      // 先获取后端数据
      const statsResponse = await request.get(`${API_URL}/api/stats`);
      const statsData = await statsResponse.json();
      
      // 打开前端页面
      await page.goto(`${FRONTEND_URL}/`);
      
      // 检查统计数据是否显示
      await expect(page.locator(`text=${statsData.data.totalNotes}`)).toBeVisible();
    });

    test('完整用户流程', async ({ page }) => {
      // 1. 访问首页
      await page.goto(`${FRONTEND_URL}/`);
      await expect(page.locator('text=欢迎回来')).toBeVisible();
      
      // 2. 导航到知识图谱
      await page.getByRole('link', { name: '知识图谱' }).click();
      await expect(page).toHaveURL(/\/graph/);
      await expect(page.locator('svg.w-full.h-full')).toBeVisible();
      
      // 3. 导航到笔记列表
      await page.getByRole('link', { name: '日报' }).click();
      await expect(page).toHaveURL(/\/notes/);
      await expect(page.locator('input[placeholder="搜索笔记..."]')).toBeVisible();
      
      // 4. 截图保存
      await page.screenshot({ path: 'test-results/user-flow.png' });
    });
  });
});
