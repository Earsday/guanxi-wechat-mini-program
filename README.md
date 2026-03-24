# 人际关系图谱 WeChat Mini Program

English | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja-JP.md) | [한국어](README.ko-KR.md)

A WeChat mini-program for comprehensive guanxi management and exploration.

## Project Structure

```
├── miniprogram/          # Mini-program source code
├── documents/            # Project documentation
├── LICENSE               # Apache License 2.0
├── NOTICE                # Copyright and patent notices
├── package.json          # NPM package configuration
├── project.config.json   # WeChat DevTools project config
├── README.md             # This file
└── SETUP.md              # Setup instructions
```

## Development

1. Install WeChat DevTools: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. Open this project folder in WeChat DevTools
3. Use AppID: `testappid` for local testing
4. Click "Compile" to run the mini-program

## Features

- Dynamic relationship type system (database-driven)
- 5 pre-installed relationship types (family, friends, classmates, colleagues, neighbors)
- Character/people management
- Relationship tracking with custom attributes
- Automatic relationship deduction

## Documentation

Comprehensive documentation is available in the `documents/` directory.

## Contributing New Relationship Types

We welcome contributions to expand the relationship type system! The project currently includes 5 pre-installed relationship types (family, friends, classmates, colleagues, neighbors), and we encourage the community to develop new types to support diverse relationship scenarios.

### Documentation-First Approach

To ensure consistency and quality, we follow a **documentation-first development process**:

1. **📝 Create Type Design Document**
   - Follow the [关系类型设计规范](documents/关系类型设计/关系类型设计规范.md) (Relationship Type Design Standards)
   - Review existing examples in `documents/关系类型设计/` directory
   - Define the type's data structure, fields, validation rules, and UI components
   - Submit a Pull Request with your design document

2. **✅ PR Review & Approval**
   - The design document will be reviewed by maintainers
   - Feedback may be provided for improvements
   - Once approved, the PR will be merged

3. **💻 Implementation**
   - After your design document PR is approved and merged
   - Implement the relationship type according to the approved specification
   - Add type definition to `miniprogram/models/guanxiTypes.js`
   - Update i18n files in `miniprogram/locales/`
   - Submit implementation PR with reference to the design document

### Why Documentation First?

- **Ensures architectural consistency** across all relationship types
- **Enables community discussion** before implementation effort
- **Prevents breaking changes** by validating data structures early
- **Facilitates code review** with clear specifications as reference
- **Maintains long-term maintainability** of the type system

For detailed guidelines, see:
- [关系类型设计规范](documents/关系类型设计/关系类型设计规范.md) - Design standards and requirements
- [技术详细设计-5-关系类型插件实现](documents/技术详细设计-5-关系类型插件实现.md) - Plugin system implementation guide

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

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

For more information about patent grants, see the [NOTICE](NOTICE) file.
