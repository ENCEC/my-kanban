# 实施计划：团队 Kanban MVP

**分支**: `[001-team-kanban-mvp]` | **日期**: 2026-07-07 | **规格**: [spec.md](/D:/project/my-kanban/specs/001-team-kanban-mvp/spec.md)

**输入**: 来自 `/specs/001-team-kanban-mvp/spec.md` 的功能规格，以及补充约束“前端用 React，后端用 Node 加 Express，数据库用 SQLite 先跑起来，看板拖拽使用现成拖拽库，接口按项目、任务两块分开设计”。

## 摘要

本功能将实现一个面向单团队验证场景的 Kanban MVP。方案采用 `frontend` + `backend` 的 Web 应用结构：前端使用 React 构建项目列表与看板界面，后端使用 Node + Express 提供 `projects` 与 `tasks` 两组 API，数据先落到 SQLite，以最低部署成本验证“创建项目、添加任务、分配负责人、拖拽变更状态”这一核心流程。看板拖拽采用现成库 `dnd-kit`，优先保证交互稳定和实现速度。

## 技术上下文

**语言/版本**: 前端 `TypeScript 5.x` + React；后端 `Node 20.x` + `TypeScript 5.x`

**主要依赖**: React、Vite、Express、`better-sqlite3`、`@dnd-kit/core`、`@dnd-kit/sortable`

**存储**: SQLite 单文件数据库

**测试**: 前端使用 Vitest + React Testing Library；后端使用 Vitest + Supertest

**目标平台**: 本地开发环境与现代桌面浏览器

**项目类型**: Web application

**性能目标**: 在单团队、低并发的 MVP 场景下，常见读写操作应在 1 秒内完成并给出可见反馈；看板拖拽应保持流畅，无明显卡顿

**约束**: 不做登录；团队成员预置；状态列固定；数据库与部署方案必须足够轻量，支持本地快速启动；API 设计按 `projects` 与 `tasks` 两块分开

**规模/范围**: 单团队共享使用；预置少量成员；每个项目支持几十到几百个任务；仅覆盖项目、任务、负责人、状态流转四个核心能力

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `MVP First`: 通过。当前设计只覆盖验证核心流程所需能力，未引入登录、评论、标签、附件、自定义流程等扩展范围。
- `Specification Before Delivery`: 通过。规划基于已存在的 [spec.md](/D:/project/my-kanban/specs/001-team-kanban-mvp/spec.md) 展开。
- `Clear, Testable Requirements`: 通过。计划中的 API、数据模型、验证步骤均可映射到规格中的可测试需求。
- `Consistent Document Language`: 通过。规划文档默认使用中文，专有技术名词保留原文。

**初始结论**: 允许进入 Phase 0 与 Phase 1。

**Phase 1 后复核**:

- 数据模型已覆盖 `Project`、`Task`、`Team Member`、`Status Column`。
- 契约已按 `projects` 与 `tasks` 两块拆分。
- `quickstart.md` 已定义端到端验证流程。
- 未发现违反宪章的复杂度扩张。

**复核结论**: 通过，可进入 `/speckit-tasks`。

## 项目结构

### 文档（本功能）

```text
specs/001-team-kanban-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── projects.openapi.yaml
│   └── tasks.openapi.yaml
└── tasks.md
```

### 源码结构（仓库根目录）

```text
backend/
├── src/
│   ├── api/
│   │   ├── projects/
│   │   └── tasks/
│   ├── db/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   └── seed/
└── tests/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── projects/
│   │   └── tasks/
│   ├── services/
│   └── types/
└── tests/
    ├── integration/
    └── unit/
```

**结构决策**: 采用标准前后端分离结构。`backend/src/api/projects` 与 `backend/src/api/tasks` 分别承接两组接口；`frontend/src/features/projects` 与 `frontend/src/features/tasks` 对应页面状态与交互逻辑。这样能直接对应规格里的实体和接口边界，同时避免 MVP 阶段过度抽象。

## 复杂度跟踪

当前无需要额外豁免的宪章违规项。
