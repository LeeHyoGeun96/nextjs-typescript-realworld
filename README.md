## 프로젝트 소개

이 프로젝트는 Next.js를 이용하여 구현한 실제 블로그 플랫폼으로, Medium.com과 같은 사용자 경험을 제공합니다. RealWorld 명세를 따라 구현되었으며, 사용자 인증, 게시글 작성, 댓글, 프로필 관리 등 실제 애플리케이션에서 필요한 모든 기능을 포함하고 있습니다.

링크 - https://nextjs-typescript-realworld.vercel.app/

## 기술 스택

- **프론트엔드**: Next.js 14, React, TypeScript, Tailwind CSS
- **상태 관리**: SWR, Zustand
- **인증**: JWT 토큰 인증
- **스타일링**: Tailwind CSS
- **폼 관리**: Server Actions

## 주요 기능

- 사용자 인증 (회원가입, 로그인, 로그아웃)
- 사용자 프로필 관리
- 게시글 작성, 수정, 삭제
- 게시글 조회 (글 목록, 상세 페이지)
- 댓글 시스템
- 좋아요 기능
- 사용자 팔로우 기능
- 다크 모드 지원
- 반응형 디자인
- 동적, 정적 메타데이터 생성

## 설치 및 실행 방법

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/realworld-nextjs.git

# 프로젝트 폴더로 이동
cd realworld-nextjs

# 의존성 설치
npm install
# 또는
yarn install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 변수들을 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_backend_server_url
NEXT_PUBLIC_STORAGE_BUCKET=your_supabase_storage_name
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_role_key
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 http://localhost:3000 으로 접속하여 애플리케이션을 확인할 수 있습니다.

backend 레파지토리

- https://github.com/LeeHyoGeun96/node-express-prisma-v1-official-app

## 프로젝트 구조

```
realworld-nextjs/
├── actions/         # 서버 액션 (Server Actions)
├── app/             # Next.js 앱 라우터
├── components/      # 재사용 가능한 컴포넌트
├── context/         # React Context
├── error/           # 에러 처리 관련 코드
├── hooks/           # 커스텀 React 훅
├── lib/             # 유틸리티 라이브러리
├── public/          # 정적 파일
├── types/           # TypeScript 타입 정의
└── utils/           # 유틸리티 함수
```

## 배포 방법

이 애플리케이션은 Vercel, Netlify 또는 다른 Next.js 호스팅 서비스에 쉽게 배포할 수 있습니다.

### Vercel을 통한 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

## 감사의 말

이 프로젝트는 [RealWorld](https://github.com/gothinkster/realworld) 명세를 기반으로 제작되었습니다.
