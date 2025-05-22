"""Owner authentication dependencies for FastAPI."""

from typing import Optional
from fastapi import Header, HTTPException
from ..repositories import UserRepository, HostRegistRepository
from ..utils.logger_config import configure_logger
from ..models import User
logger = configure_logger()

class OwnerService:
    """Dependencies for owner authentication in FastAPI."""
    
    def __init__(
        self, 
        user_repository: UserRepository,
        host_regist_repository: HostRegistRepository,
        header_name: str = "owner"
    ):
        self._user_repository = user_repository
        self._host_regist_repository = host_regist_repository
        self._header_name = header_name
    
    def get_owner_id(self, owner: Optional[str]) -> int:
        """
        헤더에서 소유자 username을 가져와 해당 사용자의 ID를 반환합니다.
        사용자가 존재하지 않거나 호스트 등록이 되어있지 않으면 예외를 발생시킵니다.
        
        Args:
            owner: 헤더에서 전달된 소유자 username
            
        Returns:
            소유자의 User.id
            
        Raises:
            HTTPException: 인증 실패 시 발생
        """
        if not owner:
            raise HTTPException(status_code=401, detail="소유자 인증이 필요합니다")
        
        # 호스트 등록 여부 확인
        host_regists = self._host_regist_repository.get_by_user_username(owner)
        if not host_regists:
            logger.error(f"소유자 인증 실패: 사용자 {owner}는 호스트로 등록되어 있지 않습니다")
            raise HTTPException(status_code=401, detail="인증 실패: 호스트로 등록되어 있지 않습니다")
        
        if len(host_regists) != 1:
            logger.error(f"소유자 인증 실패: 사용자 {owner}가 중복되어 있습니다")
            raise HTTPException(status_code=401, detail="인증 실패: 중복되어 있습니다")
        
        host_regist = host_regists[0]
        if host_regist.state != "ACCEPT":
            logger.error(f"소유자 인증 실패: 사용자 {owner}의 호스트 등록이 승인되지 않았습니다")
            raise HTTPException(status_code=401, detail="인증 실패: 호스트 등록이 승인되지 않았습니다")
        
        logger.info(f"소유자 인증 성공: {owner} (ID: {host_regist.user.id})")
        return host_regist.user.id
    
    def get_owner_id_unless_super_admin(self, current_user: User, owner: Optional[str]) -> Optional[int]:
        """
        헤더에서 소유자 username을 가져와 해당 사용자의 ID를 반환합니다.
        사용자가 superAdmin 역할을 가진 경우 호스트 등록 여부를 확인하지 않습니다.
        """
        if current_user.role == "superAdmin": #type: ignore
            return None
        else:
            return self.get_owner_id(owner)
            