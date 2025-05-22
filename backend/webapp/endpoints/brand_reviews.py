"""BrandReview RESTful API endpoints."""

from fastapi import APIRouter, Depends, Response, status, HTTPException, Query, Path, UploadFile, File
from dependency_injector.wiring import inject, Provide
from typing import List, Optional

from ..containers import Container
from ..services import BrandReviewService
from ..schemas import (
    BrandReviewUrlResponse,
    BrandReviewCreate,
    BrandReviewUpdate,
    BrandReviewUploadImageResponse,
    BrandReviewUrlListResponse
)
from .common import get_owner_id_unless_super_admin, admin_dependency, current_user_dependency


# 관리자용 브랜드 리뷰 라우터
brand_review_router = APIRouter(
    prefix="/brandReviews",
    tags=["brandReviews"],
    dependencies=[Depends(admin_dependency)]
)

@inject
def get_brand_review_service(
    brand_review_service: BrandReviewService = Depends(Provide[Container.brand_review_service]),
) -> BrandReviewService:
    return brand_review_service

@brand_review_router.get(
    "",
    response_model=BrandReviewUrlListResponse,
    summary="모든 브랜드 리뷰 목록 조회"
)
def get_all_brand_reviews(
    offset: int = Query(0, description="페이지네이션 시작 위치"),
    limit: int = Query(100, description="페이지네이션 크기"),
    sort_by: str = Query("id", description="정렬 기준 필드명"),
    descending: bool = Query(False, description="내림차순 여부"),
    owner_id: int = Depends(get_owner_id_unless_super_admin),
    service: BrandReviewService = Depends(get_brand_review_service)
):
    """
    브랜드 리뷰 목록을 조회합니다.
    
    페이지네이션과 정렬 기능을 지원합니다.
    """
    return service.get_all_reviews(offset=offset, limit=limit, sort_by=sort_by, descending=descending, owner_id=owner_id)

@brand_review_router.get(
    "/{review_id}",
    response_model=BrandReviewUrlResponse,
    summary="브랜드 리뷰 상세 조회"
)
def get_brand_review(
    review_id: int = Path(..., description="조회할 리뷰 ID"),
    service: BrandReviewService = Depends(get_brand_review_service)
):
    """
    특정 브랜드 리뷰의 상세 정보를 조회합니다.
    """
    return service.get_review(review_id)

@brand_review_router.post(
    "",
    response_model=BrandReviewUrlResponse,
    status_code=status.HTTP_201_CREATED,
    summary="브랜드 리뷰 생성"
)
def create_brand_review(
    review: BrandReviewCreate,
    current_user = Depends(current_user_dependency),
    service: BrandReviewService = Depends(get_brand_review_service)
):
    """
    새로운 브랜드 리뷰를 생성합니다.
    """
    return service.create_review(review, current_user.id)

@brand_review_router.put(
    "/{review_id}",
    response_model=BrandReviewUrlResponse,
    summary="브랜드 리뷰 수정"
)
def update_brand_review(
    review: BrandReviewUpdate,
    review_id: int = Path(..., description="수정할 리뷰 ID"),    
    service: BrandReviewService = Depends(get_brand_review_service)
):
    """
    기존 브랜드 리뷰를 수정합니다.
    """
    return service.update_review(review_id, review)

@brand_review_router.delete(
    "/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="브랜드 리뷰 삭제"
)
def delete_brand_review(
    review_id: int = Path(..., description="삭제할 리뷰 ID"),
    service: BrandReviewService = Depends(get_brand_review_service)
):
    """
    브랜드 리뷰를 삭제합니다.
    """
    service.delete_review(review_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@brand_review_router.post(
    "/{review_id}/images",
    response_model=BrandReviewUploadImageResponse,
    summary="브랜드 리뷰 이미지 업로드"
)
def upload_brand_review_image(
    review_id: int = Path(..., description="이미지를 업로드할 리뷰 ID"),
    file: UploadFile = File(..., description="업로드할 이미지 파일"),
    service: BrandReviewService = Depends(get_brand_review_service)
):
    """
    브랜드 리뷰에 이미지를 업로드합니다.
    """
    return service.upload_brand_review_image(review_id, file)

@brand_review_router.delete(
    "/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="브랜드 리뷰 이미지 삭제"
)
def delete_brand_review_image(
    image_id: int = Path(..., description="삭제할 이미지 ID"),
    service: BrandReviewService = Depends(get_brand_review_service)
):
    """
    브랜드 리뷰 이미지를 삭제합니다.
    """
    service.delete_brand_review_image(image_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
