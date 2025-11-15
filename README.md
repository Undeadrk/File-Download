# File-Download

一个基于 Vue 3 的文件展示与下载工具，提供了直观的文件管理界面和便捷的下载功能。

## Features

- 📁 文件列表展示
- ⏬ 支持单个文件下载
- 📂 支持文件夹批量下载
- 🎨 使用 Vant UI 组件库，适配移动端
- 🔄 支持文件类型识别和图标展示

## Tech Stack

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Vant 4
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **HTTP 客户端**: Axios
- **样式**: Tailwind CSS
- **文件处理**: JSZip

## Project Structure

```
File-Download/
├── src/
│   ├── apis/              # API 接口封装
│   │   ├── auth_api.js    # 认证相关接口
│   │   └── file_api.js    # 文件相关接口
│   ├── assets/            # 静态资源
│   │   ├── icons/         # 图标文件
│   │   └── style/         # 全局样式
│   ├── components/        # Vue 组件
│   │   ├── CustomInput.vue          # 自定义输入框
│   │   ├── DownLoadProgress.vue     # 下载进度条
│   │   ├── GradeSelector.vue        # 年级选择器
│   │   ├── Information.vue          # 信息展示
│   │   ├── UserInfoForm.vue         # 用户信息表单
│   │   └── VerifyCodeInput.vue      # 验证码输入框
│   ├── constants/         # 常量定义
│   │   ├── file_type.js   # 文件类型定义
│   │   ├── grade.js       # 年级选项
│   │   └── storage_key.js # 存储键名
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由定义
│   ├── store/             # Pinia 状态管理
│   │   └── useFile.js     # 文件相关状态
│   ├── types/             # TypeScript 类型定义
│   │   ├── element.js     # 元素类型
│   │   ├── fileDTO.js     # 文件数据传输对象
│   │   ├── response.js    # 响应类型
│   │   └── userInfo.js    # 用户信息类型
│   ├── utils/             # 工具函数
│   │   ├── dataTransfer.js    # 数据转换
│   │   ├── download.js        # 下载工具
│   │   ├── fileHandler.js     # 文件处理
│   │   ├── fileIcon.js        # 文件图标
│   │   └── http.js            # HTTP 工具
│   ├── views/             # 页面组件
│   │   ├── Display.vue        # 文件展示页
│   │   ├── Home.vue           # 首页
│   │   └── Test.vue           # 测试页
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── postcss.config.js      # PostCSS 配置
├── tailwind.config.js     # Tailwind CSS 配置
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明文档
```

## Installation

1. 安装依赖：

```bash
npm install
```

## Development

启动开发服务器：

```bash
npm run dev
```

应用将在 `http://localhost:5173/` 启动。

## Build

构建生产版本：

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

预览生产版本：

```bash
npm run preview
```

## Usage

### 主要页面

- **首页** (`/home`): 应用入口页面
- **文件展示页** (`/display`): 展示文件列表和下载功能
- **测试页** (`/test`): 用于功能测试

### 核心组件

#### GradeSelector

年级选择器组件，支持单层级选择：

```vue
<GradeSelector
  v-model="userInfo.grade"
  label="年级"
  placeholder="请选择年级"
  required
  :errorMessage="gradeErrorMessage"
/>
```

#### DownLoadProgress

下载进度条组件，展示文件下载进度：

```vue
<DownLoadProgress
  :progress="downloadProgress"
  :status="downloadStatus"
/>
```

## APIs

### 文件 API

- `getFiles()`: 获取文件列表
- `downloadFile(file)`: 下载单个文件
- `downloadFolder(folder)`: 下载整个文件夹
- `downloadFileFromUrl(url)`: 从 URL 下载文件

### 认证 API

- `login(data)`: 用户登录
- `logout()`: 用户登出
- `getUserInfo()`: 获取用户信息

## Configuration

### Vite 配置

在 `vite.config.js` 中可以配置代理、端口等：

```javascript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/server': {
        target: 'https://your-api-server.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, '')
      }
    }
  }
})
```

### Tailwind CSS 配置

在 `tailwind.config.js` 中可以自定义主题、插件等：

```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Browser Support

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## License

MIT





