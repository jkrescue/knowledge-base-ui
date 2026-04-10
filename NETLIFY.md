# Netlify 部署说明

## 自动部署配置

本项目已配置好 Netlify 自动部署，只需：

### 1. 登录 Netlify
- 访问 https://www.netlify.com
- 点击 "Sign up" → 选择 "GitHub"

### 2. 导入项目
- 点击 "Add new site" → "Import an existing project"
- 选择 GitHub → 授权 → 选择 `jkrescue/knowledge-base-ui`

### 3. 构建设置（已配置）
Netlify 会自动读取 `netlify.toml` 配置：
```
Build command: npm run build
Publish directory: dist
```

### 4. 部署
- 点击 "Deploy site"
- 等待 1-2 分钟
- 获得域名：`https://xxx.netlify.app`

## 项目信息

- **GitHub**: https://github.com/jkrescue/knowledge-base-ui
- **本地后端**: http://localhost:3001 (需要单独运行)
- **本地前端**: http://localhost:5173

## 注意

Netlify 部署的是前端静态页面，后端 API 需要单独部署或在本地运行。

如需后端也部署到云端，建议使用：
- Render (https://render.com)
- Railway (https://railway.app)
- Heroku

---

*代码已准备就绪，可直接导入 Netlify*
