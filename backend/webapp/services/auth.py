from fastapi import HTTPException, status
from datetime import timedelta
from typing import Optional

from ..repositories import UserRepository
from ..schemas import UserRequest, UserResponse, AuthResponse
from ..core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)
from .common import UserServiceMixin


class AuthService(UserServiceMixin):
    def __init__(
        self,
        user_repository: UserRepository,
        secret_key: str,
        algorithm: str,
        token_expire_minutes: int,
    ) -> None:
        self._user_repository = user_repository
        self._secret_key = secret_key
        self._algorithm = algorithm
        self._token_expire_minutes = token_expire_minutes

    def signup(self, user_req: UserRequest, owner_id: Optional[int]) -> UserResponse:  # type: ignore
        existing_user = self._user_repository.get_by_email(user_req.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="해당 이메일로 가입된 사용자가 이미 존재합니다.",
            )        

        hashed_pw = get_password_hash(user_req.password)
        req_dict = user_req.model_dump()
        req_dict.update({"hashed_password": hashed_pw})
        req_dict.pop("password", None)

        req_dict.update({"owner_id": owner_id})

        new_user = self._user_repository.add(req_dict)
        return new_user

    def login(self, username: str, password: str) -> AuthResponse:
        user = self._user_repository.get_by_email(username)
        if not user or not verify_password(password, user.hashed_password):  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="이메일 또는 비밀번호가 올바르지 않습니다.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role},
            secret_key=self._secret_key,
            algorithm=self._algorithm,
            expires_delta=timedelta(minutes=self._token_expire_minutes),
        )
        user_response = UserResponse.model_validate(user.__dict__)
        return AuthResponse(
            access_token=access_token, token_type="bearer", user=user_response
        )

    def get_current_user(self, token: str):
        payload = decode_access_token(token, self._secret_key, self._algorithm)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 토큰입니다.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="토큰 정보에 이메일이 없습니다.",
            )
        user = self._user_repository.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="해당 유저가 존재하지 않습니다.",
            )
        return user

    def require_admin(self, user):
        # superAdmin도 admin 권한을 포함하도록 허용
        if user.role not in ("admin", "superAdmin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="관리자 권한이 없습니다."
            )
        return user

    def require_super_admin(self, user):
        if user.role != "superAdmin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="슈퍼 관리자 권한이 없습니다."
            )
        return user
