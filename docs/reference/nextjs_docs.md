# Next.js 文档

## 项目初始化

### 基础项目
```bash
npx create-next-app@latest
```

### 使用示例模板
```bash
npx create-next-app --example [示例名称] [项目目录]
```

## 开发服务器

### 启动开发服务器
```bash
npm install
npm run dev

# 或使用其他包管理器
yarn install
yarn dev

pnpm install
pnpm dev
```

## 常用示例

### 路由处理器示例
```bash
npx create-next-app --example route-handlers
```

### GraphQL集成示例
```bash
npx create-next-app --example with-graphql-react with-graphql-react-app
```

### Apollo + Redux示例
```bash
npx create-next-app --example with-apollo-and-redux with-apollo-and-redux-app
```

### 博客模板
```bash
npx create-next-app --example blog-starter blog-starter-app
```

## 环境配置

### ESLint配置
```bash
npm run lint
```

## 注意事项

1. 确保Node.js版本≥16
2. 不同示例可能需要额外配置环境变量
3. 生产环境部署前请运行`npm run build`
