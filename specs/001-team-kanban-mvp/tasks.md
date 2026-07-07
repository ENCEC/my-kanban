# Tasks: 团队 Kanban MVP

**Input**: 设计文档来自 `/specs/001-team-kanban-mvp/`

**Prerequisites**: plan.md（必需）, spec.md（必需）, research.md, data-model.md, contracts/

**Tests**: 本任务清单不强制采用 TDD，因为功能规格未显式要求“先写失败测试再实现”。本清单保留每个用户故事的独立验证标准，并在收尾阶段加入验证任务。

**Organization**: 任务按用户故事分组，确保每个故事都能独立实现、独立验证。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可并行执行（不同文件、无未完成前置依赖）
- **[Story]**: 任务所属用户故事（如 `US1`, `US2`, `US3`）
- 每条任务描述都包含精确文件路径

## Path Conventions

- Web app 结构采用 `backend/src/` 与 `frontend/src/`
- 后端测试位于 `backend/tests/`
- 前端测试位于 `frontend/tests/`

## Phase 1: Setup（共享初始化）

**Purpose**: 建立前后端工作区、基础脚本与目录结构

- [X] T001 创建根级 workspace 配置与共享脚本于 `package.json`
- [X] T002 [P] 创建前端项目清单与开发脚本于 `frontend/package.json`
- [X] T003 [P] 创建后端项目清单与开发脚本于 `backend/package.json`
- [X] T004 [P] 创建前端 TypeScript 与 Vite 配置于 `frontend/tsconfig.json`、`frontend/vite.config.ts`
- [X] T005 [P] 创建后端 TypeScript 配置于 `backend/tsconfig.json`
- [X] T006 按实施计划创建目录骨架于 `frontend/src/`、`frontend/tests/`、`backend/src/`、`backend/tests/`

---

## Phase 2: Foundational（阻塞性前置能力）

**Purpose**: 完成所有用户故事共享的基础设施，必须先于任何用户故事

**⚠️ CRITICAL**: 本阶段完成前，不应开始任何用户故事实现

- [X] T007 创建后端 Express 入口与中间件装配于 `backend/src/app.ts`、`backend/src/server.ts`
- [X] T008 [P] 创建环境配置与端口/数据库路径读取于 `backend/src/config.ts`
- [X] T009 [P] 创建 SQLite 连接、建表脚本与初始化脚本于 `backend/src/db/client.ts`、`backend/src/db/init.ts`、`backend/src/scripts/init-db.ts`
- [X] T010 [P] 创建预置团队成员 seed 脚本于 `backend/src/seed/team-members.ts`、`backend/src/scripts/seed-db.ts`
- [X] T011 创建后端共享类型与状态常量于 `backend/src/models/project.ts`、`backend/src/models/task.ts`、`backend/src/models/team-member.ts`
- [X] T012 [P] 创建 `projects` 与 `tasks` 路由注册骨架于 `backend/src/api/projects/routes.ts`、`backend/src/api/tasks/routes.ts`
- [X] T013 [P] 创建统一错误处理与请求失败响应于 `backend/src/middleware/error-handler.ts`
- [X] T014 创建前端应用入口、路由壳层与全局样式于 `frontend/src/app/App.tsx`、`frontend/src/main.tsx`、`frontend/src/app/routes.tsx`、`frontend/src/app/styles.css`
- [X] T015 [P] 创建前端共享类型与状态映射于 `frontend/src/types/project.ts`、`frontend/src/types/task.ts`
- [X] T016 [P] 创建前端 API 请求封装于 `frontend/src/services/http.ts`

**Checkpoint**: 基础设施就绪，用户故事可以按优先级推进

---

## Phase 3: User Story 1 - 创建项目并录入初始任务（Priority: P1） 🎯 MVP

**Goal**: 用户可以创建项目、查看项目列表、进入项目看板并在项目下创建任务

**Independent Test**: 启动应用后，用户可新建项目并进入该项目看板；在该项目中新增两个任务后，这两个任务都只显示在该项目的 `todo` 列中

### Implementation for User Story 1

- [X] T017 [P] [US1] 实现 `projects` 数据访问层于 `backend/src/repositories/project-repository.ts`
- [X] T018 [P] [US1] 实现 `tasks` 数据访问层基础读写于 `backend/src/repositories/task-repository.ts`
- [X] T019 [US1] 实现项目服务与项目名唯一校验于 `backend/src/services/project-service.ts`
- [X] T020 [US1] 实现任务创建服务与默认状态写入于 `backend/src/services/task-service.ts`
- [X] T021 [US1] 实现获取项目列表与创建项目接口于 `backend/src/api/projects/routes.ts`
- [X] T022 [US1] 实现获取单个项目详情接口于 `backend/src/api/projects/routes.ts`
- [X] T023 [US1] 实现项目下任务列表与创建任务接口于 `backend/src/api/tasks/routes.ts`
- [X] T024 [P] [US1] 实现项目列表页与创建项目表单于 `frontend/src/features/projects/ProjectsPage.tsx`
- [X] T025 [P] [US1] 实现项目看板页基础布局与空状态展示于 `frontend/src/features/projects/ProjectBoardPage.tsx`
- [X] T026 [P] [US1] 实现项目相关前端 API 调用与数据加载于 `frontend/src/features/projects/projects.api.ts`
- [X] T027 [P] [US1] 实现任务创建表单与 `todo` 列渲染于 `frontend/src/features/tasks/TaskComposer.tsx`、`frontend/src/features/tasks/TaskColumn.tsx`
- [X] T028 [US1] 串联项目列表、项目详情和任务创建流程于 `frontend/src/app/routes.tsx`、`frontend/src/features/projects/ProjectBoardPage.tsx`
- [X] T029 [US1] 补充重复项目名与空项目看板的用户反馈于 `frontend/src/features/projects/ProjectsPage.tsx`、`backend/src/services/project-service.ts`

**Checkpoint**: User Story 1 可独立演示，满足 MVP 最小闭环的前半段

---

## Phase 4: User Story 2 - 分配任务负责人（Priority: P2）

**Goal**: 用户可以为任务选择预置成员作为负责人，并在界面上持续看到分配结果

**Independent Test**: 在已有项目和任务的前提下，用户可为某任务选择一个预置成员；刷新页面后，任务卡片仍显示相同负责人

### Implementation for User Story 2

- [X] T030 [P] [US2] 实现团队成员读取与可分配成员过滤于 `backend/src/repositories/team-member-repository.ts`
- [X] T031 [US2] 扩展任务服务以支持负责人分配与变更校验于 `backend/src/services/task-service.ts`
- [X] T032 [US2] 实现任务负责人更新接口于 `backend/src/api/tasks/routes.ts`
- [X] T033 [US2] 扩展项目任务列表响应以返回负责人和成员列表于 `backend/src/api/tasks/routes.ts`、`backend/src/services/task-service.ts`
- [X] T034 [P] [US2] 实现负责人选择器组件于 `frontend/src/features/tasks/AssigneeSelect.tsx`
- [X] T035 [P] [US2] 实现任务负责人更新 API 调用于 `frontend/src/features/tasks/tasks.api.ts`
- [X] T036 [US2] 在任务卡片中展示负责人并支持修改于 `frontend/src/features/tasks/TaskCard.tsx`
- [X] T037 [US2] 在项目看板页面接入成员列表与负责人更新反馈于 `frontend/src/features/projects/ProjectBoardPage.tsx`

**Checkpoint**: User Story 2 完成后，任务归属对用户可见且可持久保存

---

## Phase 5: User Story 3 - 在状态列之间移动任务（Priority: P3）

**Goal**: 用户可以通过拖拽将任务卡片移动到任意状态列，并在刷新后保持最终状态

**Independent Test**: 在已有项目和任务的前提下，用户可将任务从 `todo` 拖到 `in_progress` 再拖到 `done`；每次拖拽后卡片都进入目标列，刷新后仍保留最终状态

### Implementation for User Story 3

- [X] T038 [US3] 扩展任务服务以支持任意状态流转与状态持久化于 `backend/src/services/task-service.ts`
- [X] T039 [US3] 实现任务状态更新接口于 `backend/src/api/tasks/routes.ts`
- [X] T040 [P] [US3] 实现前端拖拽上下文与状态列映射于 `frontend/src/features/tasks/BoardDndContext.tsx`
- [X] T041 [P] [US3] 实现拖拽后的任务状态更新 API 调用于 `frontend/src/features/tasks/tasks.api.ts`
- [X] T042 [US3] 在看板页面接入 `dnd-kit` 拖拽交互于 `frontend/src/features/projects/ProjectBoardPage.tsx`
- [X] T043 [US3] 调整任务列与任务卡片以支持拖拽态、空列接收和移动反馈于 `frontend/src/features/tasks/TaskColumn.tsx`、`frontend/src/features/tasks/TaskCard.tsx`
- [X] T044 [US3] 完成拖拽后的本地状态同步与失败回滚处理于 `frontend/src/features/projects/ProjectBoardPage.tsx`

**Checkpoint**: 所有用户故事都已具备独立可用性，完整核心流程可以跑通

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 完成跨故事优化、文档与最终验证

- [X] T045 [P] 补充前后端 README 与启动说明于 `frontend/README.md`、`backend/README.md`
- [X] T046 整理 API 错误消息与前端提示文案一致性于 `backend/src/middleware/error-handler.ts`、`frontend/src/features/projects/ProjectsPage.tsx`、`frontend/src/features/projects/ProjectBoardPage.tsx`
- [X] T047 [P] 增加后端关键集成测试于 `backend/tests/integration/projects.integration.test.ts`、`backend/tests/integration/tasks.integration.test.ts`
- [X] T048 [P] 增加前端核心交互测试于 `frontend/tests/integration/projects-page.test.tsx`、`frontend/tests/integration/project-board.test.tsx`
- [X] T049 按 `quickstart.md` 执行一次端到端手工验证并记录结果于 `specs/001-team-kanban-mvp/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: 无依赖，可立即开始
- **Phase 2: Foundational**: 依赖 Phase 1 完成，并阻塞所有用户故事
- **Phase 3: User Story 1**: 依赖 Phase 2 完成，是建议 MVP 范围
- **Phase 4: User Story 2**: 依赖 US1 已有任务与看板页面能力
- **Phase 5: User Story 3**: 依赖 US1 已有任务与状态列展示能力；可在 US2 之后或并行收尾，但集成时会共享看板页面文件
- **Phase 6: Polish**: 依赖所有目标用户故事完成

### User Story Dependencies

- **User Story 1 (P1)**: 无其他故事依赖，是 MVP 最小交付
- **User Story 2 (P2)**: 依赖 US1 已能创建并展示任务
- **User Story 3 (P3)**: 依赖 US1 已能创建并展示任务；不依赖负责人分配逻辑本身

### Within Each User Story

- 数据访问层先于服务层
- 服务层先于 API 或页面集成
- API 与前端组件完成后，再做页面级串联
- 每个故事完成后都应先按独立验证标准手工检查，再继续下一优先级

### Parallel Opportunities

- Phase 1 中 `T002`、`T003`、`T004`、`T005` 可并行
- Phase 2 中 `T008`、`T009`、`T010`、`T012`、`T013`、`T015`、`T016` 可并行
- US1 中后端仓储任务 `T017`、`T018` 可并行，前端页面/API 任务 `T024`、`T025`、`T026`、`T027` 可并行
- US2 中 `T034`、`T035` 可并行
- US3 中 `T040`、`T041` 可并行
- Polish 中 `T045`、`T047`、`T048` 可并行

---

## Parallel Example: User Story 1

```bash
# 后端并行准备项目与任务数据访问层
Task: "实现 `projects` 数据访问层于 backend/src/repositories/project-repository.ts"
Task: "实现 `tasks` 数据访问层基础读写于 backend/src/repositories/task-repository.ts"

# 前端并行准备项目与任务基础界面
Task: "实现项目列表页与创建项目表单于 frontend/src/features/projects/ProjectsPage.tsx"
Task: "实现项目看板页基础布局与空状态展示于 frontend/src/features/projects/ProjectBoardPage.tsx"
Task: "实现任务创建表单与 `todo` 列渲染于 frontend/src/features/tasks/TaskComposer.tsx、frontend/src/features/tasks/TaskColumn.tsx"
```

---

## Implementation Strategy

### MVP First（只做 User Story 1）

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational
3. 完成 Phase 3: User Story 1
4. 停下来按独立验证标准检查“创建项目并录入初始任务”是否跑通
5. 通过后再决定是否继续负责人分配和拖拽

### Incremental Delivery

1. Setup + Foundational 完成后，先交付 US1
2. 在 US1 稳定后补上 US2 的负责人分配
3. 最后补上 US3 的拖拽状态流转
4. 每完成一个故事都可以单独演示和验收，不需要等全部功能齐备

### Parallel Team Strategy

如果多人协作：

1. 全队先一起完成 Setup 与 Foundational
2. 之后一人主做后端 `projects/tasks` 服务，一人主做前端项目/任务页面
3. US2 与 US3 虽都依赖 US1，但可在 US1 基础能力稳定后分别并行推进，再统一在看板页面整合

---

## Notes

- `[P]` 任务表示不同文件、可并行推进
- `[US1]`、`[US2]`、`[US3]` 标签用于把实现追踪回具体用户故事
- 每个用户故事都保留了独立验证标准，便于分阶段验收
- 任务描述已包含明确文件路径，可直接作为实现输入
- 建议优先完成 MVP 范围：Phase 1、Phase 2、Phase 3
