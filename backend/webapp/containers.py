"""Containers module."""

import os
from minio import Minio
from dependency_injector import containers, providers
from loguru import logger

from .database import Database
from .repositories import (
    UserRepository,
    ChannelRepository,
    GroupRepository,
    GameRepository,
    ReviewRepository,
    ChannelUserRepository,
    GroupUserRepository,
    MinioRepository,
    BrandRepository,
    QuestionCardCategoryRepository,
    QuestionCardRepository,
    BrandQuestionCardCategoryRepository,
    SurveyRepository,
    ImageRepository,
    BrandReviewRepository,
    LandingPageSettingRepository,
    DocumentRepository,
    HostRegistRepository,
)
from .services import (
    UserService,
    ChannelService,
    GroupService,
    GameService,
    ReviewService,
    ChannelUserService,
    GroupUserService,
    AuthService,
    BrandService,
    QuestionCardCategoryService,
    QuestionCardService,
    BrandQuestionCardCategoryService,
    SurveyService,
    SurveyFormService,
    BrandReviewService,
    LandingPageService,
    SurveyDocumentService,
    SurveyResponseDocumentService,
    HostRegistService,
)
from .resources import init_mongodb_db, test_database_connection
from .services.owner import OwnerService

def init_minio_client(
    endpoint: str, access_key: str, secret_key: str, secure: bool
) -> Minio:
    return Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=secure)


class Container(containers.DeclarativeContainer):

    wiring_config = containers.WiringConfiguration(modules=[
        ".endpoints", 
        ".endpoints.endpoints_total",
        ".endpoints.brand_reviews",
        ".endpoints.landing_admin",
        ".endpoints.common"
    ])

    config = providers.Configuration()
    
    # 환경 변수에서 설정 파일 경로를 가져옴
    config_path = os.environ.get('CONFIG_PATH', 'config_local.yml')
    config.from_yaml(config_path)

    # PostgreSQL 연결 테스트를 리소스로 관리
    db_connection_test = providers.Resource(
        test_database_connection,
        db_url=config.db.url,
    )

    db = providers.Singleton(Database, db_url=config.db.url)

    minio_client = providers.Resource(
        init_minio_client,
        endpoint=config.minio.endpoint,
        access_key=config.minio.access_key,
        secret_key=config.minio.secret_key,
        secure=config.minio.secure,
    )

    minio_repository = providers.Singleton(
        MinioRepository,
        minio_client=minio_client,
        bucket_name=config.minio.bucket_name,
        cdn_url=config.minio.cdn_url,
        cdn_opt_rs=config.minio.cdn_opt_rs,
    )

    # MongoDB Resource - 컬렉션 접근자 함수 사용
    mongodb_db = providers.Resource(
        init_mongodb_db,
        mongodb_uri=config.mongodb.uri,
        database=config.mongodb.db_name,
    )
    
    owner_auth_header_name = providers.Callable(
        config.owner_auth.owner_header_name
    )
    owner_auth_protected_paths = providers.Callable(
        config.owner_auth.protected_paths
    )

    user_repository = providers.Factory(
        UserRepository,
        session_factory=db.provided.session,
    )

    auth_service = providers.Factory(
        AuthService,
        user_repository=user_repository,
        secret_key=config.auth.secret_key,
        algorithm=config.auth.algorithm,
        token_expire_minutes=config.auth.token_expire_minutes,
    )

    channel_user_repository = providers.Factory(
        ChannelUserRepository,
        session_factory=db.provided.session,
    )

    group_user_repository = providers.Factory(
        GroupUserRepository,
        session_factory=db.provided.session,
    )

    review_repository = providers.Factory(
        ReviewRepository,
        session_factory=db.provided.session,
    )

    game_repository = providers.Factory(
        GameRepository,
        session_factory=db.provided.session,
    )

    user_service = providers.Factory(
        UserService,
        user_repository=user_repository,
        channel_user_repository=channel_user_repository,
        group_user_repository=group_user_repository,
        review_repository=review_repository,
        game_repository=game_repository,
    )

    channel_repository = providers.Factory(
        ChannelRepository,
        session_factory=db.provided.session,
    )

    group_repository = providers.Factory(
        GroupRepository,
        session_factory=db.provided.session,
    )

    group_user_service = providers.Factory(
        GroupUserService,
        group_user_repository=group_user_repository,
    )

    brand_repository = providers.Factory(
        BrandRepository,
        session_factory=db.provided.session,
    )


    channel_service = providers.Factory(
        ChannelService,
        channel_repository=channel_repository,
        channel_user_repository=channel_user_repository,
        group_repository=group_repository,
        group_user_repository=group_user_repository,
        brand_repository=brand_repository,
        user_repository=user_repository,
    )

    channel_user_service = providers.Factory(
        ChannelUserService,
        channel_user_repository=channel_user_repository,
    )

    group_service = providers.Factory(
        GroupService,
        group_repository=group_repository,
        group_user_repository=group_user_repository,
        game_repository=game_repository,
        user_repository=user_repository,
    )

    game_service = providers.Factory(
        GameService,
        game_repository=game_repository,
        user_repository=user_repository,
        group_repository=group_repository,
    )

    review_service = providers.Factory(
        ReviewService,
        review_repository=review_repository,
        user_repository=user_repository,
    )
    

    question_card_category_repository = providers.Factory(
        QuestionCardCategoryRepository,
        session_factory=db.provided.session,
    )

    brand_question_card_category_repository = providers.Factory(
        BrandQuestionCardCategoryRepository,
        session_factory=db.provided.session,
    )

    question_card_repository = providers.Factory(
        QuestionCardRepository,
        session_factory=db.provided.session,
    )

    image_repository = providers.Factory(
        ImageRepository,
        session_factory=db.provided.session,
        bucket_name=config.minio.bucket_name,
    )

    brand_service = providers.Factory(
        BrandService,
        brand_repository=brand_repository,
        minio_repository=minio_repository,
        brand_qcc_repo=brand_question_card_category_repository,
        channel_repository=channel_repository,
        image_repository=image_repository,
        user_repository=user_repository,
    )

    question_card_category_service = providers.Factory(
        QuestionCardCategoryService,
        category_repository=question_card_category_repository,
        minio_repository=minio_repository,
        question_card_repo=question_card_repository,
        brand_qcc_repo=brand_question_card_category_repository,
        image_repository=image_repository,
        user_repository=user_repository,
    )

    question_card_service = providers.Factory(
        QuestionCardService,
        card_repository=question_card_repository,
        minio_repository=minio_repository,
        image_repository=image_repository,
    )

    brand_question_card_category_service = providers.Factory(
        BrandQuestionCardCategoryService,
        minio_repository=minio_repository,
        brand_qcc_repo=brand_question_card_category_repository,
        brand_repository=brand_repository,
        question_card_category_repo=question_card_category_repository,
        question_card_repo=question_card_repository,        
    )

    survey_repository = providers.Factory(
        SurveyRepository,
        session_factory=db.provided.session,
    )

    survey_service = providers.Factory(
        SurveyService,
        survey_repository=survey_repository,
    )

    survey_form_service = providers.Factory(
        SurveyFormService,
        minio_repository=minio_repository,
    )

    brand_review_repository = providers.Factory(
        BrandReviewRepository,
        session_factory=db.provided.session,
    )
    
    brand_review_service = providers.Factory(
        BrandReviewService,
        review_repository=brand_review_repository,
        minio_repository=minio_repository,
        image_repository=image_repository,
    )

    landing_page_repository = providers.Factory(
        LandingPageSettingRepository,
        session_factory=db.provided.session,
    )

    survey_doc_repo = providers.Factory(
        DocumentRepository,
        get_collection=mongodb_db,
        collection_name="surveys",
    )

    landing_page_service = providers.Factory(
        LandingPageService,
        landing_repository=landing_page_repository,
        minio_repository=minio_repository,
        image_repository=image_repository,
        )

    survey_document_service = providers.Factory(
        SurveyDocumentService,
        survey_repo=survey_doc_repo,
    )

    survey_response_doc_repo = providers.Factory(
        DocumentRepository,
        get_collection=mongodb_db,
        collection_name="survey_responses",
    )

    survey_response_document_service = providers.Factory(
        SurveyResponseDocumentService,
        doc_repo=survey_response_doc_repo,
        survey_repo=survey_doc_repo,
    )

    host_regist_repository = providers.Factory(
        HostRegistRepository,
        session_factory=db.provided.session,
    )
    
    host_regist_service = providers.Factory(
        HostRegistService,
        host_regist_repository=host_regist_repository,
        user_repository=user_repository,
    )
    
    # Owner authentication dependencies
    owner_service = providers.Factory(
        OwnerService,
        user_repository=user_repository,
        host_regist_repository=host_regist_repository,
        header_name=owner_auth_header_name,
    )
