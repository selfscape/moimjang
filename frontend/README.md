## **📘 Moimjang 프론트엔드 리포지터리**

### **🏷️ 프로젝트 소개**

- 모임장(Moimjang)은 오프라인 모임을 운영하는 호스트와 참가자를 위한 통합 관리 플랫폼입니다.

독립적인 3개의 웹 도메인(소비자, 판매자, 콘텐츠 관리자)으로 구성되어 있으며, 각 도메인은 목적에 따라 역할이 구분되어 있습니다.

- 소비자(유저) 사이트: [https://contents.moimjang.com](https://contents.moimjang.com/?host=tester)
- 판매자(호스트) 사이트: [https://seller.moimjang.com](https://seller.moimjang.com/?host=tester)
- 콘텐츠 관리자(어드민) 사이트: [https://admin.moimjang.com](https://admin.moimjang.com/?host=tester)

**테스트 계정**

- 아이디: tester.naver.com
- 비밀번호: 123123123a

---

### **🛠 기술 스택**

모임장은 최신 모던 프론트엔드 기술을 기반으로 한 **모노레포 구조**로 개발되었습니다.

- **Monorepo 관리**: npm workspaces
- **프레임워크**: Next.js 15, React 18, TypeScript
- **상태 관리**: Zustand, Immer
- **데이터 패칭 및 캐싱**: React Query
- **스타일링**: css-module , styled-components
- **API 통신**: fetch & axios
- **기타**: MSW, Swiper, React Icons, React Spinners

---

### **📌 주요 기능 소개**

각 도메인에서 제공하는 주요 기능은 다음과 같습니다:

### **✅ 소비자(유저)**

- 모임 리스트 조회 및 상세 보기
- 질문 카드 기반 첫인상 리뷰 작성
- 후기 및 피드백 제공

### **✅ 판매자(호스트)**

- 모임 생성 및 수정
- 참여자 랜덤 매칭
- 참여자 리뷰 열람 및 응답 관리

### **✅ 콘텐츠 관리자(어드민)**

- 전체 모임/사용자/리뷰 통계 관리
- 유저 제재 및 상태 모니터링
- 운영 정책 기반 콘텐츠 수동 조작

---

### **🧱 프로젝트 구조**

```
apps/
  ├── admin     # 콘텐츠 관리 웹앱
  ├── contents  # 소비자(유저)용 웹앱
  └── seller    # 판매자(호스트) 웹앱

packages/
  └── (공통 컴포넌트, 유틸리티, 타입 관리 예정)
```

---

### **🚀 실행 방법**

1. **패키지 설치**

```
npm install
```

1. **도메인별 환경 변수 설정**

각 apps/\* 디렉토리에 .env.local 파일을 생성하고 다음과 같이 설정합니다:

```
REACT_APP_SERVER_URI=https://matchlog.chanyoung.site
```

> ⚠️ 환경변수 파일이 없을 경우 API 통신 오류가 발생할 수 있습니다.

1. **도메인 실행 명령어**

```
npm run dev:admin     # 어드민 실행
npm run dev:seller    # 판매자 도메인 실행
npm run dev:contents  # 소비자 도메인 실행
```

### **🚢 배포 방법**

#### **1. Admin 앱 (React + nginx)**

```bash
cd frontend

# 빌드
docker build \
  --build-arg REACT_APP_SERVER_URI=https://matchlog.chanyoung.site \
  --build-arg REACT_APP_NODE_ENV=production \
  --build-arg REACT_APP_ENVIRONMENT=production \
  --build-arg REACT_APP_SITE_URL=https://admin.moimjang.site \
  -f apps/admin/Dockerfile \
  -t moimjang/admin .

# 실행 (포트 3131)
docker run -d --name moimjang-admin -p 3131:80 moimjang/admin
```

#### **2. Contents 앱 (Next.js + Node.js)**

```bash
cd frontend

# 빌드
docker build \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://matchlog.chanyoung.site \
  --build-arg NEXT_PUBLIC_NODE_ENV=production \
  --build-arg NEXT_PUBLIC_ENVIRONMENT=production \
  --build-arg NEXT_PUBLIC_SITE_URL=https://contents.moimjang.site \
  -f apps/contents/Dockerfile \
  -t moimjang/contents .

# 실행 (포트 3133)
docker run -d --name moimjang-contents -p 3133:3000 moimjang/contents
```

#### **3. Seller 앱 (Next.js + Node.js)**

```bash
cd frontend

# 빌드
docker build \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://matchlog.chanyoung.site \
  --build-arg NEXT_PUBLIC_NODE_ENV=production \
  --build-arg NEXT_PUBLIC_ENVIRONMENT=production \
  --build-arg NEXT_PUBLIC_SITE_URL=https://seller.moimjang.site \
  -f apps/seller/Dockerfile \
  -t moimjang/seller .

# 실행 (포트 3132)
docker run -d --name moimjang-seller -p 3132:3000 moimjang/seller
```

> **주의사항**:
>
> - Admin 앱은 `REACT_APP_*` 환경변수를 사용합니다 (React)
> - Contents/Seller 앱은 `NEXT_PUBLIC_*` 환경변수를 사용합니다 (Next.js)
> - Admin 앱은 nginx로 서빙되어 포트 80을 사용합니다
> - Contents/Seller 앱은 Node.js로 서빙되어 포트 3000을 사용합니다
