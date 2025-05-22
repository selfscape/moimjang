import uuid
from fastapi import HTTPException
from typing import Optional, List
from fastapi import UploadFile
from loguru import logger
from ..repositories import UserRepository
from ..utils.image_utils import safe_image
from ..schemas import Image, ImageResponse
from ..models import User as UserModel


class FileHandlerMixin:
    """
    파일 업로드 및 이미지 URL 생성 관련 기능을 제공하는 믹스인 클래스입니다.
    파일 스트림 핸들러 기능을 포함합니다.
    """

    def _resolve_single_presigned_url(
        self, model, path_field: str, url_field: str
    ) -> None:
        file_path = getattr(model, path_field, None)
        if file_path:
            setattr(model, url_field, self._minio_repository.get_img_proxy_url(file_path))  # type: ignore

    def _resolve_list_presigned_urls(
        self, model, path_field: str, url_field: str
    ) -> None:
        file_paths = getattr(model, path_field, None)
        if file_paths:
            setattr(model, url_field, [self._minio_repository.get_img_proxy_url(path) for path in file_paths])  # type: ignore

    def _resolve_url(self, path: Optional[str]) -> str:
        """s3 경로를 이미지 프록시 URL로 변환"""
        return self._minio_repository.get_img_proxy_url(path) if path else ""  # type: ignore
    

    def _transfrom_image_path_to_url(self, image: Image) -> ImageResponse:
        """Image 객체를 ImageResponse 스키마로 변환 (path -> URL)"""
        if image is None:
            return None
        return ImageResponse(
            id=image.id,
            url=self._resolve_url(safe_image(image).path)
        )


    def handle_file_upload(self, file: UploadFile, path_generator_func, id: int) -> str:
        """
        파일 업로드를 처리하고, 업로드된 파일의 경로를 반환합니다.
        :param minio_repo: 파일 업로드용 minio repository
        :param file: 업로드할 파일 (UploadFile)
        :param path_generator_func: 샘플 경로 생성 함수 (예: PathHelper.generate_category_cover_path)
        :param title: 파일 경로 생성을 위한 제목(예: 카테고리 타이틀)
        :return: 업로드된 파일의 경로 (object key)
        """
        image_id = uuid.uuid4().hex
        file_path = path_generator_func(id, image_id, file.filename or "")
        file_data = file.file
        file_data.seek(0, 2)
        file_size = file_data.tell()
        file_data.seek(0)
        content_type = file.content_type
        uploaded_path = self._minio_repository.upload_file(file_data, file_size, content_type, file_path)  # type: ignore
        return uploaded_path

    def upload_and_replace_file(
        self,
        file: UploadFile,
        path_generator_func,
        obj_id: int,
        current_path: Optional[str],
    ) -> str:
        """
        기존의 파일이 존재하면 삭제한 후, 새로운 파일을 업로드합니다.
        """
        if current_path:
            try:
                self._minio_repository.delete_file(current_path)  # type: ignore
            except Exception as e:
                logger.error(f"기존 파일 삭제 실패: {current_path}, {e}")
        return self.handle_file_upload(file, path_generator_func, obj_id)

    def delete_associated_files(self, file_paths: List[str]) -> None:
        """
        객체와 관련된 S3 파일들을 순차적으로 삭제합니다.
        """
        for path in file_paths:
            try:
                self._minio_repository.delete_file(path)  # type: ignore
            except Exception as e:
                logger.error(f"파일 삭제 실패: {path}, {e}")

class UserServiceMixin:
    """
    사용자 서비스 관련 공통 기능을 제공하는 믹스인 클래스입니다.
    """
    def __init__(self) -> None:
        self._user_repository : UserRepository

    def _get_user_id_by_email(self, email: str) -> int:
        """이메일로 사용자 ID를 조회합니다."""
        user = self._user_repository.get_by_email(email)  # type: ignore
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        return user.id  # type: ignore
    
    def _is_super_admin(self, user: UserModel) -> bool:
        return user.role == "superAdmin" # type: ignore
    
    def _is_super_admin_by_email(self, email: str) -> bool:
        user = self._user_repository.get_by_email(email)  # type: ignore
        return self._is_super_admin(user)
