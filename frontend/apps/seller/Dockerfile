# 단일 스테이지를 사용한 간단한 Next.js 도커화
# 사용법: cd <root_project_path>/frontend && docker build -f apps/seller/Dockerfile -t moimjang/seller .

FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 인수 정의
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_NODE_ENV
ARG NEXT_PUBLIC_DANGEROUSLY_DISABLE_HOST_CHECK
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_SITE_URL

# 환경변수로 설정
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_NODE_ENV=$NEXT_PUBLIC_NODE_ENV
ENV NEXT_PUBLIC_DANGEROUSLY_DISABLE_HOST_CHECK=$NEXT_PUBLIC_DANGEROUSLY_DISABLE_HOST_CHECK
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN echo "NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL"

# 패키지 파일들 복사
COPY package*.json ./
COPY apps/seller/package*.json ./apps/seller/

# 의존성 설치
RUN npm install --include-workspace-root --workspaces
## USE this line if you build in arm64
#RUN npm install --include-workspace-root --workspaces --include=optional sharp

# 전체 소스 복사
COPY packages ./packages/
COPY apps/seller ./apps/seller/

# seller 앱으로 이동 후 빌드
WORKDIR /app/apps/seller
RUN npm run build

# 포트 3000 노출
EXPOSE 3000

# Next.js 실행
CMD ["npm", "start"]