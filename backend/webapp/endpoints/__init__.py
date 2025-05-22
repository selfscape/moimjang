"""Endpoints package."""
from .endpoints_total import (
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
    survey_doc_router,
    survey_response_doc_router,
    host_regist_router,
    host_regist_admin_router
)

from .brand_reviews import brand_review_router
from .landing_admin import landing_admin_router
