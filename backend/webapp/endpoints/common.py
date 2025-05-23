from dependency_injector.wiring import inject, Provide
from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from ..services import AuthService, UserService, OwnerService
from ..containers import Container

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@inject
def get_auth_service(
    auth_service: AuthService = Depends(Provide[Container.auth_service]),
) -> AuthService:
    return auth_service

@inject
def get_user_service(
    user_service: UserService = Depends(Provide[Container.user_service]),
) -> UserService:
    return user_service

@inject
def get_owner_service(
    owner_service: OwnerService = Depends(Provide[Container.owner_service]),
) -> OwnerService:
    return owner_service

def current_user_dependency(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.get_current_user(token)

def admin_dependency(
    current_user=Depends(current_user_dependency),
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.require_admin(current_user)

def super_admin_dependency(
    current_user=Depends(current_user_dependency),
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.require_super_admin(current_user)

def get_owner_id(
    owner_service: OwnerService = Depends(get_owner_service),
    owner: Optional[str] = Header(None, alias="Owner")
) -> int:
    """헤더에서 소유자 username을 가져와 해당 사용자의 ID를 반환합니다."""
    return owner_service.get_owner_id(owner)

def get_owner_id_unless_super_admin(
    owner_service: OwnerService = Depends(get_owner_service),
    current_user=Depends(current_user_dependency),
    owner: Optional[str] = Header(None, alias="Owner")
) -> Optional[int]:
    """헤더에서 소유자 username을 가져와 해당 사용자의 ID를 반환합니다."""
    return owner_service.get_owner_id_unless_super_admin(current_user, owner)

