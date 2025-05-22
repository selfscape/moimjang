from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger
from typing import List

class OwnerMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, crypto, header_name: str = "owner", protected_paths: List[str] = []):
        super().__init__(app)
        self.crypto = crypto
        self.header_name = header_name
        self.protected_paths = protected_paths
        logger.info(f"소유자 미들웨어 초기화 (보호 경로: {self.protected_paths})")

    async def dispatch(self, request: Request, call_next):
        if self._is_protected_path(request.url.path):
            owner_header = request.headers.get(self.header_name)
            if owner_header:
                try:
                    decrypted_email = self.crypto.decrypt_email(owner_header)
                    logger.info(f"Decrypted owner email: {decrypted_email}")
                    request.state.owner_email = decrypted_email
                except Exception as e:
                    logger.error(f"Failed to decrypt owner email: {str(e)}")
                    raise HTTPException(status_code=401, detail="Fail to decrypt owner email")
        response = await call_next(request)
        return response

    def _is_protected_path(self, path: str) -> bool:
        return any(path.startswith(protected) for protected in self.protected_paths) 