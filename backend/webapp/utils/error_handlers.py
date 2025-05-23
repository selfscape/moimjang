import logging
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError


def handle_integrity_error(
    e: IntegrityError,
    duplicate_msg: str = "중복된 항목이 존재합니다.",
    foreign_key_msg: str = "참조하는 항목을 찾을 수 없습니다.",
):
    """
    IntegrityError를 처리하여 HTTPException을 발생시키는 공통 핸들러

    psycopg2를 사용하는 경우, e.orig.pgcode를 활용하여 에러를 구분할 수 있습니다.
    - '23505': duplicate key violation
    - '23503': foreign key violation

    만약 pgcode를 통한 구분이 어렵다면 문자열 매칭으로 처리하고, 그 외의 경우
    Internal Server Error를 발생시킵니다.
    """
    original = getattr(e, "orig", None)
    if original is not None and hasattr(original, "pgcode"):
        pgcode = original.pgcode
        if pgcode == "23505":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=duplicate_msg
            )
        elif pgcode == "23503":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=foreign_key_msg
            )

    # pgcode 제공이 되지 않는 경우 문자열 매칭 (드라이버에 따라 다를 수 있음)
    error_message = str(e)
    if "duplicate key value violates unique constraint" in error_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=duplicate_msg
        )
    elif "violates foreign key constraint" in error_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=foreign_key_msg
        )

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Internal Server Error",
    )
