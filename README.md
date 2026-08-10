# 何东宁 个人简历网站

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
---

## 📝 三、日常编辑指南

### 编辑入口

| 方式 | 地址 | 适合 |
|------|------|------|
| GitHub 直接编辑 | 仓库 → `data/portfolio.json` → Edit | 快速小改 
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
