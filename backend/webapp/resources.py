"""Resources module for dependency injection."""

from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from typing import Generator, Callable
from loguru import logger

def init_mongodb_db(mongodb_uri: str, database: str) -> Generator[Callable[[str], Collection], None, None]:
    """
    MongoDB 데이터베이스에 접근하고 컬렉션 접근자 함수를 제공하는 리소스 팩토리 함수.
    데이터베이스 사용이 끝나면 클라이언트 연결을 자동으로 종료합니다.
    
    Args:
        mongodb_uri: MongoDB 연결 URI
        database: 데이터베이스 이름
        
    Yields:
        컬렉션 이름을 받아 해당 컬렉션 객체를 반환하는 함수
    """
    # 클라이언트 연결 생성
    logger.info(f"Connecting to MongoDB: {mongodb_uri}, DB: {database}")
    client = MongoClient(mongodb_uri)
    
    try:
        # 연결 테스트
        client.admin.command('ping')
        logger.info("MongoDB connection established")
        
        # 데이터베이스 객체 생성
        db = client[database]
        
        # 컬렉션 접근자 함수 정의
        def get_collection(collection_name: str) -> Collection:
            """컬렉션 이름으로 해당 컬렉션 객체를 반환합니다."""
            return db[collection_name]
        
        # 컬렉션 접근자 함수 제공
        yield get_collection
        
    except Exception as e:
        logger.error(f"Error with MongoDB connection: {e}")
        raise
    finally:
        # 항상 클라이언트 연결 종료
        logger.info("Closing MongoDB connection")
        client.close()
