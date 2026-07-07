# My Kanban

一个用于验证团队协作核心流程的轻量级 Kanban MVP。当前版本支持：

- 创建项目
- 在项目下创建任务
- 给任务分配预置负责人
- 在 `todo`、`in_progress`、`done` 三列之间拖动任务
- 删除任务

## 技术栈

### Frontend

- `React 18`
- `Vite`
- `TypeScript`
- `react-router-dom`
- `dnd-kit`
- `Vitest`
- `Testing Library`

### Backend

- `Node.js 20+`
- `Express`
- `TypeScript`
- `better-sqlite3`
- `Vitest`
- `Supertest`

### Data

- `SQLite`

## 目录结构

```text
backend/    Express + TypeScript + SQLite API
frontend/   React + Vite 看板界面
specs/      speckit 规格、计划、契约与验证文档
```

## 环境要求

- `Node.js 20+`
- `npm`

## 安装依赖

在仓库根目录执行：

```powershell
npm install
```

## 初始化数据库

首次运行前执行：

```powershell
npm run db:init
npm run db:seed
```

这会创建 SQLite 数据库并写入预置团队成员。

## 启动项目

### 1. 启动后端

前端默认请求 `http://localhost:3002`，因此推荐把后端启动在 `3002` 端口：

```powershell
$env:PORT=3002
npm run dev --workspace backend
```

如果你希望继续使用后端默认端口 `3001`，则需要为前端单独指定：

```powershell
$env:VITE_API_BASE_URL="http://localhost:3001"
npm run dev --workspace frontend
```

### 2. 启动前端

另开一个终端执行：

```powershell
npm run dev --workspace frontend
```

默认访问地址通常为：

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3002](http://localhost:3002)

## 常用命令

```powershell
# 启动前端
npm run dev:frontend

# 启动后端
npm run dev:backend

# 构建前后端
npm run build

# 运行全部测试
npm run test
```

## API 与文档

- 项目接口契约：`specs/001-team-kanban-mvp/contracts/projects.openapi.yaml`
- 任务接口契约：`specs/001-team-kanban-mvp/contracts/tasks.openapi.yaml`
- 快速验证说明：`specs/001-team-kanban-mvp/quickstart.md`

## 测试

```powershell
# 后端测试
npm run test --workspace backend

# 前端测试
npm run test --workspace frontend
```

## 当前实现说明

这是一个单团队、无登录的 MVP 验证项目，重点是跑通项目、任务、负责人和状态流转的核心链路，不包含评论、标签、附件、自定义流程等高级能力。
