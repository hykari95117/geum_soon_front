# pnpm 기본 명령어 정리

## 패키지 설치

| 명령어 | 설명 |
|--------|------|
| `pnpm install` | package.json의 모든 의존성 설치 |
| `pnpm add <패키지>` | 패키지 설치 (dependencies) |
| `pnpm add -D <패키지>` | 개발 의존성으로 설치 (devDependencies) |
| `pnpm add -g <패키지>` | 전역 설치 |

## 패키지 삭제

| 명령어 | 설명 |
|--------|------|
| `pnpm remove <패키지>` | 패키지 삭제 |
| `pnpm remove -g <패키지>` | 전역 패키지 삭제 |

## 패키지 업데이트

| 명령어 | 설명 |
|--------|------|
| `pnpm update` | 모든 패키지 업데이트 |
| `pnpm update <패키지>` | 특정 패키지 업데이트 |
| `pnpm outdated` | 업데이트 가능한 패키지 확인 |

## 스크립트 실행

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (vite) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm run <스크립트>` | package.json 스크립트 실행 |

## 기타 유용한 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm list` | 설치된 패키지 목록 |
| `pnpm list --depth=0` | 최상위 패키지만 표시 |
| `pnpm why <패키지>` | 패키지가 설치된 이유 확인 |
| `pnpm store prune` | 사용하지 않는 패키지 캐시 정리 |

## npm → pnpm 변환 요약

| npm | pnpm |
|-----|------|
| `npm install` | `pnpm install` |
| `npm i <패키지>` | `pnpm add <패키지>` |
| `npm i -D <패키지>` | `pnpm add -D <패키지>` |
| `npm uninstall <패키지>` | `pnpm remove <패키지>` |
| `npm run <스크립트>` | `pnpm <스크립트>` |
| `npm update` | `pnpm update` |
| `package-lock.json` | `pnpm-lock.yaml` |
