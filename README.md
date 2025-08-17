# 广告ROI数据分析系统

## 项目概述
这是一个基于真实移动应用广告投放数据的ROI(投资回报率)分析系统，用于可视化不同时间维度的ROI趋势。系统支持多应用、多国家的数据筛选和分析，帮助优化广告投放策略。

主要功能：
- 多维度ROI趋势可视化（当日、1日、3日、7日、14日、30日、60日、90日）
- 数据筛选（应用、国家、日期范围）
- 移动平均线显示
- 100%回本线标记
- 预测数据显示

## 技术栈
### 前端
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts (数据可视化)
- ShadCN/UI (组件库)

### 后端
- Node.js
- Express.js
- TypeScript
- Prisma (ORM)

### 数据库
- MySQL 8.0+

## 安装指南

### 环境要求
- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 安装步骤
1. 克隆仓库：
   ```bash
   git clone git@github.com:youqiang95/test_practice_demo.git
   cd test_practice_demo
   ```

2. 安装依赖：
   ```bash
   cd apps/backend && npm install
   cd ../frontend && npm install
   ```

3. 环境变量配置：
   - 复制.env.example为.env文件：
     ```bash
     cd apps/backend
     cp .env.example .env
     ```
   - 编辑.env文件，填写实际的数据库连接信息

4. 数据库初始化：
   - 运行数据库迁移：
     ```bash
     cd apps/backend
     npx prisma migrate dev
     ```

## 运行说明
0. 确保已配置好.env文件中的数据库连接信息

1. 启动后端服务：
   ```bash
   cd apps/backend
   npm run dev
   ```

2. 启动前端开发服务器：
   ```bash
   cd apps/frontend
   npm run dev
   ```

3. 访问前端应用：
   [http://localhost:3000](http://localhost:3000)

## 功能说明
### ROI趋势图表
- 显示8个时间维度的ROI趋势线
- 支持7日移动平均线显示
- 100%回本线标记
- 预测数据以虚线显示

### 筛选控制
- 应用选择（App-1到App-5）
- 国家选择（美国、英国）
- 数据显示模式（原始数据/移动平均）
- Y轴刻度（线性/对数）

### 交互功能
- 鼠标悬停显示详细数据
- 图例点击切换数据线显示/隐藏
- 筛选器实时更新图表

## 部署指南
### 生产环境配置
- 配置生产数据库连接
- 设置环境变量：
  - DATABASE_URL
  - NODE_ENV=production
- 构建生产版本：
  ```bash
  cd apps/frontend && npm run build
  cd ../backend && npm run build
  ```

## 文档参考
- [系统设计文档](docs/DESIGN.md)
- [用户指南](docs/USER_GUIDE.md)
- [API文档](docs/api_docs.md)
