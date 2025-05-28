FastAPI + SQLAlchemy + Dependency Injector Example
==================================================

This is a `FastAPI <https://fastapi.tiangolo.com/>`_ +
`SQLAlchemy <https://www.sqlalchemy.org/>`_ +
`Dependency Injector <https://python-dependency-injector.ets-labs.org/>`_ example application.

Thanks to `@ShvetsovYura <https://github.com/ShvetsovYura>`_ for providing initial example:
`FastAPI_DI_SqlAlchemy <https://github.com/ShvetsovYura/FastAPI_DI_SqlAlchemy>`_.

로컬 개발 환경 설정 (pyenv)
------------------------

pyenv를 사용한 로컬 개발 환경 설정 방법입니다.

1. pyenv 및 Python 설치:

.. code-block:: bash

   # pyenv 설치 (MacOS 예시)
   brew install pyenv
   
   # Python 설치
   pyenv install 3.11
   
   # 프로젝트 디렉토리에서 Python 버전 설정
   pyenv local 3.11

2. 가상 환경 생성 및 패키지 설치:

.. code-block:: bash

   # 가상 환경 생성
   pyenv virtualenv 3.11 moimjang-server
   
   # 가상 환경 활성화
   pyenv activate moimjang-server
   
   # 패키지 설치
   pip install -r requirements.txt

3. 데이터베이스 실행:

로컬 PostgreSQL을 사용하거나 도커로 PostgreSQL만 실행할 수 있습니다.

.. code-block:: bash

   # Docker를 사용하여 PostgreSQL만 실행
   docker-compose -f docker-compose-db.yml up -d

4. 환경 변수 설정:

홈디렉토리의 config.yml 파일을 수정하여 로컬 개발 환경에 맞게 설정합니다.

5. 데이터베이스 마이그레이션 및 애플리케이션 실행:

.. code-block:: bash

   # 실행 스크립트를 사용하여 마이그레이션 및 애플리케이션 실행
   chmod +x run_local.sh
   ./run_local.sh
   
   # 또는 개별적으로 실행
   alembic -c alembic.local.ini upgrade head
   uvicorn webapp.application:app --host 0.0.0.0 --port 8001 --reload

운영 환경 배포
-----------

운영 환경은 Docker 컨테이너를 사용합니다.

.. code-block:: bash

   # 운영 환경 배포
   docker-compose build
   docker-compose up -d

API 문서
-------

애플리케이션이 실행된 후 http://127.0.0.1:8000/docs 에서 API 문서를 확인할 수 있습니다.

테스트
----

단위 테스트를 실행하려면:

로컬 환경에서:

.. code-block:: bash

   # 환경 변수 설정
   export $(cat .env.local | xargs)
   
   # 테스트 실행
   pytest webapp/tests.py --cov=webapp

Docker 환경에서:

.. code-block:: bash

   docker-compose run --rm webapp py.test webapp/tests.py --cov=webapp


Migrations
----------

설정파일은 홈디렉토리에 있는 alembic.ini 파일에서 관리합니다.
새로운 마이그레이션을 생성하려면:

로컬 환경에서:

.. code-block:: bash

   # 환경 변수 설정
   export $(cat .env.local | xargs)
   
   # 마이그레이션 생성
   alembic -c alembic.local.ini revision --autogenerate -m "migration_name"

Docker 환경에서:

.. code-block:: bash

   docker-compose run --rm webapp alembic revision --autogenerate -m "migration_name"


MongoDB 마이그레이션
------------------

이 프로젝트는 MongoDB 마이그레이션을 위해 `migrate-mongo`를 사용합니다.

1. migrate-mongo 설치:

.. code-block:: bash

   # 전역으로 migrate-mongo 설치
   npm install -g migrate-mongo

2. 마이그레이션 파일 생성:

.. code-block:: bash

   # 프로젝트 경로로 이동
   cd migrations
   mkdir <<migration_folder_name>>

   # 새 마이그레이션 파일 생성
   migrate-mongo create 마이그레이션_이름

   # 예시
   migrate-mongo create add_owner_field

3. 마이그레이션 실행:

.. code-block:: bash

   # 모든 마이그레이션 적용
   migrate-mongo up
   
   # 상태 확인
   migrate-mongo status

4. 마이그레이션 롤백:

.. code-block:: bash

   # 가장 최근 마이그레이션 롤백
   migrate-mongo down

5. 마이그레이션 파일 구조:

마이그레이션 설정파일은 `migrations/migrate-mongo-config.js` 파일에서 관리됩니다.
마이그레이션 파일은 `versions_mongo` 디렉토리에 저장되며 다음과 같은 구조를 가집니다:

.. code-block:: javascript

   module.exports = {
     async up(db) {
       // 마이그레이션 적용 로직
       // 예: await db.collection('users').updateMany({}, { $set: { newField: 'defaultValue' } });
     },
     
     async down(db) {
       // 롤백 로직
       // 예: await db.collection('users').updateMany({}, { $unset: { newField: '' } });
     }
   };

6. 설정 파일:

마이그레이션 설정은 `migrations/migrate-mongo-config.js` 파일에서 관리됩니다. 
환경에 맞게 MongoDB 연결 정보를 수정하세요.
