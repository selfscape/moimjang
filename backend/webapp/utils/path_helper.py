from enum import Enum


class PathHelper:
    @staticmethod
    def generate_brand_thumbnail_path(
        brand_id: int, image_id: str, original_filename: str
    ) -> str:
        """
        브랜드 썸네일 이미지 경로 생성.
        예: "brands/thumbnail/{brand_id}/{image_id}_{original_filename}"
        """
        return f"brands/thumbnail/{brand_id}/{image_id}_{original_filename}"

    @staticmethod
    def generate_question_card_category_cover_image_path(
        category_id: int, image_id: int, original_filename: str
    ) -> str:
        """
        질문카드 카테고리 커버 이미지 경로 생성.
        예: "question_card_categories/cover/{category_id}/{image_id}_{original_filename}"
        """
        from loguru import logger

        logger.info(
            f"generate_question_card_category_cover_image_path: {category_id}, {image_id}, {original_filename}"
        )
        return f"question_card_categories/cover/{category_id}/{image_id}_{original_filename}"

    @staticmethod
    def generate_question_card_image_path(
        card_id: int, image_id: int, original_filename: str
    ) -> str:
        """
        질문카드 이미지 경로 생성.
        예: "question_cards/image/{card_id}/{image_id}_{original_filename}"
        """
        return f"question_cards/image/{card_id}/{image_id}_{original_filename}"

    @staticmethod
    def generate_survey_form_image_path(image_id: str, original_filename: str) -> str:
        """
        설문 양식 이미지 경로 생성.
        예: "landing/survey/form/{image_id}_{original_filename}"
        """
        return f"landing/survey/form/{image_id}_{original_filename}"

    @staticmethod
    def generate_brand_review_image_path(image_id: str, original_filename: str) -> str:
        """
        후기 이미지 경로 생성.
        예: "brand_reviews/image/{image_id}_{original_filename}"
        """
        return f"brand_reviews/image/{image_id}_{original_filename}"

    @staticmethod
    def generate_brand_detail_image_path(
        brand_id: int, image_id: int, original_filename: str
    ) -> str:
        """
        브랜드 상세 이미지 경로 생성.
        예: "brands/detail/{brand_id}/{image_id}_{original_filename}"
        """
        return f"brands/detail/{brand_id}/{image_id}_{original_filename}"

    @staticmethod
    def generate_landing_main_image_path(landing_id: int, image_id: str, original_filename: str) -> str:
        """
        랜딩 페이지 메인 이미지 경로 생성.
        예: "landing/main/{image_id}_{original_filename}"
        """
        return f"landing/main/{image_id}_{original_filename}"

    @staticmethod
    def generate_landing_gallery_image_path(gallery_id: int, image_id: str, original_filename: str) -> str:
        """
        랜딩 페이지 갤러리 이미지 경로 생성.
        예: "landing/gallery/{image_id}_{original_filename}"
        """
        return f"landing/gallery/{image_id}_{original_filename}"