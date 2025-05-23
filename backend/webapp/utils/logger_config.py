import sys
import os
import logging
from loguru import logger

# uvicorn 등 fastAPI 내부 로거의 핸들러를 인터셉트하기 위한 핸들러 클래스
class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = logger.level(record.levelname).name
        except Exception:
            level = record.levelno

        # 호출 스택을 추적하여 적절한 깊이(depth)를 설정합니다.
        frame, depth = logging.currentframe(), 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

def configure_logger():
    # fastAPI 및 uvicorn 내부 로거 핸들러를 인터셉트하여 loguru로 전달되도록 설정합니다.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        logging_logger = logging.getLogger(name)
        logging_logger.handlers = [InterceptHandler()]
        # 기본 핸들러 외에도 propagate 속성을 False로 지정할 수 있습니다.
        logging_logger.propagate = False

    # 로그 파일이 저장될 디렉토리가 없으면 생성합니다.
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # 기존 loguru 핸들러들을 제거합니다.
    logger.remove()

    # 콘솔 출력 핸들러 추가 (로그 시간, 레벨, 메시지를 포함)
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss zz}</green> | <level>{level: <8}</level> | {message}",
        level="DEBUG",
        enqueue=True
    )

    # 파일 출력 핸들러 추가 (로그 파일에 기록, 파일 크기 회전 및 보관 기간 설정)
    logger.add(
        os.path.join(log_dir, "app.log"),
        format="{time:YYYY-MM-DD HH:mm:ss zz} | {level: <8} | {message}",
        level="DEBUG",
        rotation="10 MB",
        retention="10 days",
        enqueue=True
    )

    return logger
