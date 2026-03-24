# 인간관계 지도 WeChat 미니 프로그램

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja-JP.md) | 한국어

인간관계 네트워크를 포괄적으로 관리하고 탐색하기 위한 WeChat 미니 프로그램입니다.

## 프로젝트 구조

```
├── miniprogram/          # 미니 프로그램 소스 코드
├── documents/            # 프로젝트 문서
├── LICENSE               # Apache License 2.0 오픈소스 라이선스
├── NOTICE                # 저작권 및 특허 고지
├── package.json          # NPM 패키지 설정
├── project.config.json   # WeChat 개발자 도구 프로젝트 설정
├── README.md             # 영문 문서
└── SETUP.md              # 설치 구성 가이드
```

## 개발 환경

1. WeChat 개발자 도구 다운로드 및 설치: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. WeChat 개발자 도구에서 이 프로젝트 폴더 열기
3. 로컬 테스트를 위해 AppID: `testappid` 사용
4. "컴파일"을 클릭하여 미니 프로그램 실행

## 핵심 기능

- 동적 관계 유형 시스템 (데이터베이스 기반)
- 5가지 사전 설치된 관계 유형 (가족, 친구, 동급생, 동료, 이웃)
- 인물 관리
- 사용자 정의 속성을 통한 관계 추적
- 자동 관계 추론

## 문서

자세한 문서는 `documents/` 디렉토리를 참조하세요.

## 새로운 관계 유형 기여하기

관계 유형 시스템을 확장하기 위한 커뮤니티 기여를 환영합니다! 이 프로젝트는 현재 5가지 관계 유형(가족, 친구, 동급생, 동료, 이웃)을 포함하고 있으며, 더 다양한 관계 시나리오를 지원하기 위한 새로운 유형 개발을 권장합니다.

### 문서 우선 접근 방식

일관성과 품질을 보장하기 위해 **문서 우선 개발 프로세스**를 따릅니다:

1. **📝 유형 설계 문서 작성**
   - [关系类型设计规范](documents/关系类型设计/关系类型设计规范.md) (관계 유형 설계 표준)을 따르세요
   - `documents/关系类型设计/` 디렉토리의 기존 예제를 참조하세요
   - 유형의 데이터 구조, 필드, 유효성 검사 규칙 및 UI 컴포넌트를 정의하세요
   - 설계 문서를 포함하는 Pull Request를 제출하세요

2. **✅ PR 검토 및 승인**
   - 설계 문서는 유지 관리자가 검토합니다
   - 개선을 위한 피드백이 제공될 수 있습니다
   - 승인되면 PR이 병합됩니다

3. **💻 구현**
   - 설계 문서 PR이 승인되고 병합된 후
   - 승인된 사양에 따라 관계 유형을 구현하세요
   - `miniprogram/models/guanxiTypes.js`에 유형 정의를 추가하세요
   - `miniprogram/locales/`의 국제화 파일을 업데이트하세요
   - 설계 문서를 참조하여 구현 PR을 제출하세요

### 왜 문서 우선인가?

- **아키텍처 일관성 보장** - 모든 관계 유형에서 통일된 표준 유지
- **커뮤니티 토론 촉진** - 구현 작업 전에 충분한 토론 진행
- **파괴적인 변경 방지** - 데이터 구조를 조기에 검증
- **코드 검토 용이화** - 명확한 사양을 검토 참조로 사용
- **장기 유지보수성 유지** - 유형 시스템의 전반적인 품질 유지

자세한 가이드는 다음을 참조하세요:
- [关系类型设计规范](documents/关系类型设计/关系类型设计规范.md) - 설계 표준 및 요구사항
- [技术详细设计-5-关系类型插件实现](documents/技术详细设计-5-关系类型插件实现.md) - 플러그인 시스템 구현 가이드

## 오픈소스 라이선스

이 프로젝트는 Apache License 2.0에 따라 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

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

특허 부여에 대한 자세한 내용은 [NOTICE](NOTICE) 파일을 참조하세요.
