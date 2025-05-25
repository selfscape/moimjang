"""Endpoints module."""

from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
    HTTPException,
    UploadFile,
    File,
    Form,
    Body,
    Query,
    Path,
    Header,
)
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from dependency_injector.wiring import inject, Provide
from typing import Optional, List, Union, Dict

from ..containers import Container
from ..services import (
    UserService,
    ChannelService,
    ChannelUserService,
    GroupService,
    GroupUserService,
    GameService,
    ReviewService,
    AuthService,
    BrandService,
    QuestionCardCategoryService,
    QuestionCardService,
    BrandQuestionCardCategoryService,
    SurveyService,
    SurveyFormService,
    BrandReviewService,
    LandingPageService,
    SurveyDocumentService,
    SurveyResponseDocumentService,
    HostRegistService,
)
from ..schemas import (
    UserResponse,
    UserRequest,
    ChannelResponse,
    ChannelRequest,
    GroupResponse,
    GroupRequest,
    GameResponse,
    GameRequest,
    GamePairsRequest,
    ReviewResponse,
    ReviewRequest,
    UserJoinGroupRequest,
    UserJoinGroupResponse,
    UserJoinChannelRequest,
    UserJoinChannelResponse,
    UsersGroupJoinRequest,
    UserListResponse,
    AuthResponse,
    GameWithUserResponse,
    BrandResponse,
    BrandRequest,
    BrandWithAllItemsResponse,
    QuestionCardCategoryResponse,
    QuestionCardCategoryRequest,
    QuestionCardCategoryWithBrand,
    QuestionCardResponse,
    QuestionCardRequest,
    BrandQuestionCardCategoryResponse,
    SurveyFormResponse,
    SurveyResponseResponse,
    SurveyResponseUpdateRequest,
    SurveyUpdateRequest,
    SurveyCreateResponse,
    BrandReviewUploadImageResponse,
    BrandReviewUrlResponse,
    BrandReviewUrlListResponse,
    BrandReviewCreate,
    BrandReviewUpdate,
    ImageResponse,
    BrandStateRequest,
    ChannelStateRequest,
    SurveyCreateWithQuestionsRequest,
    SurveyWithQuestionsResponse,
    SurveyResponseCreateRequest,
    ChannelListResponse,
    BrandListResponse,
    HostRegistResponse,
    HostRegistListResponse,
    HostRegistStateRequest,
    SurveyResponseListResponse,
)
from ..enums import SurveyRegistState, BrandState, ChannelState
from .common import (
    current_user_dependency,
    admin_dependency,    
    super_admin_dependency,
    get_user_service,
    get_auth_service,
    get_owner_id_required,
    get_owner_id_unless_super_admin,
)
########################################################
# AUTH
########################################################


@inject
def get_landing_service(
    landing_service: LandingPageService = Depends(Provide[Container.landing_page_service])
) -> LandingPageService:
    return landing_service



auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/signup", response_model=UserResponse)
def signup(
    user_req: UserRequest, 
    auth_service: AuthService = Depends(get_auth_service),
    owner_id: Optional[int] = Depends(get_owner_id_required),
):
    return auth_service.signup(user_req, owner_id)


@auth_router.post("/login", response_model=AuthResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.login(form_data.username, form_data.password)


# --------------------------
# User API 엔드포인트
# --------------------------
user_router = APIRouter(
    prefix="/users", tags=["users"], dependencies=[Depends(admin_dependency)]
)

@inject
def get_channel_user_service(
    service: ChannelUserService = Depends(Provide[Container.channel_user_service]),
) -> ChannelUserService:
    return service


@user_router.get("", response_model=UserListResponse)
def get_list(
    sort_by: str = "id",
    descending: bool = False,
    offset: int = 0,
    limit: int = 100,
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
    user_service: UserService = Depends(get_user_service),
    current_user = Depends(current_user_dependency),
) -> UserListResponse:
    users, total_count = user_service.get_all_users_with_count(
        sort_by=sort_by, descending=descending, offset=offset, limit=limit, owner_id=owner_id
    )
    return UserListResponse(users=users, totalCount=total_count)


# 신규 기능 1: 사용자 검색 기능
@user_router.get("/search", response_model=list[UserResponse])
def search_users(
    name: Optional[str] = None,
    email: Optional[str] = None,
    user_service: UserService = Depends(get_user_service),
) -> list[UserResponse]:
    return user_service.search_users(name, email)


# 신규 기능 2: 채널에 가입한 사용자 목록 조회 (user 라우터에서 "/users/channel/{channel_id}" 패스 사용)
@user_router.get("/channel/{channel_id}", response_model=list[UserJoinChannelResponse])
def get_users_by_channel(
    channel_id: int,
    channel_user_service: ChannelUserService = Depends(get_channel_user_service),
) -> list[UserJoinChannelResponse]:
    return channel_user_service.get_users_by_channel(channel_id)


# User API 엔드포인트 섹션에 추가
@user_router.get(
    "/channel/{channel_id}/non_group_users", response_model=List[UserResponse]
)
def get_users_not_in_group(
    channel_id: int, user_service: UserService = Depends(get_user_service)
) -> List[UserResponse]:
    users = user_service.get_users_not_in_group(channel_id)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="조건에 맞는 사용자가 없습니다.",
        )
    return users


@user_router.get("/{user_id}", response_model=UserResponse)
def get_by_id(
    user_id: int, user_service: UserService = Depends(get_user_service)
) -> UserResponse:
    return user_service.get_user(user_id)


@user_router.post("", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def create_user(
    user_request: UserRequest,
    current_user=Depends(current_user_dependency),
    service: UserService = Depends(get_user_service),
) -> UserResponse:
    # 현재 인증된 사용자의 ID를 소유자로 설정
    return service.create_user(user_request.model_dump(), owner_id=current_user.id)


@user_router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_request: UserRequest,
    user_service: UserService = Depends(get_user_service),
) -> Union[UserResponse, None]:
    return user_service.update_user(user_id, user_request.model_dump())


@user_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int, user_service: UserService = Depends(get_user_service)
) -> Response:
    return user_service.delete_user(user_id)


# --------------------------
# GroupUser API 엔드포인트
# --------------------------
@inject
def get_group_user_service(
    service: GroupUserService = Depends(Provide[Container.group_user_service]),
) -> GroupUserService:
    return service


@user_router.get("/{user_id}/groups", response_model=list[UserJoinGroupResponse])
def get_user_groups(
    user_id: int, service: GroupUserService = Depends(get_group_user_service)
):
    groups = service.get_groups_by_user(user_id)
    return groups


@user_router.get("/{user_id}/group/{group_id}", response_model=UserJoinGroupResponse)
def get_user_group(
    user_id: int,
    group_id: int,
    service: GroupUserService = Depends(get_group_user_service),
):
    groups = service.get_groups_by_user(user_id)
    join_record = next((item for item in groups if item["group_id"] == group_id), None)
    if not join_record:
        raise HTTPException(status_code=404, detail="가입 정보가 존재하지 않습니다.")
    return join_record


@user_router.post(
    "/{user_id}/group",
    status_code=status.HTTP_201_CREATED,
    response_model=UserJoinGroupResponse,
)
def add_user_group(
    user_id: int,
    request: UserJoinGroupRequest,
    service: GroupUserService = Depends(get_group_user_service),
):
    service.add_user_to_group(request.target_group_id, user_id)
    groups = service.get_groups_by_user(user_id)
    join_record = next(
        (item for item in groups if item["group_id"] == request.target_group_id), None
    )
    if not join_record:
        raise HTTPException(status_code=500, detail="가입 정보 생성 실패")
    return join_record


@user_router.put("/{user_id}/group/{group_id}", response_model=UserJoinGroupResponse)
def update_user_group(
    user_id: int,
    group_id: int,
    request: UserJoinGroupRequest,
    service: GroupUserService = Depends(get_group_user_service),
):
    service.update_user_group(user_id, group_id, request.target_group_id)
    groups = service.get_groups_by_user(user_id)
    join_record = next(
        (item for item in groups if item["group_id"] == request.target_group_id), None
    )
    if not join_record:
        raise HTTPException(status_code=500, detail="가입 정보 업데이트 실패")
    return join_record


@user_router.delete(
    "/{user_id}/group/{group_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_user_group(
    user_id: int,
    group_id: int,
    service: GroupUserService = Depends(get_group_user_service),
):
    return service.remove_user_from_group(group_id, user_id)


# --------------------------
# ChannelUser API 엔드포인트
# --------------------------
@user_router.get("/{user_id}/channels", response_model=list[UserJoinChannelResponse])
def get_user_channels(
    user_id: int, service: ChannelUserService = Depends(get_channel_user_service)
):
    channels = service.get_channels_by_user(user_id)
    return channels


@user_router.get(
    "/{user_id}/channel/{channel_id}", response_model=UserJoinChannelResponse
)
def get_user_channel(
    user_id: int,
    channel_id: int,
    service: ChannelUserService = Depends(get_channel_user_service),
):
    channels = service.get_channels_by_user(user_id)
    join_record = next(
        (item for item in channels if item.channel_id == channel_id), None
    )
    if not join_record:
        raise HTTPException(status_code=404, detail="가입 정보가 존재하지 않습니다.")
    return join_record


@user_router.post(
    "/{user_id}/channel",
    status_code=status.HTTP_201_CREATED,
    response_model=UserJoinChannelResponse,
)
def add_user_channel(
    user_id: int,
    request: UserJoinChannelRequest,
    service: ChannelUserService = Depends(get_channel_user_service),
) -> UserJoinChannelResponse:
    service.add_user_to_channel(request.target_channel_id, user_id)
    channels = service.get_channels_by_user(user_id)
    join_record = next(
        (item for item in channels if item.channel_id == request.target_channel_id),
        None,
    )
    if not join_record:
        raise HTTPException(status_code=500, detail="가입 정보 생성 실패")
    return join_record


@user_router.put(
    "/{user_id}/channel/{channel_id}", response_model=UserJoinChannelResponse
)
def update_user_channel(
    user_id: int,
    channel_id: int,
    request: UserJoinChannelRequest,
    service: ChannelUserService = Depends(get_channel_user_service),
) -> UserJoinChannelResponse:
    service.update_user_channel(user_id, channel_id, request.target_channel_id)
    channels = service.get_channels_by_user(user_id)
    join_record = next(
        (item for item in channels if item.channel_id == request.target_channel_id),
        None,
    )
    if not join_record:
        raise HTTPException(status_code=500, detail="가입 정보 업데이트 실패")
    return join_record


@user_router.delete(
    "/{user_id}/channel/{channel_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_user_channel(
    user_id: int,
    channel_id: int,
    service: ChannelUserService = Depends(get_channel_user_service),
):
    return service.remove_user_from_channel(channel_id, user_id)


# --------------------------
# Channel API 엔드포인트
# --------------------------
channel_router = APIRouter(
    prefix="/channels", tags=["channels"], dependencies=[Depends(admin_dependency)]
)


@inject
def get_channel_service(
    channel_service: ChannelService = Depends(Provide[Container.channel_service]),
) -> ChannelService:
    return channel_service


@channel_router.get("", response_model=ChannelListResponse)
def get_channels(
    state: Optional[ChannelState] = Query(None),
    sort_by: str = Query("id"),
    descending: bool = Query(False),
    brand_id: Optional[int] = Query(None),
    offset: int = Query(0, description="페이지네이션 시작 위치"),
    limit: int = Query(100, description="페이지네이션 크기"),
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
    service: ChannelService = Depends(get_channel_service),
) -> ChannelListResponse:
    return service.get_channels(
        sort_by=sort_by,
        descending=descending,
        brand_id=brand_id,
        state=state,
        offset=offset,
        limit=limit,
        owner_id=owner_id)


@channel_router.get("/{channel_id}", response_model=ChannelResponse)
def get_channel(
    channel_id: int, service: ChannelService = Depends(get_channel_service)
) -> ChannelResponse:
    return service.get_channel(channel_id)


@channel_router.post(
    "", status_code=status.HTTP_201_CREATED, response_model=ChannelResponse
)
def create_channel(
    channel_request: ChannelRequest,
    current_user=Depends(current_user_dependency),
    service: ChannelService = Depends(get_channel_service),
) -> ChannelResponse:
    # 현재 인증된 사용자의 ID를 소유자로 설정
    return service.create_channel(channel_request.model_dump(), owner_id=current_user.id)


@channel_router.put("/{channel_id}", response_model=ChannelResponse)
def update_channel(
    channel_id: int,
    channel_request: ChannelRequest,
    service: ChannelService = Depends(get_channel_service),
) -> ChannelResponse:
    return service.update_channel(channel_id, channel_request.dict())


@channel_router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_channel(
    channel_id: int, service: ChannelService = Depends(get_channel_service)
) -> Response:
    return service.delete_channel(channel_id)


@channel_router.put(
    "/{channel_id}/state",
    response_model=ChannelResponse,
)
def update_channel_state(
    channel_id: int,
    req: ChannelStateRequest,
    service: ChannelService = Depends(get_channel_service),
) -> ChannelResponse:
    return service.update_channel_state(channel_id, req.channel_state)


# --------------------------
# Group API 엔드포인트
# --------------------------
group_router = APIRouter(
    prefix="/groups", tags=["groups"], dependencies=[Depends(admin_dependency)]
)


@inject
def get_group_service(
    service: GroupService = Depends(Provide[Container.group_service]),
) -> GroupService:
    return service


@group_router.get("", response_model=List[GroupResponse])
def get_groups(
    sort_by: str = "id",
    descending: bool = False,
    service: GroupService = Depends(get_group_service),
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
) -> List[GroupResponse]:
    return service.get_all_groups(
        sort_by=sort_by,
        descending=descending,
        owner_id=owner_id
    )


# 신규 API 1: user_id 또는 channel_id로 그룹 검색 (쿼리 파라미터: user_id, channel_id)
@group_router.get("/search", response_model=List[GroupResponse])
def search_groups(
    user_id: Optional[int] = None,
    channel_id: Optional[int] = None,
    service: GroupService = Depends(get_group_service),
) -> List[GroupResponse]:
    return service.get_groups_by_filter(user_id, channel_id)


@group_router.get("/{group_id}", response_model=GroupResponse)
def get_group(
    group_id: int, service: GroupService = Depends(get_group_service)
) -> GroupResponse:
    return service.get_group(group_id)


@group_router.post(
    "", status_code=status.HTTP_201_CREATED, response_model=GroupResponse
)
def create_group(
    group_request: GroupRequest,
    current_user=Depends(current_user_dependency),
    service: GroupService = Depends(get_group_service),
) -> GroupResponse:
    # 현재 인증된 사용자의 ID를 소유자로 설정
    return service.create_group(group_request.model_dump(), owner_id=current_user.id)


@group_router.put("/{group_id}", response_model=GroupResponse)
def update_group(
    group_id: int,
    group_request: GroupRequest,
    service: GroupService = Depends(get_group_service),
) -> GroupResponse:
    return service.update_group(group_id, group_request.dict())


@group_router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_group(
    group_id: int, service: GroupService = Depends(get_group_service)
) -> Response:
    return service.delete_group(group_id)


# 신규 API 2: POST /groups/{group_id}/users – 복수의 유저를 해당 그룹에 가입시키기
@group_router.post(
    "/{group_id}/users",
    status_code=status.HTTP_201_CREATED,
    response_model=List[UserJoinGroupResponse],
)
def add_users_to_group(
    group_id: int,
    request: UsersGroupJoinRequest,
    service: GroupUserService = Depends(get_group_user_service),
) -> List[UserJoinGroupResponse]:
    join_records = []
    for user_id in request.user_id_list:
        service.add_user_to_group(group_id, user_id)
        groups = service.get_groups_by_user(user_id)
        join_record = next(
            (item for item in groups if item["group_id"] == group_id), None
        )
        if not join_record:
            raise HTTPException(
                status_code=500, detail=f"가입 정보 생성 실패 for user {user_id}"
            )
        join_records.append(join_record)
    return join_records


# --------------------------
# Game API 엔드포인트
# --------------------------
game_router = APIRouter(
    prefix="/games", tags=["games"], dependencies=[Depends(admin_dependency)]
)


@inject
def get_game_service(
    game_service: GameService = Depends(Provide[Container.game_service]),
) -> GameService:
    return game_service


@game_router.get("", response_model=list[GameResponse])
def get_games(service: GameService = Depends(get_game_service)) -> list[GameResponse]:
    return service.get_all_games()


# 신규 API 1: 그룹 ID (필수)와 선택적 user_id로 게임 검색
@game_router.get("/search", response_model=list[GameResponse])
def search_games(
    group_id: int,
    user_id: Optional[int] = None,
    service: GameService = Depends(get_game_service),
) -> list[GameResponse]:
    return service.get_games_by_filter(group_id, user_id)


# 신규 API 2: 복수의 게임 페어 생성
@game_router.post(
    "/pairs", status_code=status.HTTP_201_CREATED, response_model=List[GameResponse]
)
def create_game_pairs(
    request: GamePairsRequest, service: GameService = Depends(get_game_service)
) -> List[GameResponse]:
    return service.create_game_pairs(request.group_id, request.pointed_users)


@game_router.get("/{game_id}", response_model=GameResponse)
def get_game(
    game_id: int, service: GameService = Depends(get_game_service)
) -> GameResponse:
    return service.get_game(game_id)


@game_router.post("", status_code=status.HTTP_201_CREATED, response_model=GameResponse)
def create_game(
    game_request: GameRequest,
    current_user=Depends(current_user_dependency),
    service: GameService = Depends(get_game_service),
) -> GameResponse:
    # 현재 인증된 사용자의 ID를 소유자로 설정
    return service.create_game(game_request.dict(), owner_id=current_user.id)


@game_router.put("/{game_id}", response_model=GameResponse)
def update_game(
    game_id: int,
    game_request: GameRequest,
    service: GameService = Depends(get_game_service),
) -> GameResponse:
    return service.update_game(game_id, game_request.dict())


@game_router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_game(
    game_id: int, service: GameService = Depends(get_game_service)
) -> Response:
    return service.delete_game(game_id)


# --------------------------
# Review API 엔드포인트
# --------------------------
review_router = APIRouter(
    prefix="/reviews", tags=["reviews"], dependencies=[Depends(admin_dependency)]
)


@inject
def get_review_service(
    review_service: ReviewService = Depends(Provide[Container.review_service]),
) -> ReviewService:
    return review_service


@review_router.get("", response_model=List[ReviewResponse])
def get_reviews(
    service: ReviewService = Depends(get_review_service),
) -> list[ReviewResponse]:
    return service.get_all_reviews()


# 신규 API: channel_id 를 기준으로 후기를 검색하고, 추가적으로 target_user_id 로 필터링 함
@review_router.get("/search", response_model=List[ReviewResponse])
def search_reviews(
    channel_id: int,
    target_user_id: Optional[int] = None,
    service: ReviewService = Depends(get_review_service),
) -> List[ReviewResponse]:
    return service.get_reviews_by_filter(channel_id, target_user_id)


@review_router.get("/{review_id}", response_model=ReviewResponse)
def get_review(
    review_id: int, service: ReviewService = Depends(get_review_service)
) -> ReviewResponse:
    return service.get_review(review_id)


@review_router.post(
    "", status_code=status.HTTP_201_CREATED, response_model=ReviewResponse
)
def create_review(
    review_request: ReviewRequest,
    current_user=Depends(current_user_dependency),
    service: ReviewService = Depends(get_review_service),
) -> ReviewResponse:
    # 현재 인증된 사용자의 ID를 소유자로 설정
    return service.create_review_with_owner(review_request.model_dump(), owner_id=current_user.id)


@review_router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    review_request: ReviewRequest,
    service: ReviewService = Depends(get_review_service),
) -> ReviewResponse:
    return service.update_review(review_id, review_request.model_dump())


@review_router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int, service: ReviewService = Depends(get_review_service)
) -> Response:
    return service.delete_review(review_id)


customers_router = APIRouter(
    prefix="/customers",
    tags=["customers"],
    dependencies=[Depends(current_user_dependency)],
)


# -------------------------------------------------------------------------
# 1) 내 정보 조회 & 수정
#    (기존: GET/PUT /users/{user_id} -> 새로: GET/PUT /customers/my_info)
# -------------------------------------------------------------------------
@customers_router.get("/my_info", response_model=UserResponse)
def get_my_info(
    current_user=Depends(current_user_dependency),
    user_service: UserService = Depends(get_user_service),
):
    return user_service.get_user(current_user.id)


@customers_router.put("/my_info", response_model=UserResponse)
def update_my_info(
    user_req: UserRequest,
    current_user=Depends(current_user_dependency),
    user_service: UserService = Depends(get_user_service),
) -> Union[UserResponse, None]:
    return user_service.update_user(current_user.id, user_req.dict())


# -------------------------------------------------------------------------
# 2) 채널 목록 조회
#    (기존: GET /channels -> 새로: GET /customers/channel_list)
# -------------------------------------------------------------------------
@customers_router.get("/channel_list", response_model=ChannelListResponse)
def get_channel_list(
    brand_id: Optional[int] = Query(None, description="브랜드 ID (없으면 전체 조회)"),
    state: Optional[ChannelState] = Query(None, description="채널 상태 필터"),
    sort_by: str = Query("id", description="정렬 기준 필드명"),
    descending: bool = Query(False, description="내림차순 여부"),
    service: ChannelService = Depends(get_channel_service),
    offset: int = Query(0, description="페이지네이션 시작 위치"),
    limit: int = Query(100, description="페이지네이션 크기"),
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
) -> ChannelListResponse:
    return service.get_channels(
        sort_by=sort_by,
        descending=descending,
        brand_id=brand_id,
        state=state,
        offset=offset,
        limit=limit,
        owner_id=owner_id
    )


# -------------------------------------------------------------------------
# 3) 특정 채널 가입 정보 & 가입/탈퇴 등
#    (기존: GET/POST /users/{user_id}/channel, GET /users/{user_id}/channel/{channel_id} 등 -> 새로: GET/POST /customers/channel, ...
# -------------------------------------------------------------------------
@customers_router.get("/channels", response_model=List[UserJoinChannelResponse])
def get_my_channels(
    current_user=Depends(current_user_dependency),
    service: ChannelUserService = Depends(get_channel_user_service),
):
    return service.get_channels_by_user(current_user.id)


@customers_router.post(
    "/channel",
    response_model=UserJoinChannelResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_myself_to_channel(
    request: UserJoinChannelRequest,
    current_user=Depends(current_user_dependency),
    service: ChannelUserService = Depends(get_channel_user_service),
):
    print(f"Adding user {current_user.id} to channel {request.target_channel_id}")
    # record = next((item for item in joined_channels if item.channel_id == request.target_channel_id), None)
    # if not record:
    #     raise HTTPException(status_code=500, detail="채널 가입에 실패했습니다.")
    return service.add_user_to_channel(request.target_channel_id, current_user.id)


@customers_router.get("/channel/{channel_id}", response_model=ChannelResponse)
def get_channel_by_id(
    channel_id: int,
    state: Optional[ChannelState] = Query(None, description="채널 상태 필터"),
    service: ChannelService = Depends(get_channel_service),
) -> ChannelResponse:
    """
    주어진 channel_id에 해당하는 채널 정보를 반환하는 API입니다.
    """
    return service.get_channel(channel_id)


@customers_router.get(
    "/channel/{channel_id}/joined_users", response_model=List[UserJoinChannelResponse]
)
def get_channel_joined_users(
    channel_id: int, service: ChannelUserService = Depends(get_channel_user_service)
):
    return service.get_users_by_channel(channel_id)


# -------------------------------------------------------------------------
# 4) 특정 그룹 조회
#    (기존: GET /groups/{group_id} -> 새로: GET /customers/group)
# -------------------------------------------------------------------------
@customers_router.get("/groups", response_model=List[GroupResponse])
def get_my_groups(
    current_user=Depends(current_user_dependency),
    channel_id: Optional[int] = None,
    service: GroupService = Depends(get_group_service),
):
    # 현재 사용자가 가입한 그룹 중 channel_id가 제공되면 필터링하도록 서비스 호출
    return service.get_groups_by_filter(current_user.id, channel_id)


# -------------------------------------------------------------------------
# 5) 게임 검색 (group_id는 필수, user_id는 토큰에서 자동 주입)
#    (기존: GET /games/search -> 새로: GET /customers/game)
# -------------------------------------------------------------------------
@customers_router.get("/games", response_model=List[GameResponse])
def get_my_games(
    current_user=Depends(current_user_dependency),
    channel_id: Optional[int] = None,
    game_service: GameService = Depends(get_game_service),
):
    # 현재 사용자의 게임 목록 중 channel_id가 제공되면 필터링하도록 서비스 호출
    return game_service.get_games_by_user(current_user.id, channel_id)


@customers_router.get("/games/matched_user", response_model=List[GameWithUserResponse])
def get_my_games_with_matched_user(
    current_user=Depends(current_user_dependency),
    channel_id: Optional[int] = None,
    game_service: GameService = Depends(get_game_service),
):
    return game_service.get_games_by_user_with_matched_user(current_user.id, channel_id)


# -------------------------------------------------------------------------
# 6) 리뷰 등록/검색
#    (기존: POST /reviews, GET /reviews/search -> 새로: POST /customers/review, GET /customers/reviews)
# -------------------------------------------------------------------------
@customers_router.post(
    "/review", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED
)
def create_my_review(
    review_req: ReviewRequest,
    current_user=Depends(current_user_dependency),
    service: ReviewService = Depends(get_review_service),
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
):
    '''
    소유자 ID를 리뷰 데이터에 추가합니다.
    소유자 ID가 제공되지 않으면 리뷰어(현재 인증된 사용자)의 ID를 사용합니다.
    '''
    data = review_req.model_dump()
    data["reviewer_user_id"] = current_user.id
    return service.create_review_with_owner(data, owner_id)


@customers_router.get("/reviews", response_model=List[ReviewResponse])
def get_my_reviews(
    current_user=Depends(current_user_dependency),
    channel_id: Optional[int] = None,
    service: ReviewService = Depends(get_review_service),
):
    # 현재 사용자의 리뷰 중 channel_id가 제공되면 해당 채널에 속하는 리뷰만 조회함
    return service.get_reviews_by_target_user(current_user.id, channel_id)


# 브랜드 관련 엔드포인트
brand_router = APIRouter(
    prefix="/brands", tags=["brands"], dependencies=[Depends(admin_dependency)]
)


@inject
def get_brand_service(
    service: BrandService = Depends(Provide[Container.brand_service]),
) -> BrandService:
    return service


@brand_router.post(
    "",
    response_model=BrandResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_brand(
    brand_request: BrandRequest,
    current_user=Depends(current_user_dependency),
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    """
    브랜드 생성 엔드포인트  
    생성된 브랜드의 ID만 반환합니다.
    """
    return service.create_brand(brand_request.model_dump(), owner_id=current_user.id)


@brand_router.put(
    "/{brand_id}",
    response_model=BrandResponse,
)
def update_brand(
    brand_id: int,
    brand_req: BrandRequest,
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    """
    브랜드 상세 정보 수정 엔드포인트  
    """
    return service.update_brand(brand_id, brand_req.model_dump())


@brand_router.post(
    "/uploadImage/thumbnail",
    response_model=ImageResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_brand_thumbnail(
    brand_id: int = Form(..., description="브랜드 ID"),
    file: UploadFile = File(..., description="썸네일 이미지 파일"),
    service: BrandService = Depends(get_brand_service),
) -> ImageResponse:
    """
    브랜드 썸네일 이미지 업로드/교체 엔드포인트
    """
    return service.upload_thumbnail(brand_id, file)


@brand_router.post(
    "/uploadImage/detail",
    response_model=ImageResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_brand_detail_image(
    brand_id: int = Form(..., description="브랜드 ID"),
    file: UploadFile = File(..., description="상세 이미지 파일"),
    service: BrandService = Depends(get_brand_service),
) -> ImageResponse:
    """
    단일 상세 이미지 파일을 업로드하고,
    업로드된 이미지 정보를 반환합니다.
    """
    return service.upload_detail_image(brand_id, file)


@brand_router.get("", response_model=BrandListResponse)
def get_brands(
    state: Optional[BrandState] = Query(None, description="브랜드 상태 필터"),
    sort_by: str = Query("id"),
    descending: bool = Query(False),
    offset: int = Query(0, description="페이지네이션 시작 위치"),
    limit: int = Query(100, description="페이지네이션 크기"),
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
    service: BrandService = Depends(get_brand_service),
) -> BrandListResponse:
    return service.get_all_brands(
        state=state,
        sort_by=sort_by,
        descending=descending,
        offset=offset,
        limit=limit,
        owner_id=owner_id
    )


@brand_router.get("/{brand_id}", response_model=BrandResponse)
def get_brand(brand_id: int, service: BrandService = Depends(get_brand_service)):
    return service.get_brand(brand_id)


@brand_router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(
    brand_id: int, service: BrandService = Depends(get_brand_service)
) -> Response:
    service.delete_brand(brand_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@brand_router.delete(
    "/uploadImages/detail",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="브랜드 상세 이미지 삭제"
)
def delete_brand_detail_image(
    brand_id: int = Query(..., description="브랜드 ID"),
    image_id: int = Query(..., description="삭제할 상세 이미지 ID"),
    service: BrandService = Depends(get_brand_service),
) -> Response:
    """
    브랜드에 업로드된 detail 이미지 한 건을 삭제합니다.
    """
    return service.delete_detail_image(brand_id, image_id)


@brand_router.put(
    "/{brand_id}/state",
    response_model=BrandResponse,
)
def update_brand_state(
    brand_id: int,
    req: BrandStateRequest,
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    return service.update_brand_state(brand_id, req.brand_state)


# 질문카드카테고리 관련 엔드포인트
question_card_category_router = APIRouter(
    prefix="/questionCardCategoris",
    tags=["questionCardCategoris"],
    dependencies=[Depends(admin_dependency)],
)


@inject
def get_category_service(
    service: QuestionCardCategoryService = Depends(
        Provide[Container.question_card_category_service]
    ),
) -> QuestionCardCategoryService:
    return service


@question_card_category_router.post(
    "", response_model=QuestionCardCategoryResponse, status_code=status.HTTP_201_CREATED
)
def create_question_card_category(
    req: QuestionCardCategoryRequest,
    current_user=Depends(current_user_dependency),
    service: QuestionCardCategoryService = Depends(get_category_service),
) -> QuestionCardCategoryResponse:
    # 현재 인증된 사용자의 ID를 소유자로 설정
    return service.create_category(req.model_dump(), owner_id=current_user.id)


@question_card_category_router.get(
    "", response_model=List[QuestionCardCategoryResponse]
)
def get_categories(
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
    service: QuestionCardCategoryService = Depends(get_category_service),
) -> List[QuestionCardCategoryResponse]:
    return service.get_all_categories(owner_id=owner_id)


@question_card_category_router.get(
    "/{question_card_category_id}", response_model=QuestionCardCategoryResponse
)
def get_question_card_category(
    question_card_category_id: int,
    service: QuestionCardCategoryService = Depends(get_category_service),
):
    return service.get_category(question_card_category_id)


@question_card_category_router.put(
    "/{question_card_category_id}", response_model=QuestionCardCategoryResponse
)
def update_question_card_category(
    question_card_category_id: int,
    req: QuestionCardCategoryRequest,
    service: QuestionCardCategoryService = Depends(get_category_service),
) -> QuestionCardCategoryResponse:
    # 파일 업로드 부분 제거 (이미지 변경은 별도 API를 통해 수행)
    return service.update_category(question_card_category_id, req.model_dump())


@question_card_category_router.post(
    "/{question_card_category_id}/uploadImage",
    response_model=QuestionCardCategoryResponse,
    status_code=status.HTTP_200_OK,
)
def upload_category_image(
    question_card_category_id: int,
    file: UploadFile = File(...),
    service: QuestionCardCategoryService = Depends(get_category_service),
) -> QuestionCardCategoryResponse:
    # 별도의 uploadImage 엔드포인트로 기존 커버 이미지가 있으면 삭제한 후 새 이미지를 업로드
    return service.upload_category_image(question_card_category_id, file)


@question_card_category_router.delete(
    "/{question_card_category_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_question_card_category(
    question_card_category_id: int,
    service: QuestionCardCategoryService = Depends(get_category_service),
) -> Response:
    # 삭제 시 관련 S3 이미지도 함께 삭제
    service.delete_category(question_card_category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# 질문카드 관련 엔드포인트
question_card_router = APIRouter(
    prefix="/questionCards",
    tags=["questionCards"],
    dependencies=[Depends(admin_dependency)],
)


@inject
def get_card_service(
    service: QuestionCardService = Depends(Provide[Container.question_card_service]),
) -> QuestionCardService:
    return service


@question_card_router.post(
    "", response_model=QuestionCardResponse, status_code=status.HTTP_201_CREATED
)
def create_question_card(
    req: QuestionCardRequest, service: QuestionCardService = Depends(get_card_service)
) -> QuestionCardResponse:
    # 파일 업로드 관련 기능은 분리되었으므로, 단순히 데이터 생성만 수행합니다.
    return service.create_card(req.model_dump())


@question_card_router.get("", response_model=List[QuestionCardResponse])
def get_question_cards(
    category_id: int, service: QuestionCardService = Depends(get_card_service)
):
    return service.get_cards_by_category(category_id)


@question_card_router.get("/{question_card_id}", response_model=QuestionCardResponse)
def get_question_card(
    question_card_id: int, service: QuestionCardService = Depends(get_card_service)
):
    return service.get_card(question_card_id)


@question_card_router.put("/{card_id}", response_model=QuestionCardResponse)
def update_question_card(
    card_id: int,
    req: QuestionCardRequest,
    service: QuestionCardService = Depends(get_card_service),
) -> QuestionCardResponse:
    # 파일 업로드 관련 기능은 분리되었으므로, 단순히 데이터 수정만 수행합니다.
    return service.update_card(card_id, req.model_dump())


@question_card_router.post(
    "/uploadImage", response_model=QuestionCardResponse, status_code=status.HTTP_200_OK
)
def upload_card_image(
    card_id: int,
    file: UploadFile = File(...),
    service: QuestionCardService = Depends(get_card_service),
) -> QuestionCardResponse:
    # 별도의 uploadImage 엔드포인트를 통해 파일 업로드 시, 기존 이미지가 있으면 삭제 후 새 이미지로 교체합니다.
    return service.upload_card_image_with_replacement(card_id, file)


@question_card_router.delete(
    "/{question_card_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_question_card(
    question_card_id: int, service: QuestionCardService = Depends(get_card_service)
) -> Response:
    service.delete_card(question_card_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@inject
def get_brand_qcc_service(
    service: BrandQuestionCardCategoryService = Depends(
        Provide[Container.brand_question_card_category_service]
    ),
) -> BrandQuestionCardCategoryService:
    return service


@brand_router.get(
    "/{brand_id}/questionCardCategories", response_model=QuestionCardCategoryWithBrand
)
def get_question_card_categories_by_brand(
    brand_id: int,
    service: BrandQuestionCardCategoryService = Depends(get_brand_qcc_service),
):
    return service.get_categories_by_brand(brand_id)


@brand_router.get(
    "/{brand_id}/questionCardCategories/questionCards",
    response_model=BrandWithAllItemsResponse,
)
def get_question_cards_by_brand(
    brand_id: int,
    service: BrandQuestionCardCategoryService = Depends(get_brand_qcc_service),
):
    return service.get_cards_by_brand(brand_id)


@brand_router.post(
    "/{brand_id}/questionCardCategories/{question_card_category_id}",
    response_model=BrandQuestionCardCategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_brand_question_card_category(
    brand_id: int,
    question_card_category_id: int,
    service: BrandQuestionCardCategoryService = Depends(get_brand_qcc_service),
):
    return service.add_link(brand_id, question_card_category_id)


@brand_router.get(
    "/{brand_id}/questionCardCategories/{question_card_category_id}",
    response_model=BrandQuestionCardCategoryResponse,
)
def get_brand_question_card_category(
    brand_id: int,
    question_card_category_id: int,
    service: BrandQuestionCardCategoryService = Depends(get_brand_qcc_service),
):
    return service.get_link(brand_id, question_card_category_id)


@brand_router.delete(
    "/{brand_id}/questionCardCategories/{question_card_category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_brand_question_card_category(
    brand_id: int,
    question_card_category_id: int,
    service: BrandQuestionCardCategoryService = Depends(get_brand_qcc_service),
):
    service.delete_link(brand_id, question_card_category_id)
    return


@customers_router.get("/brand/{brand_id}", response_model=BrandResponse)
def get_brand_by_id(
    brand_id: int,
    service: BrandService = Depends(get_brand_service)
):
    """
    GET /customers/brand/{brand_id}
    주어진 brand_id에 해당하는 브랜드 상세 정보를 반환합니다.
    """
    return service.get_brand(brand_id)


@customers_router.get("/questionCardCategories", response_model=list[QuestionCardCategoryResponse])
def get_categories_by_brand_id(
    brandId: int,
    service: BrandQuestionCardCategoryService = Depends(get_brand_qcc_service)
):
    """
    GET /customers/questionCardCategories?brandId=...
    주어진 브랜드(brandId)에 연결된 질문 카드 카테고리 목록을 조회하여 반환합니다.
    """
    return service.get_category_list_by_brand(brandId)


@customers_router.get("/questionCards", response_model=list[QuestionCardResponse])
def get_question_cards_by_category_id(
    categoryId: int,
    service: QuestionCardService = Depends(get_card_service)
):
    """
    GET /customers/questionCards?categoryId=...
    주어진 categoryId에 속한 질문 카드 목록을 조회하여 반환합니다.
    """
    return service.get_cards_by_category(categoryId)

@inject
def get_brand_review_service(
    brand_review_service: BrandReviewService = Depends(Provide[Container.brand_review_service]),
) -> BrandReviewService:
    return brand_review_service

@customers_router.post(
    "/brandReviews/uploadImage",
    response_model=BrandReviewUploadImageResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_brand_review_image(
    brand_review_id: int = Body(..., description="후기 고유 ID"),
    file: UploadFile = File(...),
    service: BrandReviewService = Depends(get_brand_review_service),
):
    return service.upload_brand_review_image(brand_review_id, file)

@customers_router.delete(
    "/brandReviews/deleteImage",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_brand_review_image(
    image_id: int,
    service: BrandReviewService = Depends(get_brand_review_service),
):
    return service.delete_brand_review_image(image_id)

@customers_router.post("/brandReviews", response_model=BrandReviewUrlResponse)
def create_brand_review(
    review_create: BrandReviewCreate,
    current_user = Depends(current_user_dependency),
    service: BrandReviewService = Depends(get_brand_review_service),
):
    return service.create_review(review_create, current_user.id)

@customers_router.put("/brandReviews/{review_id}", response_model=BrandReviewUrlResponse)
def update_brand_review(
    review_id: int,
    review_update: BrandReviewUpdate,
    service: BrandReviewService = Depends(get_brand_review_service),
):
    return service.update_review(review_id, review_update)
# 랜딩페이지 관련 엔드포인트

landing_page_router = APIRouter(
    prefix="/landing", 
    tags=["landing"], 
    #dependencies=[Depends(landing_page_api_key_dependency)]
    )

@inject
def get_survey_service(
    survey_service: SurveyService = Depends(Provide[Container.survey_service]),
) -> SurveyService:
    return survey_service

@inject
def get_survey_document_service(
    svc: SurveyDocumentService = Depends(
        Provide[Container.survey_document_service]
    ),
) -> SurveyDocumentService:
    return svc

@inject
def get_survey_response_service(
    svc: SurveyResponseDocumentService = Depends(
        Provide[Container.survey_response_document_service]
    ),
) -> SurveyResponseDocumentService:
    return svc

# 1. 설문 양식 조회 (소비자용)
@landing_page_router.get(
    "/surveys",
    response_model=List[SurveyWithQuestionsResponse],
)
def get_survey_form_by_brand(
    brand_id: int = Query(..., description="조회할 브랜드 ID"),
    owner_id: int = Depends(get_owner_id_required),
    service: SurveyDocumentService = Depends(get_survey_document_service)
):
    survey = service.list(brand_id, owner_id)
    if not survey:
        raise HTTPException(status_code=404, detail="해당 브랜드의 설문 양식이 존재하지 않습니다.")
    return survey

# 2. 설문 응답 제출 (소비자용)
@landing_page_router.post(
    "/surveys/responses",
    response_model=SurveyResponseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_survey_response(
    survey_id: str = Query(..., description="설문 문서 ID"),
    req: SurveyResponseCreateRequest = Body(...),
    service: SurveyResponseDocumentService = Depends(get_survey_response_service),
    owner_id: int = Depends(get_owner_id_required),
) -> SurveyResponseResponse:
    """
    Document-DB 기반으로 설문 응답을 생성합니다.
    """
    created = service.create(survey_id, req.model_dump(), owner_id)
    return SurveyResponseResponse.model_validate(created)

@inject
def get_survey_form_service(
    survey_form_service: SurveyFormService = Depends(Provide[Container.survey_form_service]),
) -> SurveyFormService:
    return survey_form_service

@landing_page_router.post(
    "/surveys/form/uploadImage",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
def upload_survey_form_image(
    file: UploadFile = File(...),
    service: SurveyFormService = Depends(get_survey_form_service),
):
    """
    설문 양식 이미지를 업로드하고 업로드된 이미지의 경로(object key)와 presigned URL을 반환하는 엔드포인트입니다.
    
    업로드된 파일은 "landing/survey/form" 경로 하위에 저장됩니다.
    """
    return service.upload_survey_form_image(file)

# Landing 용 신규: GET /landing/channels?brand_id=...
@landing_page_router.get("/channels", response_model=ChannelListResponse)
def get_landing_channels(
    brand_id: Optional[int] = Query(None, description="브랜드 ID (없으면 전체 조회)"),
    state: Optional[ChannelState] = Query(None, description="채널 상태 필터"),
    sort_by: str = Query("id", description="정렬 기준 필드명"),
    descending: bool = Query(False, description="내림차순 여부"),
    service: ChannelService = Depends(get_channel_service),
    offset: int = Query(0, description="페이지네이션 시작 위치"),
    limit: int = Query(100, description="페이지네이션 크기"),
    owner_id: int = Depends(get_owner_id_required),
) -> ChannelListResponse:
    return service.get_channels(sort_by, descending,
        brand_id=brand_id,
        state=state,
        offset=offset,
        limit=limit,
        owner_id=owner_id,
    )

# ----------------------------------
# Landing 페이지용 BrandList 조회
#    GET /landing/brands?sort_by=&descending=
#    → Admin 라우터의 GET BrandList와 동일
# ----------------------------------
@landing_page_router.get(
    "/brands",
    response_model=BrandListResponse,
)
def get_landing_brands(
    state: Optional[BrandState] = Query(
        None, description="브랜드 상태 필터 (예: ONGOING, FINISH)"
    ),
    service: BrandService = Depends(get_brand_service),
    sort_by: str = Query("id"),
    descending: bool = Query(False),
    offset: int = Query(0, description="페이지네이션 시작 위치"),
    limit: int = Query(100, description="페이지네이션 크기"),
    owner_id: int = Depends(get_owner_id_required),
) -> BrandListResponse:
    return service.get_all_brands(
        state=state,
        sort_by=sort_by,
        descending=descending,
        offset=offset,
        limit=limit,
        owner_id=owner_id,
    )

# ----------------------------------
# Landing 페이지용 Brand 상세 조회
#    GET /landing/brands/{brand_id}
#    → Admin 라우터의 GET Brand와 동일
# ----------------------------------
@landing_page_router.get(
    "/brands/{brand_id}",
    response_model=BrandResponse,
)
def get_landing_brand(
    brand_id: int,
    service: BrandService = Depends(get_brand_service),
) -> BrandResponse:
    return service.get_brand(brand_id)



########################################################
# LandingPage
########################################################
@landing_page_router.get("/mainImage", response_model=Optional[ImageResponse])
def get_main_image(
    owner_id: int = Depends(get_owner_id_required),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """현재 설정된 랜딩 페이지 메인 이미지를 조회합니다."""
    return landing_service.get_main_image(owner_id)

@landing_page_router.get("/galleryImages", response_model=List[ImageResponse])
def get_gallery_images(
    owner_id: int = Depends(get_owner_id_required),
    landing_service: LandingPageService = Depends(get_landing_service)
):
    """현재 설정된 랜딩 페이지 갤러리 이미지 목록을 조회합니다."""
    return landing_service.get_gallery_images(owner_id)

@landing_page_router.get("/brandReviews", response_model=BrandReviewUrlListResponse)
def get_brand_reviews(
    owner_id: int = Depends(get_owner_id_required),
    brand_review_service: BrandReviewService = Depends(get_brand_review_service)
):
    """현재 설정된 랜딩 페이지 브랜드 리뷰 목록을 조회합니다."""
    return brand_review_service.get_all_reviews(owner_id=owner_id)


survey_doc_router = APIRouter(
    prefix="/surveys",
    tags=["survey_documents"],
)

survey_response_doc_router = APIRouter(
    prefix="/surveysResponses",
    tags=["survey_documents"],
)

# 1) 설문 + 문항 일괄 생성
@survey_doc_router.post(
    "",
    response_model=SurveyWithQuestionsResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_survey_document(
    req: SurveyCreateWithQuestionsRequest,
    current_user = Depends(current_user_dependency),
    service: SurveyDocumentService = Depends(get_survey_document_service),
) -> SurveyWithQuestionsResponse:
    created = service.create(req.model_dump(), current_user.id)
    return SurveyWithQuestionsResponse.model_validate(created)

# 2) 브랜드별/전체 설문 목록 조회
@survey_doc_router.get(
    "",
    response_model=list[SurveyWithQuestionsResponse],
)
def list_survey_documents(
    brand_id: Optional[int] = Query(None, description="브랜드 ID 필터"),
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
    service: SurveyDocumentService = Depends(get_survey_document_service),
) -> list[SurveyWithQuestionsResponse]:
    docs = service.list(brand_id, owner_id)
    return [SurveyWithQuestionsResponse.model_validate(d) for d in docs]

# 3) 단일 설문 조회
@survey_doc_router.get(
    "/{survey_id}",
    response_model=SurveyWithQuestionsResponse,
)
def get_survey_document(
    survey_id: str = Path(..., description="설문 문서 ID"),
    service: SurveyDocumentService = Depends(get_survey_document_service),
) -> SurveyWithQuestionsResponse:
    doc = service.get(survey_id)
    return SurveyWithQuestionsResponse.model_validate(doc)

# 4) 설문 업데이트
@survey_doc_router.put(
    "/{survey_id}",
    response_model=SurveyWithQuestionsResponse,
)
def update_survey_document(
    survey_id: str = Path(..., description="설문 문서 ID"),
    req: SurveyCreateWithQuestionsRequest = Body(...),
    service: SurveyDocumentService = Depends(get_survey_document_service),
) -> SurveyWithQuestionsResponse:
    updated = service.update(survey_id, req.model_dump())
    return SurveyWithQuestionsResponse.model_validate(updated)

# 5) 설문 삭제
@survey_doc_router.delete(
    "/{survey_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_survey_document(
    survey_id: str = Path(..., description="설문 문서 ID"),
    service: SurveyDocumentService = Depends(get_survey_document_service),
) -> Response:
    service.delete(survey_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# 1) 응답 등록 (POST)
@survey_response_doc_router.post(
    "",
    response_model=SurveyResponseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_response(
    survey_id: str = Query(..., description="설문 문서 ID"),
    req: SurveyResponseCreateRequest = Body(...),
    owner_id: int = Depends(get_owner_id_required),
    service: SurveyResponseDocumentService = Depends(get_survey_response_service),
) -> SurveyResponseResponse:
    created = service.create(survey_id, req.model_dump(), owner_id)
    return SurveyResponseResponse.model_validate(created)

# 2) 설문에 대한 전체 응답 목록 조회 (GET)
@survey_response_doc_router.get(
    "",
    response_model=SurveyResponseListResponse,
    summary="설문 응답 목록 조회 (어드민)",
)
def list_responses(
    survey_id: Optional[str] = Query(None),
    channel_id: Optional[int] = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    sort_by: str = Query("submittedAt"),
    descending: bool = Query(True),
    owner_id: Optional[int] = Depends(get_owner_id_unless_super_admin),
    service: SurveyResponseDocumentService = Depends(get_survey_response_service),
):
    """
    어드민 설문 응답 목록 조회 (페이지네이션/정렬 지원)
    """
    result = service.list(
        survey_id=survey_id,
        channel_id=channel_id,
        offset=offset,
        limit=limit,
        sort_by=sort_by,
        descending=descending,
        owner_id=owner_id,
    )
    return SurveyResponseListResponse(**result)

# 3) 단일 응답 조회 (GET)
@survey_response_doc_router.get(
    "/{response_id}",
    response_model=SurveyResponseResponse,
)
def get_response(
    response_id: str = Path(..., description="응답 문서 ID"),
    service: SurveyResponseDocumentService = Depends(get_survey_response_service),
) -> SurveyResponseResponse:
    return SurveyResponseResponse.model_validate(service.get(response_id))

# 4) 응답 수정 (PUT)
@survey_response_doc_router.put(
    "/{response_id}",
    response_model=SurveyResponseResponse,
)
def update_response(
    response_id: str = Path(..., description="응답 문서 ID"),
    update_data: dict = Body(...),
    service: SurveyResponseDocumentService = Depends(get_survey_response_service),
) -> SurveyResponseResponse:
    updated = service.update(response_id, update_data)
    return SurveyResponseResponse.model_validate(updated)

# 5) 응답 삭제 (DELETE)
@survey_response_doc_router.delete(
    "/{response_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_response(
    response_id: str = Path(..., description="응답 문서 ID"),
    service: SurveyResponseDocumentService = Depends(get_survey_response_service),
) -> Response:
    service.delete(response_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# 2) SurveyResponse 문서의 registState만 업데이트하는 Admin 전용 엔드포인트 추가
@survey_response_doc_router.put(
    "/{response_id}/state",
    response_model=SurveyResponseResponse,
    dependencies=[Depends(admin_dependency)],   # 관리자 권한 필요
)
def update_survey_response_state(
    response_id: str = Path(..., description="응답 문서 ID"),
    regist_state: SurveyRegistState = Body(..., embed=True, description="변경할 registState"),
    service: SurveyResponseDocumentService = Depends(get_survey_response_service),
) -> SurveyResponseResponse:
    """
    특정 SurveyResponse 문서의 registState만 변경합니다.
    """
    updated = service.update(response_id, {"registState": regist_state})
    return SurveyResponseResponse.model_validate(updated)

# 사용자용 호스트 등록 라우터 (admin 권한 필요)
host_regist_router = APIRouter(
    prefix="/hostRegist",
    tags=["hostRegist"],
)

# 관리자용 호스트 등록 관리 라우터 (superAdmin 권한 필요)
host_regist_admin_router = APIRouter(
    prefix="/hostRegistAdmin",
    tags=["hostRegistAdmin"],
)

@inject
def get_host_regist_service(
    service: HostRegistService = Depends(Provide[Container.host_regist_service]),
) -> HostRegistService:
    return service

# 사용자가 호스트 신청을 등록하는 엔드포인트 (admin 권한 필요)
@host_regist_router.post("", response_model=HostRegistResponse, status_code=status.HTTP_201_CREATED)
def create_host_regist(
    current_user=Depends(current_user_dependency),
    service: HostRegistService = Depends(get_host_regist_service),
):
    """
    호스트 등록 신청을 생성합니다.
    """
    return service.create_host_regist(current_user.id)


# 사용자가 자신의 호스트 신청 상태를 조회하는 엔드포인트 (admin 권한 필요)
@host_regist_router.get("/my", response_model=HostRegistResponse)
def get_my_host_regist(
    current_user=Depends(current_user_dependency),
    service: HostRegistService = Depends(get_host_regist_service),
):
    """
    현재 사용자의 호스트 등록 신청 상태를 조회합니다.
    """
    host_regist = service.get_host_regist_by_user_id(current_user.id)
    if not host_regist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="호스트 등록 신청이 존재하지 않습니다."
        )
    return host_regist


# 슈퍼관리자가 모든 호스트 신청을 조회하는 엔드포인트
@host_regist_admin_router.get("", response_model=HostRegistListResponse)
def get_all_host_regists(
    sort_by: str = "id",
    descending: bool = False,
    offset: int = 0,
    limit: int = 100,
    current_user=Depends(super_admin_dependency),
    service: HostRegistService = Depends(get_host_regist_service),
):
    """
    모든 호스트 등록 신청 목록을 조회합니다.
    """
    return service.get_all_host_regists(sort_by, descending, offset, limit)


# 슈퍼관리자가 특정 호스트 신청을 조회하는 엔드포인트
@host_regist_admin_router.get("/{host_regist_id}", response_model=HostRegistResponse)
def get_host_regist(
    host_regist_id: int,
    current_user=Depends(super_admin_dependency),
    service: HostRegistService = Depends(get_host_regist_service),
):
    """
    특정 호스트 등록 신청 정보를 조회합니다.
    """
    return service.get_host_regist(host_regist_id)


# 슈퍼관리자가 호스트 신청 상태를 업데이트하는 엔드포인트
@host_regist_admin_router.put("/{host_regist_id}/state", response_model=HostRegistResponse)
def update_host_regist_state(
    host_regist_id: int,
    state_req: HostRegistStateRequest,
    current_user=Depends(super_admin_dependency),
    service: HostRegistService = Depends(get_host_regist_service),
):
    """
    호스트 등록 신청 상태를 업데이트합니다.
    'ACCEPT'로 변경 시 사용자 역할이 'admin'으로 변경됩니다.
    'REJECT'로 변경 시 사용자 역할이 'user'로 변경됩니다.
    """
    return service.update_host_regist_state(host_regist_id, state_req.state)


# 슈퍼관리자가 호스트 신청을 삭제하는 엔드포인트
@host_regist_admin_router.delete("/{host_regist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_host_regist(
    host_regist_id: int,
    current_user=Depends(super_admin_dependency),
    service: HostRegistService = Depends(get_host_regist_service),
):
    """
    호스트 등록 신청을 삭제합니다.
    """
    service.delete_host_regist(host_regist_id)
    return None

