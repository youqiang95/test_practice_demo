# 广告ROI数据分析系统部署指南

## 1. 环境依赖清单

### 系统要求
- 操作系统: Linux (推荐Ubuntu 22.04 LTS) 或 windows系统
- Node.js: 18.x 或更高 (推荐20.x)
- MySQL: 8.0.x
- npm: 9.x 或 yarn 1.22+

## 2. 数据库安装配置 （已安装数据库或已有现成数据库则可跳过此步骤）

### MySQL安装
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation
```

### 创建db
```sql
CREATE DATABASE roi_analysis;
```

### 性能优化配置 (/etc/mysql/my.cnf)
```ini
[mysqld]
innodb_buffer_pool_size = 4G  # 推荐为系统内存的50-70%
innodb_log_file_size = 512M
max_connections = 200
query_cache_size = 0
query_cache_type = 0
```

## 3. 项目安装步骤

### 克隆代码库
```bash
git clone git@github.com:youqiang95/test_practice_demo.git
cd test_practice_demo
```

### 安装依赖
```bash
# 后端依赖
cd apps/backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 环境变量配置
1. 复制.env.example为.env文件
   ```bash
   cd apps/backend
   cp .env.example .env
   ```

2. 编辑.env文件配置数据库连接
   ```env
   DATABASE_URL="mysql://roi_user:strong_password@localhost:3306/roi_analysis"
   NODE_ENV=production
   ```

### 数据库迁移
```bash
cd apps/backend
npx prisma migrate deploy
npx prisma generate
```

## 4. 数据库初始化和CSV导入

### CSV文件格式要求
- 必须包含的列: 日期,app,出价类型,国家地区,应用安装.总次数,当日ROI,1日ROI,3日ROI,7日ROI,14日ROI,30日ROI,60日ROI,90日ROI
- 日期列要求: 以ISO日期格式(YYYY-MM-DD)开头的字符串
- 文件编码: UTF-8

### 数据导入方式
1. 通过网页界面导入 (管理员权限)
2. 通过API直接上传:
   ```bash
   curl -X POST -F "file=@data.csv" http://localhost:3001/api/v1/data/import
   ```

## 5. 生产环境配置

### 构建生产版本
  ```bash
  cd apps/frontend && npm run build
  cd ../backend && npm run build
  ```

### 数据库初始化
1. 环境变量配置：
   - 复制.env.example为.env文件：
     ```bash
     cp .env.example .env
     ```
   - 编辑.env文件，填写实际的数据库连接信息

2. 数据库初始化：
   - 生成prisma客户端
     ```bash
     npx prisma generate
     ``` 

   - 运行数据库迁移：
     ```bash
     npx prisma migrate deploy
     ```

### 使用PM2管理进程
```bash
# 全局安装PM2
npm install -g pm2

# 启动后端服务
pm2 start "npm run start" --name roi-backend

# 启动前端服务
cd ../frontend
pm2 start "npm run start" --name roi-frontend

# 保存PM2配置
pm2 save
pm2 startup
```
