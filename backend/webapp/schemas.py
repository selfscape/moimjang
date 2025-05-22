# schemas.py
from pydantic import BaseModel, ConfigDict, Field, HttpUrl
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, date
from .enums import ChannelComponent, SurveyRegistState, BrandState, ChannelState, SurveyQuestionType, HostRegistState
from zoneinfo import ZoneInfo


def local_datetime(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo("UTC"))
    # 현지 시간(예: Asia/Seoul)으로 변환하여 ISO 포맷 문자열로 반환
    local_dt = dt.astimezone(ZoneInfo("Asia/Seoul"))
    return local_dt.isoformat()


# --------------------------
# User 관련 스키마
# --------------------------
class UserRequest(BaseModel):
    """Request schema for User creation."""

    username: str
    email: str = Field(default="example@example.com")
    password: str
    gender: Optional[str] = None
    birth_year: Optional[int] = None
    mbti: Optional[str] = None
    keywords: Optional[str] = None
    favorite_media: Optional[str] = None
    tmi: Optional[str] = None
    hobby: Optional[str] = None  # 취미
    strength: Optional[str] = None  # 매력 및 장점
    happyMoment: Optional[str] = None  # 최근 가장 기분 좋았던 일

    model_config = ConfigDict(
        from_attributes=True,
    )


class UserResponse(BaseModel):
    """Response schema for User model."""

    id: int
    username: str
    email: str
    role: str
    gender: Optional[str] = None
    birth_year: Optional[int] = None
    mbti: Optional[str] = None
    keywords: Optional[str] = None
    favorite_media: Optional[str] = None
    tmi: Optional[str] = None
    hobby: Optional[str] = None  # 취미
    strength: Optional[str] = None  # 매력 및 장점
    happyMoment: Optional[str] = None  # 최근 가장 기분 좋았던 일
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: local_datetime,
        },
    )


class UserListResponse(BaseModel):
    users: List[UserResponse]
    totalCount: int

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: local_datetime,
        },
    )


# --------------------------
# Channel 관련 스키마
# --------------------------
# 채널에 참여한 사용자를 위한 스키마
class JoinedUser(BaseModel):
    id: int
    user_name: str
    gender: Optional[str] = None
    birth_year: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# 채널 내 생성된 그룹 정보를 위한 스키마
class GroupInfo(BaseModel):
    id: int
    group_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ChannelRequest(BaseModel):
    title: str
    brand_id: int
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    visible_components: List[ChannelComponent] = Field(
        default_factory=lambda: [
            ChannelComponent.GROUP,
            ChannelComponent.MATCHLOG,
            ChannelComponent.REVIEW_FORM,
            ChannelComponent.REVIEW_LIST,
        ]
    )
    channel_state: ChannelState = Field(default=ChannelState.PENDING)
    model_config = ConfigDict(from_attributes=True)


class ChannelResponse(ChannelRequest):
    id: int
    created_at: datetime
    channel_state: ChannelState = Field(default=ChannelState.PENDING)
    brand_title: str = Field(default="")
    joined_users: List[JoinedUser] = Field(default_factory=list)

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: local_datetime,
        },
    )

class ChannelListResponse(BaseModel):
    channels: List[ChannelResponse]
    totalCount: int
    model_config = ConfigDict(from_attributes=True)

# --------------------------
# Group 관련 스키마
# --------------------------
class GroupRequest(BaseModel):
    channel_id: int
    group_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GroupResponse(BaseModel):
    id: int
    channel_id: int
    group_name: Optional[str] = None
    created_at: datetime
    joined_users: List[JoinedUser] = Field(default_factory=list)

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: local_datetime,
        },
    )


# --------------------------
# Game 관련 스키마
# --------------------------
class GameRequest(BaseModel):
    group_id: int
    user_id: int
    matched_user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class GameResponse(BaseModel):
    id: int
    group_id: int
    user_id: int
    matched_user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: local_datetime,
        },
    )


# --------------------------
# Review 관련 스키마
# --------------------------
class ReviewRequest(BaseModel):
    target_user_id: int
    reviewer_user_id: int
    is_reviewer_anonymous: bool = False
    channel_id: int
    style: Optional[str] = None
    impression: Optional[str] = None
    conversation: Optional[str] = None
    additional_info: Optional[str] = None
    keywords: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: local_datetime,
        },
    )


class ReviewResponse(ReviewRequest):
    id: int
    created_at: datetime
    # 신규 필드: review 요청한(대상) 사용자의 성별과 이름
    reviewer_user_gender: Optional[str] = None
    reviewer_user_name: Optional[str] = None


# --------------------------
# Join 테이블 (채널, 조 참여) 관련 스키마
# 필요 시 간단하게 사용자 ID만 전달할 수 있음
# --------------------------
class ChannelUserRequest(BaseModel):
    user_id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: local_datetime,
        },
    )


# --------------------------
# User Join Group 관련 스키마
# --------------------------
class UserJoinGroupRequest(BaseModel):
    target_group_id: int

    model_config = ConfigDict(from_attributes=True)


class UserJoinGroupResponse(BaseModel):
    group_id: int
    group_name: str
    user_id: int
    user_name: str
    user_gender: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --------------------------
# User Join Channel 관련 스키마
# --------------------------
class UserJoinChannelRequest(BaseModel):
    target_channel_id: int

    model_config = ConfigDict(from_attributes=True)


class UserJoinChannelResponse(BaseModel):
    channel_id: int
    channel_name: str
    user_id: int
    user_name: str
    user_gender: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# 그룹에 가입할 유저 ID 리스트를 받기 위한 요청 스키마
class UsersGroupJoinRequest(BaseModel):
    user_id_list: List[int]
    model_config = ConfigDict(from_attributes=True)


class GamePairsRequest(BaseModel):
    group_id: int
    pointed_users: List[
        List[int]
    ]  # 각 내부 리스트는 [origin_user_id, matched_user_id] 형태입니다.

    model_config = ConfigDict(from_attributes=True)


# 내부 전용 스키마 정의
class ChannelUserLink(UserJoinChannelResponse):
    pass


class GroupUserLink(UserJoinGroupResponse):
    pass


# --------------------------
# Auth 관련 스키마
# --------------------------
class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)


class GameWithUserResponse(BaseModel):
    game: GameResponse
    matched_user: UserResponse

    model_config = ConfigDict(from_attributes=True)


class ImageResponse(BaseModel):
    id: int
    url: str

    model_config = ConfigDict(from_attributes=True)

class Image(BaseModel):
    id: int
    path: str

    model_config = ConfigDict(from_attributes=True)


# 브랜드 관련 스키마
class BrandRequest(BaseModel):
    title: str = Field(description="브랜드 이름", default="")
    description: str = Field(description="브랜드 설명", default="")
    min_participants: int = Field(description="최소 인원", default=2)
    max_participants: int = Field(description="최대 인원", default=10)
    meeting_location: str = Field(description="모임 장소", default="")
    location_link: Optional[str] = Field(description="장소 링크(URL)", default=None)    
    socialing_duration: int = Field(description="소셜링 진행 시간", default=-1)
    brand_state: BrandState = Field(description="브랜드 상태", default=BrandState.ONGOING)
    
class BrandResponse(BrandRequest):
    id: int
    thumbnailImage: Optional[ImageResponse] = Field(description="썸네일 이미지", default=None)
    detailImages: List[ImageResponse] = Field(
        description="상세 이미지 목록", default_factory=list
    )

    model_config = ConfigDict(from_attributes=True)

class BrandListResponse(BaseModel):
    brands: List[BrandResponse]
    totalCount: int
    model_config = ConfigDict(from_attributes=True)

# 질문카드카테고리 관련 스키마
class QuestionCardCategoryRequest(BaseModel):
    name: str
    isDeckVisible: bool = True
    model_config = ConfigDict(from_attributes=True)


class QuestionCardCategoryResponse(QuestionCardCategoryRequest):
    id: int
    coverImage: Optional[ImageResponse] = None

    model_config = ConfigDict(from_attributes=True)


# 질문카드 관련 스키마

class QuestionCardRequest(BaseModel):
    cardCategoryId: int
    name: str
    isCardVisible: bool = True
    model_config = ConfigDict(from_attributes=True)


class QuestionCardResponse(QuestionCardRequest):
    id: int
    image: Optional[ImageResponse] = None

    model_config = ConfigDict(from_attributes=True)


# 브랜드와 질문카드카테고리 연결 (JOIN) 스키마


class BrandQuestionCardCategoryResponse(BaseModel):
    brandId: int
    questionCardCategoryId: int
    model_config = ConfigDict(from_attributes=True)


# 추가 응답 스키마


class QuestionCardCategoryWithBrand(BaseModel):
    brandId: int
    brandTitle: str
    brandThumbnailUrl: str
    cardCategories: List[QuestionCardCategoryResponse]
    model_config = ConfigDict(from_attributes=True)


class QuestionCardDecResponse(QuestionCardCategoryResponse):
    questionCardList: List[QuestionCardResponse]
    model_config = ConfigDict(from_attributes=True)


class BrandWithAllItemsResponse(BrandResponse):
    allocatedQuestionCardDecList: List[QuestionCardDecResponse]
    model_config = ConfigDict(from_attributes=True)

# --- 질문 유형별 설정 스키마 ---
class PlainTextConfig(BaseModel):
    numericOnly: bool = False

class SelectConfig(BaseModel):
    multiSelect: bool = False

class AgreementConfig(BaseModel):
    personalInfoItems: str
    purposeOfUse: str
    retentionPeriod: str


# --- 질문 스키마 ---
class SurveyQuestionResponse(BaseModel):
    id: int
    order: int
    type: SurveyQuestionType  # Enum 타입 직접 사용
    title: str
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None  # 유형별 설정
    options: Optional[List[str]] = None  # 변경: 선택지 목록을 List[str] 형태로 반환
    is_required: bool = True

    model_config = ConfigDict(from_attributes=True)


# --- 설문 양식 조회 응답 스키마 (GET /surveys) ---
class SurveyFormResponse(BaseModel):
    id: int
    brand_id: int
    title: str
    description: Optional[str] = None
    questions: List[SurveyQuestionResponse]

    model_config = ConfigDict(from_attributes=True)


# --- 설문 응답 제출 요청 스키마 (POST /surveys/responses) ---
class SurveyResponseRequest(BaseModel):
    survey_id: int
    channel_id: int
    response: Dict[int, Any]  # { question_id: answer_value } 형태

# --- 설문 응답 상태 변경 요청 스키마 (PUT /surveys/responses/{response_id}) ---
class SurveyResponseUpdateRequest(BaseModel):
    regist_state: Optional[SurveyRegistState] = None
    channel_id: Optional[int] = None

# 설문 수정 요청 스키마
class SurveyUpdateRequest(BaseModel):
    title: str
    description: Optional[str] = None

# 설문 생성 응답 스키마
class SurveyCreateResponse(BaseModel):
    survey_id: int


class BrandReviewCreate(BaseModel):
    user_id: int = Field(..., description="후기 작성자 ID")
    brand_id: int = Field(..., description="후기가 달린 브랜드 ID")
    model_config = ConfigDict(from_attributes=True)


class BrandReviewUpdate(BaseModel):
    contents: Optional[str] = Field(None, description="후기 내용")
    is_display: Optional[bool] = Field(None, description="작성자 ID 표시 여부")
    model_config = ConfigDict(from_attributes=True)

class BrandReviewBase(BaseModel):
    id: int = Field(..., description="후기 고유 ID")
    user_id: int = Field(..., description="후기 작성자 ID")
    brand_id: int = Field(..., description="후기가 달린 브랜드 ID")
    contents: str = Field(..., description="후기 내용")
    is_display: bool = Field(..., description="작성자 ID 표시 여부")    
    created_at: datetime = Field(..., description="생성 일시")
    updated_at: datetime = Field(..., description="수정 일시")
    model_config = ConfigDict(from_attributes=True)

class BrandReviewResponse(BrandReviewBase):
    images: List[Image] = Field(description="후기 이미지 목록(s3 경로)", default_factory=list)    

class BrandReviewUrlResponse(BrandReviewBase):
    imageList: List[ImageResponse] = Field(description="후기 이미지 목록(url)", default_factory=list)

class BrandReviewUrlListResponse(BaseModel):
    reviews: List[BrandReviewUrlResponse] = Field(description="후기 목록", default_factory=list)
    totalCount: int = Field(description="후기 총 개수")
    model_config = ConfigDict(from_attributes=True)

class BrandReviewUploadImageResponse(BaseModel):
    image_id: int = Field(..., description="이미지 고유 ID")
    image_url: str = Field(..., description="이미지 URL")
    model_config = ConfigDict(from_attributes=True)

# ── 신규 Request ──────────────────────────────────────────
class BrandStateRequest(BaseModel):
    brand_state: BrandState

class ChannelStateRequest(BaseModel):
    channel_state: ChannelState

# --- 문서형 Survey/Question 스키마 정의 ---
class SurveyCreateWithQuestionsRequest(BaseModel):
    brand_id: int
    title: str
    description: Optional[str] = None
    questions: List[Dict[str, Any]]  # 비정형 JSON 형태로 수신

    model_config = ConfigDict(from_attributes=True)

class SurveyWithQuestionsResponse(BaseModel):
    id: str = Field(..., alias="_id")
    brand_id: int
    title: str
    description: Optional[str] = None
    created_at: datetime
    questions: List[Dict[str, Any]]

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={ datetime: local_datetime },
    )

# — 응답 내 개별 답변 스키마
class SurveyResponseAnswer(BaseModel):
    questionId: str = Field(..., alias="questionId")
    answerValue: Any = Field(..., alias="answerValue")

    model_config = ConfigDict(from_attributes=True)

# — 응답 생성 요청 스키마
class SurveyResponseCreateRequest(BaseModel):
    channelId: Optional[int] = Field(None, alias="channelId")
    userId: Optional[int] = Field(None, alias="userId")
    answers: List[SurveyResponseAnswer]

    model_config = ConfigDict(from_attributes=True)

# — 응답 조회/목록/단일 응답 스키마
class SurveyResponseResponse(BaseModel):
    id: str = Field(..., alias="_id")
    surveyId: str = Field(..., alias="surveyId")
    channelId: Optional[int]
    userId: Optional[int]
    submittedAt: datetime
    registState: SurveyRegistState
    answers: List[SurveyResponseAnswer]

    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={ datetime: local_datetime },
    )

class SurveyResponseListResponse(BaseModel):
    responses: List[SurveyResponseResponse]
    totalCount: int

    model_config = ConfigDict(from_attributes=True)

# 호스트 등록 관련 스키마
class HostRegistResponse(BaseModel):
    id: int
    user: UserResponse
    state: HostRegistState
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={ datetime: local_datetime },
    )

class HostRegistListResponse(BaseModel):
    regists: List[HostRegistResponse]
    totalCount: int
    
    model_config = ConfigDict(from_attributes=True)

class HostRegistStateRequest(BaseModel):
    state: HostRegistState
    
    model_config = ConfigDict(from_attributes=True)
