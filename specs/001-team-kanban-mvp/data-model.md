# 数据模型：团队 Kanban MVP

## 1. Project

### 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 项目唯一标识 |
| `name` | string | 是 | 项目名称，在工作区内唯一 |
| `createdAt` | string | 是 | 创建时间 |
| `updatedAt` | string | 是 | 最近更新时间 |

### 校验规则

- `name` 去除首尾空格后不能为空。
- `name` 在当前工作区内必须唯一。
- 删除项目不在 v1 范围内，因此不设计软删除字段。

### 关系

- 一个 `Project` 包含多个 `Task`。

## 2. Team Member

### 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 成员唯一标识 |
| `name` | string | 是 | 成员显示名称 |
| `avatarText` | string | 否 | 成员头像文本，如姓名缩写 |
| `isActive` | boolean | 是 | 是否为当前可分配成员 |

### 校验规则

- `name` 不能为空。
- v1 成员由 seed data 预置，不支持在界面中新增或编辑。
- 只有 `isActive = true` 的成员可以在分配下拉中显示。

### 关系

- 一个 `Team Member` 可以关联多个 `Task` 作为负责人。

## 3. Task

### 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 任务唯一标识 |
| `projectId` | string | 是 | 所属项目标识 |
| `title` | string | 是 | 任务标题 |
| `description` | string | 否 | 任务补充说明，v1 可选 |
| `status` | TaskStatus | 是 | 当前状态 |
| `assigneeId` | string | 否 | 当前负责人标识，可为空 |
| `createdAt` | string | 是 | 创建时间 |
| `updatedAt` | string | 是 | 最近更新时间 |

### 校验规则

- `title` 去除首尾空格后不能为空。
- `projectId` 必须对应已存在的 `Project`。
- `assigneeId` 如有值，必须对应已存在且可用的 `Team Member`。
- `status` 必须属于允许状态集合。

### 关系

- 一个 `Task` 必须属于一个 `Project`。
- 一个 `Task` 可以关联零个或一个 `Team Member` 作为负责人。

## 4. TaskStatus

### 允许值

| 值 | 中文显示 | 说明 |
|----|----------|------|
| `todo` | 待处理 | 新建任务默认进入该状态 |
| `in_progress` | 进行中 | 正在推进中的任务 |
| `done` | 已完成 | 当前已完成的任务 |

### 状态流转规则

- v1 允许任意双向流转：`todo` ↔ `in_progress` ↔ `done`，以及 `todo` ↔ `done`。
- 拖拽是状态变更的主要交互方式，但接口层不依赖拖拽行为本身，只接收目标状态值。

## 5. 派生视图模型

### ProjectBoardView

用于前端渲染单个项目的看板页面。

| 字段 | 类型 | 说明 |
|------|------|------|
| `project` | Project | 当前项目 |
| `members` | TeamMember[] | 可分配成员列表 |
| `columns` | BoardColumn[] | 状态列集合 |

### BoardColumn

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | TaskStatus | 当前列代表的状态 |
| `title` | string | 当前列显示名称 |
| `tasks` | TaskCardView[] | 该列中的任务卡片 |

### TaskCardView

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 任务标识 |
| `title` | string | 任务标题 |
| `status` | TaskStatus | 当前状态 |
| `assignee` | object \| null | 负责人简要信息，没有则为 `null` |

## 6. 数据一致性要求

- 创建任务后，任务必须立即可被所属项目看板读取。
- 更新负责人后，任务详情和卡片摘要必须反映同一负责人。
- 更新状态后，读取项目任务列表时必须返回新状态。
- 项目列表与项目详情读取必须排除其他项目的任务数据串入。
