from fastapi import APIRouter, Depends, File, UploadFile, status, Query
from fastapi.responses import Response
from typing import List, Optional

from ..services import LandingPageService
from ..schemas import ImageResponse
from .endpoints_total import (
    get_landing_service, 
    current_user_dependency,     
)
from .common import (
    get_owner_id,
    admin_dependency
)

# ----------------------------------
# Landing 페이지용 설정 관리
#    GET /landingAdmin/settings
#    → Admin 라우터의 GET LandingPageSettingList와 동일
# ----------------------------------


landing_admin_router = APIRouter(
    prefix="/landingAdmin", 
    tags=["landingAdmin"],
    dependencies=[Depends(admin_dependency)]  # 관리자 권한 검사
)

########################################################
# LandingPage ADMIN
########################################################
@landing_admin_router.put("/uploadImage/main", response_model=ImageResponse)
def upload_main_image(
    file: UploadFile = File(...),
    owner_id: int = Depends(get_owner_id),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """랜딩 페이지 메인 이미지를 업로드하고 설정합니다."""
    return landing_service.set_main_image(file, owner_id)

@landing_admin_router.delete("/deleteImage/main", status_code=status.HTTP_204_NO_CONTENT)
def delete_main_image(
    owner_id: int = Depends(get_owner_id),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """랜딩 페이지 메인 이미지를 삭제합니다."""
    landing_service.delete_main_image(owner_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@landing_admin_router.post("/uploadImage/gallery", response_model=ImageResponse)
def upload_gallery_image(
    file: UploadFile = File(...),
    current_user = Depends(current_user_dependency),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """랜딩 페이지 갤러리에 이미지를 추가합니다."""
    return landing_service.add_gallery_image(file, current_user.id)
@landing_admin_router.delete("/deleteImage/gallery", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_image(
    image_id: int = Query(..., description="삭제할 이미지 ID"),
    owner_id: int = Depends(get_owner_id),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """랜딩 페이지 갤러리에서 이미지를 삭제합니다."""
    landing_service.delete_gallery_image(image_id, owner_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@landing_admin_router.get("/mainImage", response_model=Optional[ImageResponse])
def admin_get_main_image(
    owner_id: int = Depends(get_owner_id),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """현재 설정된 랜딩 페이지 메인 이미지를 조회합니다. (관리자용)"""
    return landing_service.get_main_image(owner_id)

@landing_admin_router.get("/galleryImages", response_model=List[ImageResponse])
def admin_get_gallery_images(
    owner_id: int = Depends(get_owner_id),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """현재 설정된 랜딩 페이지 갤러리 이미지 목록을 조회합니다. (관리자용)"""
    return landing_service.get_gallery_images(owner_id)
