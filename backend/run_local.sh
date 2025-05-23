#!/bin/bash

# 데이터베이스 마이그레이션 실행
alembic -c alembic.local.ini upgrade head

# 애플리케이션 실행
uvicorn webapp.application:app --host 0.0.0.0 --port 8001 --reload