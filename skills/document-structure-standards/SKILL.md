---
name: document-structure-standards
description: 提供统一的文档结构规范，指导编写产品需求文档、开发设计方案文档时应包含的维度，并指定各类文档的存放路径。
metadata:
  author: AI Assistant
  version: "1.0.0"
  created_at: "2025-01-09"
---

# 文档结构规范 Skill

本 skill 用于指导团队编写各类文档时遵循统一的结构规范，确保文档完整性和一致性。

## 核心用途

- **提供文档结构规范**：明确各类文档应包含的维度清单
- **指定文档存放路径**：明确各类文档在项目中的存放位置
- **提升文档质量**：避免关键信息遗漏，统一文档结构

## 文档类型与路径

本 skill 为以下六类文档提供结构规范：

### 产品整体文档

| 文档类型 | 存放路径 | 参考规范 |
|---------|---------|---------|
| 产品整体介绍 | `docs/overview/产品整体介绍.md` | [product-overview-standards](references/product-overview-standards.md) |
| 前端整体架构设计 | `docs/standards/前端工程规范/前端整体架构设计.md` | [frontend-overall-standards](references/frontend-overall-standards.md) |
| 后端整体架构设计 | `docs/standards/后端工程规范/后端整体架构设计.md` | [backend-overall-standards](references/backend-overall-standards.md) |

### 功能模块文档

| 文档类型 | 存放路径 | 参考规范 |
|---------|---------|---------|
| 功能模块需求文档 | `docs/requirements/<功能模块>/需求描述.md` | [requirements-document-standards](references/requirements-document-standards.md) |
| 功能模块前端方案设计 | `docs/requirements/<功能模块>/references/前端方案设计.md` | [frontend-design-standards](references/frontend-design-standards.md) |
| 功能模块后端方案设计 | `docs/requirements/<功能模块>/references/后端方案设计.md` | [backend-design-standards](references/backend-design-standards.md) |

## 使用方法

### 1. 确定文档类型

根据需要编写的文档类型，参考上表确定对应的规范文档和存放路径。

### 2. 查阅结构规范

阅读对应的参考文档，了解该类文档应包含的维度清单。

### 3. 按维度编写文档

按照规范中的维度清单逐项编写文档内容，确保每个维度都有覆盖。

### 4. 存放到指定路径

将编写完成的文档存放到指定的路径，确保文档组织结构清晰。

## 注意事项

1. **维度完整性**：编写文档时应确保涵盖规范中的所有必要维度，避免信息遗漏
2. **路径正确性**：文档必须存放到指定路径，确保团队其他成员能够快速找到
3. **持续更新**：随着项目发展，如需调整文档结构，应同步更新对应的规范文档
4. **遵循现有结构**：本规范基于项目现有的目录结构（project-structure-spec.md），应保持一致性