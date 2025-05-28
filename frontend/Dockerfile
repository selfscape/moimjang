# 멀티 스테이지 빌드를 사용하여 최적화된 프로덕션 이미지 생성

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

# package.json과 package-lock.json 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치 (devDependencies 포함해야 빌드 가능)
RUN npm ci

# 소스 코드 복사
COPY . .

# React 앱 빌드 (프로덕션 모드)
RUN npm run build

# 2단계: 프로덕션 스테이지
FROM nginx:alpine

# 빌드된 파일을 nginx 정적 파일 디렉토리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 80 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
