"""Application module."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .containers import Container
from .endpoints import (
    brand_review_router,
    auth_router,
    customers_router,
    user_router,
    channel_router,
    group_router,
    game_router,
    review_router,
    brand_router,
    question_card_category_router,
    question_card_router,
    landing_page_router,
    landing_admin_router,
    survey_doc_router,
    survey_response_doc_router,
    host_regist_router,
    host_regist_admin_router
)
from .utils.logger_config import configure_logger
from loguru import logger

def create_app() -> FastAPI:
    container = Container()
    container.init_resources()

    configure_logger()

    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


    app.container = container  # type: ignore
    app.include_router(auth_router)
    app.include_router(customers_router)
    app.include_router(user_router)
    app.include_router(channel_router)
    app.include_router(group_router)
    app.include_router(game_router)
    app.include_router(review_router)
    app.include_router(brand_router)
    app.include_router(question_card_category_router)
    app.include_router(question_card_router)
    app.include_router(landing_page_router)
    app.include_router(landing_admin_router)
    app.include_router(survey_doc_router)
    app.include_router(survey_response_doc_router)
    app.include_router(host_regist_router)
    app.include_router(host_regist_admin_router)
    app.include_router(brand_review_router)


    @app.get("/status")
    def get_status():
        return {"status": "OK"}

    return app


app = create_app()
