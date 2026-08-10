# 何东宁 个人简历网站

基于 GitHub Pages + Decap CMS 的个人简历/作品集网站，支持自定义域名、可视化后台编辑、长期维护。

> 🔗 当前地址：https://donnie-s-cv.vercel.app

---

## 项目结构

```
cv/
├── index.html              # 网站主页
├── admin/
│   ├── index.html          # Decap CMS 管理面板入口
│   └── config.yml          # CMS 字段配置
├── css/
│   └── style.css           # 样式（玻璃拟态 + 滚动动画）
├── js/
│   └── app.js              # 数据渲染 + 交互动效
├── data/
│   └── portfolio.json      # ⭐ 网站全部内容数据（CMS 编辑目标）
├── assets/                 # 图片等静态资源
└── README.md
```

> **核心文件只有一个**：`data/portfolio.json`。改它就能改整个网站内容。

---

## 🚀 一、绑定个人域名

### 1. 购买域名

推荐渠道：

| 平台 | 特点 |
|------|------|
| [阿里云万网](https://wanwang.aliyun.com/) | 国内首选，备案方便 |
| [腾讯云 DNSPod](https://dnspod.cloud.tencent.com/) | 国内次选 |
| [Namecheap](https://www.namecheap.com/) | 海外首选，无需备案 |
| [Porkbun](https://porkbun.com/) | 海外性价比高 |

建议买 `.com` 或 `.me` 或 `.cn`，例如 `hedongning.me`、`donniehe.cn`。

> ⚠️ `.cn` 域名需要 ICP 备案才能在国内正常访问。如果不想备案，买 `.com`。

### 2. 配置 DNS

在域名服务商的后台，进入 DNS 解析管理，添加以下记录：

**方式一：Apex 域名（如 `hedongning.me`）**

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |
| CNAME | www | `ranyuan-wind.github.io.` |

**方式二：仅 www 子域名（如 `www.hedongning.me`）**

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| CNAME | www | `ranyuan-wind.github.io.` |

### 3. GitHub 端设置

1. 打开仓库 → **Settings** → **Pages**
2. **Custom domain** 填入你的域名（如 `hedongning.me`）
3. 点击 **Save**
4. 勾选 **Enforce HTTPS**（等几分钟，证书自动签发）

> DNS 生效需要 1-10 分钟。保存后 GitHub 会自动验证域名归属。

### 4. 更新配置文件

域名绑定后，改两处：

**`admin/config.yml`** 末尾：
```yaml
site_url: "https://你的域名"
display_url: "https://你的域名"
```

**`index.html`** `<head>` 中的 canonical URL（如有的话）。

---

## ⚙️ 二、后台编辑面板（Decap CMS）

Decap CMS 可以让你在网页上像填表一样编辑简历，自动 commit 到 GitHub，网站自动更新。

### 方案 A：直接在 GitHub 上编辑（零配置，现在就可用 ✅）

最简单的"后台"就是 GitHub 自带的文件编辑器：

1. 打开 https://github.com/Ranyuan-wind/Donnie-s-CV/blob/main/data/portfolio.json
2. 点右上角 ✏️ 编辑按钮
3. 直接改 JSON 内容
4. 改完点 **Commit changes**
5. 等 1-2 分钟，网站自动更新

**适合**：偶尔改个联系方式、加一条经历这种场景。

### 方案 B：Netlify + Git Gateway（推荐，完整体验 🔥）

Netlify 提供免费的 Git Gateway，让 Decap CMS 一键登录编辑，体验最好。

**步骤：**

1. **注册 Netlify** → https://app.netlify.com/signup （用 GitHub 账号登录）

2. **导入站点** → 点击 "Add new site" → "Import an existing project" → 选择 GitHub → 选择 `Ranyuan-wind/Donnie-s-CV`

3. **开启 Identity** → 站点设置 → **Identity** → **Enable Identity**

4. **开启 Git Gateway** → Identity → **Services** → **Git Gateway** → **Enable Git Gateway**

5. **修改 `admin/config.yml`**，把 backend 改成：
   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```

6. **提交并 push** 这个改动

7. **访问后台** → `https://你的域名/admin/` → 点 "Login with Netlify Identity" → 注册/登录 → 进入编辑面板

> Netlify 会自动部署你的站点。如果你同时用了 GitHub Pages，去 Netlify 设置里关掉自动部署，只用它做认证。

### 方案 C：仅在本地编辑（无需任何后台）

```bash
# 编辑 JSON 数据
vim data/portfolio.json

# 提交推送
git add data/portfolio.json
git commit -m "更新简历"
git push origin main
```

---

## 📝 三、日常编辑指南

### 编辑入口

| 方式 | 地址 | 适合 |
|------|------|------|
| GitHub 直接编辑 | 仓库 → `data/portfolio.json` → Edit | 快速小改 |
| Netlify CMS 后台 | `你的域名/admin/` | 可视化编辑 |
| 本地编辑 | `vim data/portfolio.json` | 开发者 |

### 可编辑的模块

| 模块 | JSON 字段 | 说明 |
|------|-----------|------|
| 基本信息 | `basics` | 姓名、职位、联系方式、头像、简介 |
| 实习经历 | `internships` | 公司、部门、时间、关键词、详细亮点 |
| 个人作品 | `works` | 项目卡片，支持 Coze 链接和工作流图片 |
| 学校项目 | `schoolProjects` | 调研项目，论文发表等 |
| 能力栈 | `skillStack` | 业务/技术/协作三维能力标签 |
| 个人特质 | `personal` | MBTI、星座、性格卡片 |

### 添加工艺

**加一段新实习**：在 `internships` 数组里复制一个对象，改内容即可：
```json
{
  "id": "new-company",
  "company": "新公司",
  "role": "策略产品经理",
  "date": "2026.08 - 至今",
  "gradient": "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
  "logo": "新",
  "abstract": "一句话摘要",
  "keywords": ["关键词1", "关键词2"],
  "details": {
    "highlights": [
      {"title": "亮点标题", "content": "亮点描述"}
    ]
  }
}
```

### 注意

- JSON 格式严格，注意引号、逗号，不要有多余的尾部逗号
- 改完保存等 1-2 分钟，网站自动部署更新
- 如果改坏了，去 GitHub 看文件历史，一键回滚

---

## 🛠 四、长期维护建议

1. **域名续费**：每年检查一次，开启自动续费
2. **内容更新**：每段经历结束后及时更新到网站上
3. **GitHub 备份**：仓库本身就是最好的备份，所有修改历史可追溯
4. **样式迭代**：想换风格改 `css/style.css`，数据不动，只改皮

---

## 📄 License

MIT
