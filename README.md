# 记账本 - 桌面端记账应用

一款基于 Electron + React 的桌面端记账应用，采用 Windows 风格设计。

## ✨ 功能特性

- 📊 **数据统计** - 可视化图表展示收支情况
- 📝 **记账管理** - 支持收入和支出记录
- 🏷️ **分类管理** - 自定义收支分类
- 📈 **趋势分析** - 查看收支趋势变化
- 💾 **本地存储** - 使用 SQLite 数据库存储数据

## 🛠️ 技术栈

- **框架**: Electron 33 + React 18
- **构建工具**: Vite 5
- **语言**: TypeScript
- **样式**: Tailwind CSS 3
- **状态管理**: Zustand
- **图表**: Recharts
- **图标**: Lucide React
- **数据库**: sql.js (SQLite)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 打包应用

```bash
npm run package
```

## 📁 项目结构

```
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── database.ts # 数据库操作
│   │   └── index.ts    # 主进程入口
│   ├── preload/        # 预加载脚本
│   │   └── index.ts
│   └── renderer/       # React 渲染进程
│       ├── components/ # UI 组件
│       │   ├── dashboard/ # 仪表盘组件
│       │   ├── records/   # 记录组件
│       │   └── ui/        # 通用 UI 组件
│       ├── pages/      # 页面组件
│       ├── stores/     # 状态管理
│       ├── types/      # TypeScript 类型
│       ├── App.tsx     # 应用入口组件
│       └── main.tsx    # React 入口文件
├── package.json        # 项目配置
├── electron.vite.config.ts # Electron Vite 配置
├── tailwind.config.ts  # Tailwind CSS 配置
└── tsconfig.json       # TypeScript 配置
```

## 📖 使用说明

1. **添加记录**: 点击记录页面的添加按钮，填写金额、分类、备注等信息
2. **查看统计**: 在仪表盘页面查看收支统计和趋势图表
3. **管理分类**: 在分类页面管理收支分类

## 🔧 配置

### 环境变量

```bash
# Electron 镜像（国内用户推荐）
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**记账本** - 简单实用的桌面记账工具
