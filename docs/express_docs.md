# Express.js 文档

## 安装
```bash
npm install express
```

## 快速开始

### 基础服务器
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

## 核心概念

### 路由
```javascript
// 基础路由
app.get('/users', (req, res) => {
  res.send('Get all users');
});

// 带参数的路由
app.get('/users/:id', (req, res) => {
  res.send(`Get user with ID: ${req.params.id}`);
});

// RESTful 路由
app.post('/users', (req, res) => {
  res.send('Create new user');
});

app.put('/users/:id', (req, res) => {
  res.send(`Update user with ID: ${req.params.id}`);
});

app.delete('/users/:id', (req, res) => {
  res.send(`Delete user with ID: ${req.params.id}`);
});
```

### 中间件
```javascript
// 应用级中间件
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// 路由级中间件
const checkUser = (req, res, next) => {
  if (req.params.id === 'admin') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

app.get('/admin/:id', checkUser, (req, res) => {
  res.send('Admin area');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

## 常用功能

### 静态文件服务
```javascript
app.use(express.static('public'));
```

### 模板引擎
```javascript
// 设置模板引擎
app.set('view engine', 'ejs');

// 渲染视图
app.get('/', (req, res) => {
  res.render('index', { title: 'Express App' });
});
```

### 请求体解析
```javascript
// 解析JSON请求体
app.use(express.json());

// 解析URL编码请求体
app.use(express.urlencoded({ extended: true }));
```

### Cookie和Session
```javascript
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true
}));
```

## 最佳实践

### 项目结构
```
project/
├── app.js          # 应用入口
├── routes/         # 路由文件
│   ├── index.js
│   ├── users.js
│   └── products.js
├── controllers/    # 控制器
├── models/         # 数据模型
├── views/          # 视图模板
├── public/         # 静态文件
└── config/         # 配置文件
```

### 路由模块化
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('User list');
});

module.exports = router;

// app.js
const userRouter = require('./routes/users');
app.use('/users', userRouter);
```

### 错误处理
```javascript
// 自定义错误类
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 使用自定义错误
app.get('/error', (req, res, next) => {
  throw new AppError('Something went wrong', 500);
});

// 全局错误处理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message
  });
});
```

## 性能优化

### 生产环境配置
```javascript
// 启用压缩
const compression = require('compression');
app.use(compression());

// 设置安全HTTP头
const helmet = require('helmet');
app.use(helmet());

// 限制请求体大小
app.use(express.json({ limit: '10kb' }));
```

### 集群模式
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  // ...应用配置
  app.listen(3000);
}
```

## 版本说明
- 当前版本: 4.x
- 最低要求: Node.js 8.0+
- TypeScript支持: 需要@types/express类型定义
