# 快速验证指南：团队 Kanban MVP

## 目标

通过最短路径启动前后端应用，并验证以下核心流程：

1. 创建项目
2. 向项目添加任务
3. 给任务分配负责人
4. 将任务卡片拖动到其他状态列

## 前置条件

- 已安装 `Node 20+`
- 可使用 `npm`
- 当前仓库根目录为 `D:\project\my-kanban`

## 预期目录结构

实现完成后应至少包含以下目录：

```text
backend/
frontend/
specs/001-team-kanban-mvp/
```

## 安装依赖

在仓库根目录执行：

```powershell
npm install
```

如果实现采用 workspace，则确保根目录 `package.json` 已代理安装 `frontend` 与 `backend` 的依赖。

## 初始化数据库

首次运行前，执行数据库初始化与 seed：

```powershell
npm run db:init --workspace backend
npm run db:seed --workspace backend
```

预期结果：

- 生成 SQLite 数据文件
- 创建 `projects`、`tasks`、`team_members` 三张核心表
- 写入预置团队成员

## 启动后端

```powershell
npm run dev --workspace backend
```

预期结果：

- 后端服务在本地端口启动，例如 `http://localhost:3002`
- 可访问 `projects` 与 `tasks` 相关 API

## 启动前端

另开一个终端执行：

```powershell
npm run dev --workspace frontend
```

预期结果：

- 前端页面在本地端口启动，例如 `http://localhost:5173`
- 页面可访问项目列表与项目看板

## 手工验证场景

### 场景 1：创建项目

1. 打开前端页面。
2. 创建一个新项目，例如“市场活动排期”。
3. 确认项目出现在项目列表中。

预期结果：

- 项目创建成功提示出现。
- 列表中出现新项目。
- 打开项目后可进入空看板页面。

### 场景 2：添加任务

1. 在该项目中新增任务“准备活动海报”。
2. 再新增任务“确认发布时间”。

预期结果：

- 两个任务均出现在 `todo` 列。
- 页面不显示其他项目的任务。

### 场景 3：分配负责人

1. 为“准备活动海报”选择一个预置成员。
2. 保存后刷新页面。

预期结果：

- 任务卡片显示负责人信息。
- 刷新后负责人信息仍保留。

### 场景 4：拖拽变更状态

1. 将“准备活动海报”从 `todo` 拖到 `in_progress`。
2. 再将其拖到 `done`。
3. 刷新页面。

预期结果：

- 每次拖拽后卡片都出现在目标列。
- 原列不再显示该卡片。
- 刷新后任务仍停留在最后一次目标列。

## API 验证参考

- 项目接口契约见 [projects.openapi.yaml](/D:/project/my-kanban/specs/001-team-kanban-mvp/contracts/projects.openapi.yaml)
- 任务接口契约见 [tasks.openapi.yaml](/D:/project/my-kanban/specs/001-team-kanban-mvp/contracts/tasks.openapi.yaml)

可选的快速检查命令示例：

```powershell
Invoke-RestMethod http://localhost:3002/api/projects
Invoke-RestMethod http://localhost:3002/api/projects/{projectId}/tasks
```

## 测试执行

后端：

```powershell
npm run test --workspace backend
```

前端：

```powershell
npm run test --workspace frontend
```

预期结果：

- 后端覆盖项目创建、任务创建、负责人更新、状态更新等关键行为
- 前端覆盖项目切换、任务创建表单、负责人展示、列间拖拽后的状态更新

## 验证记录

### 2026-07-07

- 已执行 `npm test`，后端与前端测试全部通过。
- 已执行 `npm run build`，后端 TypeScript 编译与前端 Vite 构建全部通过。
- 已执行 `npm run db:init --workspace backend` 与 `npm run db:seed --workspace backend`，SQLite 初始化和预置成员写入成功。
- 本次主要通过自动化测试、构建结果与数据库脚本验证核心流程；交互式浏览器手工验证可在本地继续按本文档的四个场景复核。
