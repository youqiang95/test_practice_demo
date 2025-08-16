# API 文档

## 1. ROI数据接口

### GET /rois

**功能**: 获取ROI数据

**请求方法**: GET

**查询参数**:
- `app` (可选): 应用名称
- `country` (可选): 国家地区
- `startDate` (可选): 开始日期(YYYY-MM-DD)
- `endDate` (可选): 结束日期(YYYY-MM-DD)

**成功响应** (200):
```json
[
  {
    "date": "2025-08-16",
    "app": "App-1",
    "country": "美国",
    "installs": 1000,
    "roi": {
      "daily": 0.15,
      "day1": 0.2,
      "day3": 0.25,
      "day7": 0.3,
      "day14": 0.35,
      "day30": 0.4,
      "day60": 0.45,
      "day90": 0.5
    }
  },
  {
    "date": "2025-08-15",
    "app": "App-1",
    "country": "美国",
    "installs": 950,
    "roi": {
      "daily": 0.14,
      "day1": 0.19,
      "day3": 0.24,
      "day7": 0.29,
      "day14": 0.34,
      "day30": 0.39,
      "day60": 0.44,
      "day90": 0.49
    }
  }
]
```

**错误响应**:
- 400 ValidationError: 请求参数验证失败
- 404 NotFoundError: 数据不存在
- 500 DatabaseError: 数据库查询错误

## 2. 数据导入接口

### POST /data/import

**功能**: 导入CSV数据

**请求方法**: POST

**请求格式**: multipart/form-data

**文件要求**:
- 字段名: `file`
- 类型: CSV文件
- 大小限制: 5MB

**成功响应** (200):
```json
{
  "success": true,
  "count": 100
}
```

**错误响应**:
- 400 DataImportError: 文件上传问题
- 400 CSVFileTypeError: 文件类型错误
- 400 CSVFieldValidationError: CSV字段验证失败
- 500 DatabaseError: 数据库操作错误

## CSV文件格式要求

**必须字段**:
- 日期 (格式: YYYY-MM-DD)
- app (可选值: App-1, App-2, App-3, App-4, App-5)
- 出价类型 (必须为CPI)
- 国家地区 (可选值: 美国, 英国)
- 应用安装.总次数 (整数)
- ROI字段 (格式: 数字或百分比):
  - 当日ROI
  - 1日ROI
  - 3日ROI
  - 7日ROI
  - 14日ROI
  - 30日ROI
  - 60日ROI
  - 90日ROI

## 错误处理

所有错误返回统一格式:
```json
{
  "error": "ErrorType",
  "message": "错误描述",
  "statusCode": 400,
  "details": {
    // 额外错误详情
  }
}
```

**常见状态码**:
- 200: 成功
- 400: 客户端请求错误
- 404: 资源未找到
- 500: 服务器内部错误
