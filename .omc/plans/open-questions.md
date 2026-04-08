# Open Questions

此文件记录所有计划中的开放问题，按计划名称和日期组织。

---

## wedding-planner-phase1 - 2026-04-07

- [ ] 情侣协同的账号系统如何实现？是否复用现有 collaborator 机制？ — 影响双人账号同步测试方案
- [ ] 第二阶段迁移到独立存储的触发条件是什么？（数据量阈值？同步频率？） — 影响第一阶段数据结构设计预留
- [ ] BudgetCard 组件是否可以完全复用？是否需要针对婚礼预算特性进行扩展？ — 影响第5周预算组件工作量评估

---

## 已解决问题

~~1. 现有测试框架是什么？~~ **已解决**：项目无测试框架（无 vitest.config.*、无 *.test.* 文件），第一阶段采用手动验证。

~~2. wedding.json 的文件路径规范是什么？~~ **已解决**：采用内嵌 GlobalMeta 方案，无需独立文件存储。

~~3. StorageAPI 是否支持扩展多文件？~~ **已解决**：Tidal 架构的 entryName 是创建时固定参数，无法在单一 Endpoint 内支持双 entryName；需重构 StorageAPI 和所有 Endpoint 实现（预计15-20天额外工作量），因此选择内嵌 GlobalMeta 方案。

~~4. GlobalMeta.wedding 字段的类型定义是否需要扩展 ledger/type.ts？~~ **已解决**：需要在 `src/ledger/type.ts` 中扩展 GlobalMeta，添加 `wedding?: WeddingData` 字段，确保 TypeScript 类型检查一致性。