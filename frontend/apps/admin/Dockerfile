# 멀티 스테이지 빌드를 사용하여 최적화된 프로덕션 이미지 생성
# 사용법: cd <root_project_path>/frontend && docker build -f apps/admin/Dockerfile -t moimjang/admin .

# 1단계: 빌드 스테이지
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 인수 정의
ARG REACT_APP_SERVER_URI
ARG REACT_APP_NODE_ENV
ARG REACT_APP_DANGEROUSLY_DISABLE_HOST_CHECK
ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_SITE_URL

# 환경변수로 설정
ENV REACT_APP_SERVER_URI=$REACT_APP_SERVER_URI
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_DANGEROUSLY_DISABLE_HOST_CHECK=$REACT_APP_DANGEROUSLY_DISABLE_HOST_CHECK
ENV REACT_APP_ENVIRONMENT=$REACT_APP_ENVIRONMENT
ENV REACT_APP_SITE_URL=$REACT_APP_SITE_URL

# 루트의 package.json과 package-lock.json 복사 (monorepo 설정)
COPY package*.json ./

# admin 앱의 package.json도 복사 (workspace 설정을 위해)
COPY apps/admin/package*.json ./apps/admin/

# workspace 전체 의존성 설치 (모든 workspace의 의존성 포함)
RUN npm install --include-workspace-root --workspaces

# admin 앱 소스 코드만 복사
COPY apps/admin ./apps/admin/

# admin 앱 빌드를 위해 작업 디렉토리 변경
WORKDIR /app/apps/admin
RUN npm run build

# 2단계: 프로덕션 스테이지
FROM nginx:alpine

# 빌드된 파일을 nginx 정적 파일 디렉토리로 복사
COPY --from=builder /app/apps/admin/build /usr/share/nginx/html
COPY --from=builder /app/apps/admin/build /etc/nginx/html

# nginx 설정 파일 복사 (build context가 frontend이므로)
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

# 포트 80 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]