import base64
import os
import re
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend
from loguru import logger

class RSACrypto:
    EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")

    def __init__(self, private_key_path, public_key_path, log_owner_email=False):
        self.private_key_path = private_key_path
        self.public_key_path = public_key_path
        self.log_owner_email = log_owner_email
        try:
            self.private_key = self._load_private_key()
            self.public_key = self._load_public_key()
        except FileNotFoundError as e:
            logger.error(f"[RSACrypto] 키 파일이 존재하지 않습니다: {e.filename}")
            raise

    def _load_private_key(self):
        with open(self.private_key_path, "rb") as key_file:
            return serialization.load_pem_private_key(
                key_file.read(),
                password=None,
                backend=default_backend()
            )

    def _load_public_key(self):
        with open(self.public_key_path, "rb") as key_file:
            return serialization.load_pem_public_key(
                key_file.read(),
                backend=default_backend()
            )

    def encrypt_email(self, email: str) -> str:
        if not self.EMAIL_REGEX.match(email):
            raise ValueError("이메일 형식이 올바르지 않습니다.")
        encrypted = self.public_key.encrypt( # type: ignore
            email.encode("utf-8"),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return base64.urlsafe_b64encode(encrypted).decode("utf-8")

    def decrypt_email(self, encrypted_email: str) -> str:
        try:
            # base64 패딩 복원
            missing_padding = len(encrypted_email) % 4
            if missing_padding:
                encrypted_email += '=' * (4 - missing_padding)
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_email)
            decrypted = self.private_key.decrypt( # type: ignore
                encrypted_bytes,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )
            email = decrypted.decode("utf-8")
            if not self.EMAIL_REGEX.match(email):
                raise ValueError("복호화된 값이 이메일 형식이 아닙니다.")
            if self.log_owner_email:
                print(f"[RSACrypto] 복호화된 이메일: {email}")
            return email
        except Exception as e:
            raise ValueError("이메일 복호화 실패: " + str(e)) 