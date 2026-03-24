# 人际关系图谱 微信小程序

[English](README.md) | 简体中文 | [繁體中文](README.zh-TW.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md)

一款用于全面管理和探索人际关系网络的微信小程序。

## 项目结构

```
├── miniprogram/          # 小程序源代码
├── documents/            # 项目文档
├── LICENSE               # Apache License 2.0 开源许可证
├── NOTICE                # 版权和专利声明
├── package.json          # NPM 包配置
├── project.config.json   # 微信开发者工具项目配置
├── README.md             # 英文版说明文档
└── SETUP.md              # 安装配置说明
```

## 开发环境

1. 下载并安装微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 在微信开发者工具中打开本项目文件夹
3. 使用 AppID：`testappid` 进行本地测试
4. 点击"编译"运行小程序

## 核心功能

- 动态关系类型系统（数据库驱动）
- 预置 5 种关系类型（亲属、好友、同学、同事、邻里）
- 人物/人员管理
- 关系跟踪与自定义属性
- 自动关系推导

## 文档

详细文档请查看 `documents/` 目录。

## 贡献新的关系类型

我们欢迎社区贡献，共同扩展关系类型系统！项目目前包含 5 种预置关系类型（亲属、好友、同学、同事、邻里），我们鼓励社区开发新的类型以支持更多样化的关系场景。

### 文档优先开发流程

为确保一致性和质量，我们遵循**文档优先的开发流程**：

1. **📝 创建类型设计文档**
   - 遵循 [关系类型设计规范](documents/关系类型设计/关系类型设计规范.md)
   - 参考 `documents/关系类型设计/` 目录中的现有示例
   - 定义类型的数据结构、字段、验证规则和 UI 组件
   - 提交包含设计文档的 Pull Request

2. **✅ PR 审核与批准**
   - 维护者将审核设计文档
   - 可能会提供改进建议
   - 批准后，PR 将被合并

3. **💻 代码实现**
   - 设计文档 PR 被批准并合并后
   - 按照已批准的规范实现关系类型
   - 在 `miniprogram/models/guanxiTypes.js` 中添加类型定义
   - 更新 `miniprogram/locales/` 中的国际化文件
   - 提交实现代码的 PR，并引用设计文档

### 为什么要文档优先？

- **确保架构一致性** - 所有关系类型保持统一标准
- **促进社区讨论** - 在投入开发工作前进行充分讨论
- **避免破坏性变更** - 提前验证数据结构的合理性
- **便于代码审查** - 以明确的规范作为审查参考
- **保持长期可维护性** - 维护类型系统的整体质量

详细指南请参阅：
- [关系类型设计规范](documents/关系类型设计/关系类型设计规范.md) - 设计标准和要求
- [技术详细设计-5-关系类型插件实现](documents/技术详细设计-5-关系类型插件实现.md) - 插件系统实现指南

## 开源许可证

本项目采用 Apache License 2.0 开源许可证 - 详见 [LICENSE](LICENSE) 文件。

Copyright 2026 GuanXi WeChat Mini Program Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

有关专利授权的更多信息，请参阅 [NOTICE](NOTICE) 文件。
