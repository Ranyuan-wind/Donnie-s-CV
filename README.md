# 个人简历网站 - GitHub Pages + Decap CMS

基于 GitHub Pages 的个人简历展示网站，配有 Decap CMS 后台管理系统，支持随时在线编辑简历各模块内容。

## ✨ 特性

- 📱 **响应式设计** — 适配桌面端、平板、手机，支持打印
- 🎨 **现代UI** — 侧边栏 + 主内容区布局，时间线展示经历
- ⚙️ **在线编辑** — Decap CMS 后台，可视化编辑所有简历模块
- 📊 **数据可视化** — 自动提取关键指标并高亮展示
- 🚀 **一键部署** — 推送到 GitHub 即可自动上线

## 📁 项目结构

```
cv/
├── index.html              # 简历展示主页
├── admin/
│   ├── index.html          # Decap CMS 管理面板
│   └── config.yml          # CMS 配置（集合/字段定义）
├── css/
│   └── style.css           # 样式表
├── js/
│   └── app.js              # 数据渲染逻辑
├── data/
│   └── resume.json         # 简历数据（CMS 编辑的目标文件）
├── assets/                 # 图片等静态资源
└── README.md
```

## 🚀 部署步骤

### 第一步：创建 GitHub 仓库

1. 在 GitHub 创建新仓库，例如 `cv`
2. 记录仓库全名，例如 `hedongning/cv`

### 第二步：修改配置

编辑 `admin/config.yml`，修改以下内容：

```yaml
backend:
  name: github
  repo: hedongning/cv        # 👈 改为你的 用户名/仓库名
  branch: main                # 👈 改为你的分支名
```

### 第三步：设置 Decap CMS OAuth（三选一）

Decap CMS 需要一个 OAuth 服务来授权 GitHub 提交。选择以下任一方式：

#### 方案 A：使用 Netlify（推荐，最简单）

1. 在 [netlify.com](https://netlify.com) 注册账号
2. 点击 "Add new site" → "Import an existing project" → 连接 GitHub 并选择你的仓库
3. 在 Netlify 站点设置中，进入 **Identity** → **Enable Identity**
4. 在 **Identity** → **Services** → **Git Gateway** → **Enable Git Gateway**
5. 修改 `admin/config.yml` 的 backend 配置：

```yaml
backend:
  name: git-gateway
  branch: main
```

#### 方案 B：Cloudflare Worker（免费，需 Cloudflare 账号）

1. 克隆 OAuth Worker 项目：
   ```bash
   git clone https://github.com/davidtom/cf-decap-cms-oauth.git
   ```
2. 按照其 README 部署到 Cloudflare Workers
3. 将 `admin/config.yml` 中的 `base_url` 改为你的 Worker URL

#### 方案 C：仅本地编辑（零配置，最简单但不支持在线编辑）

如果你不需要在线编辑，可以直接在 GitHub 上编辑 `data/resume.json` 文件，或者 clone 到本地编辑后 push。

### 第四步：推送到 GitHub

```bash
cd /path/to/cv
git init
git add .
git commit -m "初始化简历网站"
git branch -M main
git remote add origin https://github.com/你的用户名/cv.git
git push -u origin main
```

### 第五步：开启 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main`，文件夹选择 `/ (root)`
4. 点击 **Save**
5. 等待 1-2 分钟，页面 URL 会显示在 Settings → Pages 中

> 访问地址通常是 `https://你的用户名.github.io/cv/`

### 第六步：访问后台管理

1. 打开 `https://你的用户名.github.io/cv/admin/`
2. 使用你的 GitHub 账号登录
3. 登录后即可可视化编辑简历的所有模块
4. 每次保存，CMS 会自动 commit 到 GitHub，GitHub Pages 会自动更新

## 📝 编辑指南

### 通过后台编辑（推荐）

登录 `/admin/` 后，可以编辑以下模块：

| 模块 | 说明 |
|------|------|
| 基本信息 | 姓名、职位、联系方式、个人简介 |
| 教育经历 | 学校、专业、荣誉、课程等（支持增删） |
| 实习经历 | 公司、部门、工作亮点（支持增删） |
| 项目经历 | 项目名称、描述、亮点（支持增删） |
| 技能信息 | 专业技能、语言能力、证书（支持增删） |
| 个人特质 | 个人特色的趣味描述（支持增删） |

### 直接编辑 JSON

也可以直接编辑 `data/resume.json` 文件。注意保持 JSON 格式正确。

## 🎨 自定义样式

修改 `css/style.css` 中的 CSS 变量即可更改主题色：

```css
:root {
  --color-primary: #1a1a2e;      /* 主色调 */
  --color-accent: #e2b04a;       /* 强调色 */
  --color-bg: #f1f3f5;           /* 背景色 */
  /* ... */
}
```

## 📄 License

MIT
