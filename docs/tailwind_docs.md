# Tailwind CSS 文档

## 安装方法

### 通过npm安装
```bash
npm install -D tailwindcss@latest postcss autoprefixer
```

### 初始化配置文件
```bash
npx tailwindcss init
```

## 基本配置

### 在CSS中引入Tailwind
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 配置文件示例 (tailwind.config.js)
```js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 常用工具类

### 布局
```html
<div class="flex justify-between items-center">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 间距
```html
<div class="m-4 p-4">
  <div class="mb-2">Margin bottom</div>
</div>
```

### 颜色
```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>
```

## 响应式设计

### 断点前缀
```html
<div class="text-sm sm:text-base md:text-lg lg:text-xl">
  响应式文本大小
</div>
```

## 暗黑模式

### 配置暗黑模式
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 或 'media'
  // ...
}
```

### 使用示例
```html
<div class="bg-white dark:bg-gray-800">
  <h1 class="text-gray-900 dark:text-white">标题</h1>
</div>
```

## 插件

### 安装常用插件
```bash
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/line-clamp
```

### 配置插件
```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // ...
  ]
}
