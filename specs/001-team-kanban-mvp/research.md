# Phase 0 Research: 团队 Kanban MVP

Feature: 001-team-kanban-mvp  
Date: 2026-07-07

基于当前 `spec.md`、`plan.md`、`data-model.md` 与 API contracts，本文记录会直接影响实现的关键技术决策，仅覆盖前端栈、拖拽方案、后端结构、数据存储与验证策略等核心问题。

## 1. 前端框架与构建工具

- Decision: 前端采用 `React 18 + Vite + TypeScript`。
- Rationale:
  - 当前 MVP 的核心界面是“项目列表 + Kanban 看板 + 任务表单”，需要较快完成状态驱动 UI，而不是追求 SSR 或复杂路由能力。
  - `Vite` 启动和热更新足够快，适合这类需要频繁调整拖拽与表单交互的本地验证项目。
  - `TypeScript` 能让 `Project`、`Task`、`TeamMember`、`TaskStatus` 在前端、接口和测试之间保持一致，降低字段漂移和状态值拼写错误。
- Alternatives considered:
  - `Next.js`：框架能力更完整，但当前不需要 SSR、文件路由或全栈渲染，引入后只会增加脚手架复杂度。
  - 纯 `JavaScript` + `Vite`：上手更轻，但会削弱接口模型和拖拽状态的静态约束，不利于快速稳定联调。

## 2. 看板拖拽方案

- Decision: 看板拖拽采用 `@dnd-kit/core` 与 `@dnd-kit/sortable`。
- Rationale:
  - 需求明确要求跨状态列拖动任务卡片，`dnd-kit` 对 React 状态驱动 UI 的适配更自然，能直接支撑列间移动和后续同列排序扩展。
  - 当前状态列固定为 `todo`、`in_progress`、`done`，`dnd-kit` 足够覆盖 MVP 需要的碰撞检测、拖拽覆盖态和无障碍基础能力。
  - 相比手写拖拽，使用现成库更能把精力集中在“状态更新是否正确持久化”这一真正影响验收的点上。
- Alternatives considered:
  - `react-beautiful-dnd`：API 体验曾经很好，但维护状态不理想，不适合作为新项目的基础依赖。
  - 原生 HTML5 Drag and Drop：依赖最少，但在 React 中处理触发时机、拖拽反馈和状态同步会更绕，整体实现风险更高。

## 3. 后端运行时与接口组织

- Decision: 后端采用 `Node.js 20 LTS + Express + TypeScript`，接口按 `projects` 与 `tasks` 两块拆分。
- Rationale:
  - 用户已明确约束后端使用 Node + Express，这套组合对创建项目、创建任务、分配负责人、更新状态这类 CRUD + 局部更新接口足够直接。
  - 当前 contracts 已拆为 `projects.openapi.yaml` 与 `tasks.openapi.yaml`，与 `Project`、`Task` 两个核心资源边界一致，便于在代码结构上对应 `api/projects` 和 `api/tasks`。
  - 任务创建和任务列表保留 `/api/projects/:projectId/tasks` 的项目上下文，任务更新则走 `/api/tasks/:taskId` 与 `/api/tasks/:taskId/status`，兼顾资源归属清晰和更新路径简洁。
- Alternatives considered:
  - `Fastify`：性能和类型生态都不错，但当前接口规模很小，切换框架带来的收益不足以覆盖迁移心智成本。
  - 所有任务接口都完全嵌套在项目路径下：归属更直观，但单任务更新路径偏长，也不利于职责拆分。

## 4. 数据存储方案

- Decision: 使用 SQLite，并通过 `better-sqlite3` 直接访问数据库，先以轻量 Repository 封装 SQL。
- Rationale:
  - 用户已经明确要求“数据库用 SQLite 先跑起来”，目标是验证单团队共享看板流程，而不是提前为多租户或高并发做准备。
  - 当前数据模型只有 `Project`、`Task`、`Team Member` 和固定状态列，关系简单，直接写 SQL 足以支撑唯一项目名、任务归属、负责人分配和状态持久化。
  - `better-sqlite3` 在本地开发和单机 MVP 场景下依赖少、启动快，避免为了很小的数据规模引入 ORM、迁移框架或独立数据库服务。
- Alternatives considered:
  - Prisma + SQLite：开发体验更完整，但 schema 生成与迁移流程更重，不符合当前“尽快跑通核心链路”的目标。
  - PostgreSQL：更适合扩展，但会抬高环境准备和运维门槛，超过当前 MVP 所需复杂度。

## 5. 测试与验证策略

- Decision: 以单元测试和集成测试为主，前端使用 `Vitest + React Testing Library`，后端使用 `Vitest + Supertest`。
- Rationale:
  - 当前成功标准集中在“创建项目、添加任务、分配负责人、跨列拖动并持久化”这条核心链路，主要风险来自接口行为和前端状态同步，而不是复杂浏览器兼容矩阵。
  - 后端可通过集成测试验证项目名唯一、任务归属、负责人更新、状态更新等关键约束；前端可验证表单交互、列渲染和拖拽后的状态反馈。
  - 在项目尚处于 MVP 验证阶段时，先不强依赖完整 E2E 自动化，可以把实现成本控制在更合理的范围内。
- Alternatives considered:
  - 直接引入 `Playwright` E2E：覆盖更完整，但会提前增加浏览器脚本维护成本，不利于当前快速收敛。
  - 仅做手工验证：短期最省事，但回归成本高，无法稳定保护拖拽和状态持久化这类容易退化的行为。
