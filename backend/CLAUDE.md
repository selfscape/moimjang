# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Test, and Run Commands
- Run API server: `docker-compose up -d webapp`
- Run migrations: `docker-compose up migrations`
- Run tests: `docker-compose run --rm webapp py.test webapp/tests.py --cov=webapp`
- Run single test: `docker-compose run --rm webapp py.test webapp/tests.py::test_name -v`
- Create migration: `docker-compose run --rm webapp alembic revision --autogenerate -m "migration_name"`
- Use docker-compose.dev.yaml for local testing

## Code Style Guidelines
- Follow dependency injection pattern with containers.py defining services and dependencies
- Implement business logic in service layer (services.py), not in endpoints
- Implement database access in repository layer (repositories.py)
- Use Pydantic models in schemas.py for API request/response validation
- Handle errors with appropriate HTTP status codes and messages
- Update dependency injection container when service dependencies change
- Follow SQLAlchemy patterns for database operations
- Use Python type hints consistently
- Handle file operations through the FileHandlerMixin for S3/Minio storage
- When modifying functionality, apply changes to all methods that function identically
- Utilize existing implementations as much as possible; create new ones if none exist