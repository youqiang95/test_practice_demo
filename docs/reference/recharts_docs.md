# Recharts 文档

## 安装
```bash
npm install recharts react-is
```

## 基本用法

### 简单折线图
```tsx
import { LineChart, Line } from 'recharts';

const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

function SimpleLineChart() {
  return (
    <LineChart width={400} height={400} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    </LineChart>
  );
}
```

### 带坐标轴和网格的折线图
```tsx
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

function EnhancedLineChart() {
  return (
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
    </LineChart>
  );
}
```

## 核心组件

### 图表容器
- `LineChart`: 折线图容器
- `BarChart`: 柱状图容器  
- `PieChart`: 饼图容器
- `RadarChart`: 雷达图容器
- `ScatterChart`: 散点图容器

### 图表元素
- `Line`: 折线
- `Bar`: 柱状条
- `Pie`: 饼图扇区
- `Area`: 面积区域
- `Scatter`: 散点

### 坐标轴
- `XAxis`: X轴
- `YAxis`: Y轴
- `ZAxis`: Z轴(3D图表)
- `PolarAngleAxis`: 极坐标角度轴
- `PolarRadiusAxis`: 极坐标半径轴

### 辅助元素
- `CartesianGrid`: 直角坐标系网格
- `PolarGrid`: 极坐标系网格
- `Legend`: 图例
- `Tooltip`: 提示框
- `ReferenceLine`: 参考线
- `ReferenceArea`: 参考区域
- `ReferenceDot`: 参考点

## 高级功能

### 自定义形状
```tsx
const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

<Bar dataKey="uv" fill="#8884d8" shape={<TriangleBar />} />
```

### 自定义Tooltip
```tsx
function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}

<Tooltip content={<CustomTooltip />} />
```

### 响应式容器
```tsx
import { ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={400}>
  <LineChart data={data}>
    <Line dataKey="uv" />
  </LineChart>
</ResponsiveContainer>
```

## 开发指南

### 项目构建
```bash
git clone https://github.com/recharts/recharts.git
cd recharts
npm install
npm run build
```

### 运行Storybook
```bash
npm run storybook
```

### 测试
```bash
npm run test  # 单元测试
npm run test-vr  # 视觉回归测试
```

## 最佳实践
1. 使用ResponsiveContainer实现响应式图表
2. 为图表添加accessibilityLayer={true}启用无障碍支持
3. 使用自定义组件实现特殊样式需求
4. 合理设置图表margin以保证元素显示完整

## 版本说明
- 当前版本: 3.x
- 最低要求: React 16.8+
- TypeScript支持: 完整类型定义
