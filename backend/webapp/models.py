"""Models module."""

from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
    Text,
    ARRAY,
    Boolean,
    JSON,
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base
from .enums import (
    ChannelComponent,
    SurveyRegistState,
    BrandState,
    ChannelState
)
from sqlalchemy.dialects.postgresql import ENUM, JSONB

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String, default="user", nullable=False)
    gender = Column(String(10))
    birth_year = Column(Integer)
    mbti = Column(String(10))
    keywords = Column(Text)
    favorite_media = Column(Text)
    tmi = Column(Text)
    hobby = Column(String(255))  # 취미 (예: "축구")
    strength = Column(String(255))  # 매력 및 장점 (예: "공강을 잘해줘요")
    happyMoment = Column(
        String(255)
    )  # 최근 가장 기분 좋았던 일 (예: "가족과 함께 맛있는 저녁을 먹었어요")
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    owner_id = Column(Integer, nullable=True)

class Channel(Base):
    __tablename__ = "channels"

    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    event_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    visible_components = Column(ARRAY(ENUM(ChannelComponent)), nullable=False)
    channel_state = Column(String, default=ChannelState.PENDING.value, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])
    

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    group_name = Column(String(50))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    matched_user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewer_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_reviewer_anonymous = Column(Boolean, default=False, nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    style = Column(Text)
    impression = Column(Text)
    conversation = Column(Text)
    additional_info = Column(Text)
    keywords = Column(Text)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class ChannelUser(Base):
    __tablename__ = "channel_users"

    # TODO 로우 특정 시 순환매칭을 대체하기 위해 unique 키 추가 필요
    channel_id = Column(
        Integer, ForeignKey("channels.id", ondelete="CASCADE"), primary_key=True
    )
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)


class GroupUser(Base):
    __tablename__ = "group_users"

    # TODO 로우 특정 시 순환매칭을 대체하기 위해 unique 키 추가 필요
    group_id = Column(
        Integer, ForeignKey("groups.id", ondelete="CASCADE"), primary_key=True
    )
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    bucket = Column(String, nullable=False)
    path = Column(String, nullable=False)

    brand_review_id = Column(Integer, ForeignKey("brand_reviews.id"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True)
    thumbnail_image_id = Column(Integer, ForeignKey("images.id", ondelete="SET NULL"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    brand_state = Column(String, default=BrandState.ONGOING.value, nullable=False)
    thumbnail_image = relationship(
        "Image",
        uselist=False,
        foreign_keys=[thumbnail_image_id],
        cascade="all, delete",
    )
    min_participants = Column(Integer, nullable=False)  # 최소 인원
    max_participants = Column(Integer, nullable=False)  # 최대 인원
    meeting_location = Column(String(255), nullable=False)  # 모임 장소
    location_link = Column(Text, nullable=True)  # 장소 링크(URL)
    detail_images = relationship(
        "Image",
        foreign_keys="[Image.brand_id]",
        cascade="all, delete-orphan",
        backref="brand",
    )
    socialing_duration = Column(Integer, nullable=False)  # 소셜링 진행 시간
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class QuestionCardCategory(Base):
    __tablename__ = "question_card_categories"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    cover_image_id = Column(Integer, ForeignKey("images.id", ondelete="SET NULL"), nullable=True)
    isDeckVisible = Column(Boolean, default=True)
    
    cover_image = relationship("Image", uselist=False, cascade="all, delete")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class QuestionCard(Base):
    __tablename__ = "question_cards"
    id = Column(Integer, primary_key=True)
    cardCategoryId = Column(Integer, ForeignKey("question_card_categories.id"), nullable=False)
    name = Column(String, nullable=False)
    image_id = Column(Integer, ForeignKey("images.id", ondelete="SET NULL"), nullable=True)
    isCardVisible = Column(Boolean, default=True)
    
    image = relationship("Image", uselist=False, cascade="all, delete")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class BrandQuestionCardCategory(Base):
    __tablename__ = "brand_question_card_categories"
    brandId = Column(Integer, ForeignKey("brands.id"), primary_key=True)
    questionCardCategoryId = Column(
        Integer, ForeignKey("question_card_categories.id"), primary_key=True
    )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class Survey(Base):
    """
    설문 테이블: 각 설문은 특정 브랜드에 연결되며, 다수의 질문(survey_questions)과 응답(survey_responses)을 가집니다.
    """
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )
    is_active = Column(Boolean, default=True)

    # 관계: 브랜드, 질문, 응답
    questions = relationship(
        "SurveyQuestion", back_populates="survey", cascade="all, delete-orphan"
    )
    responses = relationship(
        "SurveyResponse", back_populates="survey", cascade="all, delete-orphan"
    )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class SurveyQuestion(Base):
    """
    설문 질문 테이블: 각 질문은 설문(surveys)에 속하며, 유형(type), 추가 설정(config) 및 옵션(options) 정보를 포함합니다.
    JSONB 필드를 활용하여 config와 options 정보를 저장합니다.
    """
    __tablename__ = "survey_questions"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    order = Column(Integer, nullable=False)
    type = Column(String, nullable=False)  # PLAINTEXT, SELECT, DROPDOWN, IMAGE, AGREEMENT 등
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    config = Column(JSON, nullable=True)   # 예: { "numericOnly": true } 또는 { "multiSelect": false }
    options = Column(ARRAY(String), nullable=True)    # 변경: List[str] 형태의 선택지 목록 저장.
    is_required = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )

    # 관계: 설문, 응답 답변
    survey = relationship("Survey", back_populates="questions")
    answers = relationship(
        "ResponseAnswer", back_populates="question", cascade="all, delete-orphan"
    )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class SurveyResponse(Base):
    """
    설문 응답 테이블: 사용자가 응답한 설문 정보를 저장합니다.
    사용자는 로그인 상태가 아닐 수도 있으므로 user_id는 nullable입니다.
    regist_state는 초기값 "PENDING"이며, 이후 관리자가 상태를 변경할 수 있습니다.
    """
    __tablename__ = "survey_responses"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    submitted_at = Column(DateTime, default=datetime.now(timezone.utc))
    regist_state = Column(String, default=SurveyRegistState.PENDING.value, nullable=False)  # Enum 문자열 사용
    updated_at = Column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )

    # 관계: 설문, 사용자, 개별 답변
    survey = relationship("Survey", back_populates="responses")
    user = relationship("User", foreign_keys=[user_id])
    answers = relationship(
        "ResponseAnswer", back_populates="survey_response", cascade="all, delete-orphan"
    )
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class ResponseAnswer(Base):
    """
    개별 답변 테이블: 하나의 설문 응답에 해당하는 각 질문의 답변을 저장합니다.
    질문 유형에 따라 answer_value 안에는 텍스트, 선택 옵션, 이미지 URL, 동의여부 등의 값이 저장됩니다.
    """
    __tablename__ = "response_answers"

    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey("survey_responses.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("survey_questions.id"), nullable=False)
    answer_value = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    # 관계: 설문 응답, 설문 질문
    survey_response = relationship("SurveyResponse", back_populates="answers")
    question = relationship("SurveyQuestion", back_populates="answers")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class BrandReview(Base):
    __tablename__ = "brand_reviews"  # 테이블 이름은 기존 리뷰와 혼동되지 않도록 별도로 지정

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    contents = Column(Text, nullable=False, default="")  # 초기 생성 시 빈 문자열로 설정
    is_display = Column(Boolean, nullable=False, default=True)  # 관리자가 노출 여부 설정
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    images = relationship("Image", backref="brand_review", cascade="all, delete-orphan", foreign_keys=[Image.brand_review_id])
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])

# Add to models.py
class LandingPageSetting(Base):
    """
    랜딩 페이지 설정을 키-값 형태로 저장하는 테이블 모델.
    메인 이미지 ID, 갤러리 이미지 ID 목록 등을 저장합니다.
    """
    __tablename__ = "landing_page_settings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    setting_key = Column(String(255), index=True, 
                        comment="설정 키 (예: main_image_id, gallery_image_ids)")
    # PostgreSQL의 JSONB 타입을 사용하여 다양한 유형의 값 저장
    setting_value = Column(JSONB, nullable=True, 
                          comment="설정 값 (메인 이미지 ID는 숫자, 갤러리 ID 목록은 JSON 배열)")
    # 설정 생성/수정 시간 추적
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", foreign_keys=[owner_id])


class HostRegist(Base):
    """
    호스트 등록 신청 및 관리를 위한 테이블 모델.
    사용자가 관리자 권한 신청 시 해당 정보를 저장합니다.
    """
    __tablename__ = "host_regists"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    state = Column(String, default="PENDING", nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    
    # 관계: 사용자 정보 참조
    user = relationship("User", backref="host_regists")
