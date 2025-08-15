# Prisma ORM 文档

## 1. 安装与初始化

### 安装Prisma CLI
```bash
npm install prisma --save-dev
```

### 初始化项目
```bash
npx prisma init
```

## 2. 数据库连接配置

### PostgreSQL连接示例
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### SQLite连接示例
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 3. 数据模型定义

### 示例模型
```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  posts Post[]
}

model Post {
  id     Int     @id @default(autoincrement())
  title  String
  author User    @relation(fields: [authorId], references: [id])
  authorId Int
}
```

## 4. 迁移与同步

### 创建并应用迁移
```bash
npx prisma migrate dev --name init
```

### 生成Prisma Client
```bash
npx prisma generate
```

## 5. 使用Prisma Client

### 基本查询示例
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建用户
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io'
    }
  })

  // 查询用户
  const users = await prisma.user.findMany()
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## 6. 高级功能

### 使用Accelerate扩展
```typescript
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
```

### 使用Studio查看数据
```bash
npx prisma studio
```

## 7. 部署指南

### 生产环境建议
- 使用连接池
- 启用查询日志
- 定期备份数据库

## 8. 常见问题

### 连接问题
- 检查环境变量
- 验证数据库权限
- 确保网络可达

### 性能优化
- 添加适当索引
- 使用select只查询必要字段
- 考虑批量操作
