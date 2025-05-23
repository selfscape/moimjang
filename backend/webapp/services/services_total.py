import uuid
from typing import Optional, List, Union, Dict, Any
from fastapi import status, Response, HTTPException, UploadFile
from sqlalchemy.exc import IntegrityError
from datetime import datetime

import webapp.schemas as schemas
from .common import UserServiceMixin, FileHandlerMixin
from ..repositories import (
    UserRepository,
    ChannelRepository,
    GroupRepository,
    GameRepository,
    ReviewRepository,
    ChannelUserRepository,
    GroupUserRepository,
    NotFoundError,
    BrandRepository,
    QuestionCardCategoryRepository,
    QuestionCardRepository,
    BrandQuestionCardCategoryRepository,
    MinioRepository,
    SurveyRepository,
    ImageRepository,
    BrandReviewRepository,
    LandingPageSettingRepository,
    DocumentRepository,
    HostRegistRepository,
)
from ..schemas import (
    UserResponse,
    ChannelResponse,
    GroupResponse,
    GameResponse,
    ReviewResponse,
    UserJoinChannelResponse,
    GameWithUserResponse,
    BrandResponse,
    BrandWithAllItemsResponse,
    QuestionCardCategoryResponse,
    QuestionCardCategoryWithBrand,
    QuestionCardResponse,
    QuestionCardDecResponse,
    BrandQuestionCardCategoryResponse,
    SurveyFormResponse,
    SurveyResponseResponse,
    ImageResponse,
    BrandReviewUpdate,
    BrandReviewCreate,
    BrandReviewUrlResponse,
    BrandReviewUrlListResponse,
    BrandReviewResponse,
    BrandReviewUploadImageResponse,
    BrandListResponse,
    SurveyResponseRequest,
    ChannelListResponse,
)
from ..enums import SurveyRegistState, BrandState, ChannelState, HostRegistState
from ..models import User as UserModel
from ..models import BrandQuestionCardCategory, QuestionCardCategory, QuestionCard
from ..utils.error_handlers import handle_integrity_error
from ..utils.path_helper import PathHelper
from ..utils.image_utils import safe_image

from ..core.security import (
    get_password_hash,
)
from ..utils.logger_config import configure_logger
from bson import ObjectId

logger = configure_logger()


class UserService(UserServiceMixin):

    def __init__(
        self,
        user_repository: UserRepository,
        channel_user_repository: ChannelUserRepository,
        group_user_repository: GroupUserRepository,
        review_repository: ReviewRepository,
        game_repository: GameRepository,
    ) -> None:
        self._user_repository: UserRepository = user_repository
        self._channel_user_repository: ChannelUserRepository = channel_user_repository
        self._group_user_repository = group_user_repository
        self._review_repository = review_repository
        self._game_repository = game_repository

    def _build_user_response(self, user) -> UserResponse:
        return UserResponse.model_validate(user)

    def get_user(self, user_id: int) -> UserResponse:
        try:
            user = self._user_repository.get_by_id(user_id)
            return self._build_user_response(user)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def create_user(self, user_data: dict, owner_id: int) -> UserResponse:
        # 비밀번호가 포함된 경우, 해싱 후 hashed_password 필드로 변환하고 원래 필드는 제거
        if "password" in user_data:
            password = user_data.pop("password")
            user_data["hashed_password"] = get_password_hash(password)
        
        # 소유자 ID를 사용자 데이터에 추가
        user_data["owner_id"] = owner_id
        
        user = self._user_repository.add(user_data)
        return self._build_user_response(user)

    def update_user(self, user_id: int, user_data: dict) -> Union[UserResponse, None]:
        if "password" in user_data:
            password = user_data.pop("password")
            user_data["hashed_password"] = get_password_hash(password)
        try:
            user = self._user_repository.update(user_id, user_data)
            return self._build_user_response(user)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def delete_user(self, user_id: int) -> Response:
        try:
            # 1. 채널 연관관계 해지: 사용자의 채널 가입 기록 삭제
            channels = self._channel_user_repository.get_channels_by_user(user_id)
            for channel in channels:
                # 채널은 dict 형태로 반환되며 channel_id 키를 포함함
                self._channel_user_repository.remove_user_from_channel(
                    channel["channel_id"], user_id
                )

            # 2. 그룹 연관관계 해지: 사용자의 그룹 가입 기록 삭제
            user_groups = self._group_user_repository.get_groups_by_user(user_id)
            for record in user_groups:
                # record는 dict 형태이며 group_id 키를 포함함
                self._group_user_repository.remove_user_from_group(
                    record["group_id"], user_id
                )

            # 3. 리뷰 데이터 삭제: 사용자가 작성했거나 대상이 된 리뷰 모두 삭제
            self._review_repository.delete_all_by_user(user_id)

            # 4. 게임 데이터 삭제: 사용자가 작성했거나 대상이 된 게임 항목 모두 삭제
            self._game_repository.delete_all_by_user(user_id)

            # 5. 마지막으로 사용자 삭제
            self._user_repository.delete_by_id(user_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def search_users(
        self, name: Optional[str] = None, email: Optional[str] = None
    ) -> list[UserResponse]:
        users = self._user_repository.filter_users(name=name, email=email)
        return [self._build_user_response(user) for user in users]

    def get_users_not_in_group(self, channel_id: int) -> List[UserResponse]:
        users = self._channel_user_repository.get_channel_users_not_in_group(channel_id)
        return [self._build_user_response(user) for user in users]

    def get_all_users_with_count(
        self,
        sort_by: str = "id",
        descending: bool = False,
        offset: int = 0,
        limit: int = 100,        
        owner_id: Optional[int] = None,
    ) -> tuple[list[UserResponse], int]:
        users, total_count = self._user_repository.get_all_with_count(
            sort_by=sort_by, descending=descending, offset=offset, limit=limit, owner_id=owner_id
        )
        return [self._build_user_response(user) for user in users], total_count


class ChannelService(UserServiceMixin):
    def __init__(
        self,
        channel_repository: ChannelRepository,
        channel_user_repository: ChannelUserRepository,
        group_repository: GroupRepository,
        group_user_repository: GroupUserRepository,
        brand_repository: BrandRepository,
        user_repository: UserRepository,  # user_service 대신 user_repository
    ) -> None:
        self._channel_repository = channel_repository
        self._channel_user_repository = channel_user_repository
        self._group_repository = group_repository
        self._group_user_repository = group_user_repository
        self._brand_repository = brand_repository
        self._user_repository = user_repository  # user_service 대신 user_repository

    def _format_channel_response(self, channel) -> ChannelResponse:
        """
        ORM Channel 객체 → ChannelResponse 스키마로 변환합니다.
        - joined_users 조회 및 세팅
        - brand_title 조회 및 세팅
        """
        # 1) joined_users 채우기
        joined = self._channel_user_repository.get_joined_users(channel.id)
        setattr(channel, "joined_users", joined)

        # 2) dict 복사 후 brand_title 세팅
        channel_dict = channel.__dict__.copy()
        try:
            brand = self._brand_repository.get_by_id(channel.brand_id)
            channel_dict["brand_title"] = brand.title if brand else ""
        except NotFoundError:
            channel_dict["brand_title"] = ""

        # 3) joined_users 필드 보장
        if "joined_users" not in channel_dict:
            channel_dict["joined_users"] = []

        return ChannelResponse.model_validate(channel_dict)

    def get_channels(
        self, 
        sort_by: str, 
        descending: bool,        
        brand_id: Optional[int] = None, 
        state: Optional[ChannelState] = None, 
        offset: int = 0, 
        limit: int = 100,    
        owner_id: Optional[int] = None, 
    ) -> ChannelListResponse:
        """채널 목록을 조회합니다."""
        channels, total_count = self._channel_repository.get_all(
            sort_by=sort_by,
            descending=descending,
            brand_id=brand_id,
            channel_state=state,
            offset=offset,
            limit=limit,
            owner_id=owner_id,
        )
        return ChannelListResponse(
            channels=[self._format_channel_response(channel) for channel in channels],
            totalCount=total_count,
        )

    def get_channel(self, channel_id: int) -> ChannelResponse:
        try:
            channel = self._channel_repository.get_by_id(channel_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

        return self._format_channel_response(channel)

    def create_channel(self, channel_data: dict, owner_id: int) -> ChannelResponse:
        # 소유자 ID를 채널 데이터에 추가
        channel_data["owner_id"] = owner_id
        channel = self._channel_repository.add(channel_data)
        return self._format_channel_response(channel)

    def update_channel(self, channel_id: int, channel_data: dict) -> ChannelResponse:
        try:
            channel = self._channel_repository.update(channel_id, channel_data)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        return self._format_channel_response(channel)

    def delete_channel(self, channel_id: int) -> Response:
        """
        채널 및 연관 그룹을 삭제하고 204를 반환합니다.
        """
        groups = self._group_repository.get_by_channel(channel_id)
        for group in groups:
            joined_users = self._group_user_repository.get_joined_users(group.id)
            for u in joined_users:
                self._group_user_repository.remove_user_from_group(group.id, u["id"])
            self._group_repository.delete_by_id(group.id)

        try:
            self._channel_repository.delete_by_id(channel_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    def update_channel_state(self, channel_id: int, state: ChannelState) -> ChannelResponse:
        """
        채널 상태 업데이트 후 joined_users 를 포함한 ChannelResponse 로 반환합니다.
        """
        try:
            channel = self._channel_repository.update_state(channel_id, state)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        return self._format_channel_response(channel)


class ChannelUserService:
    def __init__(self, channel_user_repository: ChannelUserRepository) -> None:
        self._repository = channel_user_repository

    def get_channels_by_user(self, user_id: int) -> List[UserJoinChannelResponse]:
        channels = self._repository.get_channels_by_user(user_id)
        return [UserJoinChannelResponse.model_validate(channel) for channel in channels]

    def add_user_to_channel(self, channel_id: int, user_id: int):
        try:
            # 채널 가입 수행 (ORM 객체를 반환하지만 이후에 join 결과로 대체할 예정)
            self._repository.add_user_to_channel(channel_id, user_id)
            # 해당 사용자의 채널 가입정보를 조회하여 응답 스키마에 맞게 변환합니다.
            channels = self._repository.get_channels_by_user(user_id)
            channel_record = next(
                (
                    record
                    for record in channels
                    if record.get("channel_id") == channel_id
                ),
                None,
            )
            if not channel_record:
                raise HTTPException(
                    status_code=404, detail="채널 가입 정보를 찾을 수 없습니다."
                )
            return UserJoinChannelResponse.model_validate(channel_record)
        except IntegrityError as e:
            handle_integrity_error(
                e,
                duplicate_msg="이미 채널에 가입되어 있습니다.",
                foreign_key_msg="채널을 찾을 수 없습니다.",
            )

    def update_user_channel(
        self, user_id: int, old_channel_id: int, new_channel_id: int
    ):
        # 기존 채널에서 사용자 제거
        self._repository.remove_user_from_channel(old_channel_id, user_id)
        try:
            # 새로운 채널에 사용자 추가
            self._repository.add_user_to_channel(new_channel_id, user_id)
            channels = self._repository.get_channels_by_user(user_id)
            channel_record = next(
                (
                    record
                    for record in channels
                    if record.get("channel_id") == new_channel_id
                ),
                None,
            )
            if not channel_record:
                raise HTTPException(
                    status_code=404, detail="새로운 채널 가입 정보를 찾을 수 없습니다."
                )
            return UserJoinChannelResponse.model_validate(channel_record)
        except IntegrityError as e:
            error_message = str(e)
            if "duplicate key value violates unique constraint" in error_message:
                raise HTTPException(
                    status_code=400, detail="이미 채널에 가입되어 있습니다."
                )
            elif "violates foreign key constraint" in error_message:
                raise HTTPException(status_code=404, detail="채널을 찾을 수 없습니다.")
            else:
                raise HTTPException(status_code=500, detail="Internal Server Error")

    def remove_user_from_channel(self, channel_id: int, user_id: int):
        try:
            self._repository.remove_user_from_channel(channel_id, user_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def get_users_by_channel(self, channel_id: int) -> list:
        return self._repository.get_users_by_channel(channel_id)

    def get_user_channel(
        self, user_id: int, channel_id: int
    ) -> UserJoinChannelResponse:
        channels = self._repository.get_channels_by_user(user_id)
        join_record = next(
            (item for item in channels if item["channel_id"] == channel_id), None
        )
        if not join_record:
            raise HTTPException(
                status_code=404, detail="가입 정보가 존재하지 않습니다."
            )
        return UserJoinChannelResponse.model_validate(join_record)


class GroupService(UserServiceMixin):
    def __init__(
        self,
        group_repository: GroupRepository,
        group_user_repository: GroupUserRepository,
        game_repository: GameRepository,
        user_repository: UserRepository,  # user_service 대신 user_repository
    ) -> None:
        self._repository = group_repository
        self._group_user_repository = group_user_repository
        self._game_repository = game_repository
        self._user_repository = user_repository  # user_service 대신 user_repository

    def get_all_groups(
        self, 
        sort_by: str = "id",         
        descending: bool = False,
        owner_id: Optional[int] = None,
    ) -> List[GroupResponse]:
        groups = self._repository.get_all(sort_by=sort_by, descending=descending, owner_id=owner_id)
        result = []
        for group in groups:
            group_dict = group.__dict__.copy()
            # 조인테이블(GroupUserRepository)을 통해 가입 유저 조회
            group_dict["joined_users"] = self._group_user_repository.get_joined_users(group.id)  # type: ignore
            result.append(GroupResponse.model_validate(group_dict))
        return result

    def get_group(self, group_id: int) -> GroupResponse:
        try:
            group = self._repository.get_by_id(group_id)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        group_dict = group.__dict__.copy()
        group_dict["joined_users"] = self._group_user_repository.get_joined_users(group.id)  # type: ignore
        return GroupResponse.model_validate(group_dict)

    def get_groups_by_filter(
        self, user_id: Optional[int] = None, channel_id: Optional[int] = None
    ) -> List[GroupResponse]:
        if user_id is not None and channel_id is not None:
            # user_id와 channel_id가 모두 제공된 경우 AND 조건으로 필터링
            group_list = self._repository.get_by_filtered(channel_id, user_id)
        elif user_id is not None:
            # user_id만 제공된 경우 기존 방식 사용
            user_groups = self._group_user_repository.get_groups_by_user(user_id)
            group_list = [
                self._repository.get_by_id(record["group_id"]) for record in user_groups
            ]
        elif channel_id is not None:
            # channel_id만 제공된 경우 그룹 조회
            group_list = self._repository.get_by_channel(channel_id)
        else:
            raise HTTPException(
                status_code=400,
                detail="user_id 혹은 channel_id 중 하나를 제공해주세요.",
            )

        groups = []
        for grp in group_list:
            grp_dict = grp.__dict__.copy()
            grp_dict["joined_users"] = self._group_user_repository.get_joined_users(grp.id)  # type: ignore
            groups.append(GroupResponse.model_validate(grp_dict))
        return groups

    def create_group(self, group_data: dict, owner_id: int) -> GroupResponse:
        # 소유자 ID를 그룹 데이터에 추가
        group_data["owner_id"] = owner_id
        
        grp = self._repository.add(group_data)
        grp_dict = grp.__dict__.copy()
        grp_dict["joined_users"] = []  # 생성 시 가입 유저는 없음
        return GroupResponse.model_validate(grp_dict)

    def update_group(self, group_id: int, group_data: dict) -> GroupResponse:
        try:
            grp = self._repository.update(group_id, group_data)
            grp_dict = grp.__dict__.copy()
            grp_dict["joined_users"] = self._group_user_repository.get_joined_users(grp.id)  # type: ignore
            return GroupResponse.model_validate(grp_dict)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def delete_group(self, group_id: int) -> Response:
        # 1. 해당 그룹에 가입된 모든 사용자 연관 정보 삭제
        joined_users = self._group_user_repository.get_joined_users(group_id)
        for user_relation in joined_users:
            self._group_user_repository.remove_user_from_group(
                group_id, user_relation["id"]
            )

        # 2. 해당 그룹에 관련된 모든 게임 삭제
        games = self._game_repository.get_by_group(group_id)  # 그룹에 관련된 게임 조회
        for game in games:
            self._game_repository.delete_by_id(game.id)  # type: ignore

        # 3. 그룹 삭제 수행
        try:
            self._repository.delete_by_id(group_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))


class GroupUserService:
    def __init__(self, group_user_repository: GroupUserRepository) -> None:
        self._repository = group_user_repository

    def get_groups_by_user(self, user_id: int) -> list:
        return self._repository.get_groups_by_user(user_id)

    def add_user_to_group(self, group_id: int, user_id: int):
        try:
            return self._repository.add_user_to_group(group_id, user_id)
        except IntegrityError as e:
            handle_integrity_error(
                e,
                duplicate_msg="이미 그룹에 가입되어 있습니다.",
                foreign_key_msg="그룹을 찾을 수 없습니다.",
            )

    def update_user_group(self, user_id: int, old_group_id: int, new_group_id: int):
        self._repository.remove_user_from_group(old_group_id, user_id)
        try:
            return self._repository.add_user_to_group(new_group_id, user_id)
        except IntegrityError as e:
            error_message = str(e)
            if "duplicate key value violates unique constraint" in error_message:
                raise HTTPException(
                    status_code=400, detail="이미 그룹에 가입되어 있습니다."
                )
            elif "violates foreign key constraint" in error_message:
                raise HTTPException(status_code=404, detail="그룹을 찾을 수 없습니다.")
            else:
                raise HTTPException(status_code=500, detail="Internal Server Error")

    def remove_user_from_group(self, group_id: int, user_id: int):
        try:
            self._repository.remove_user_from_group(group_id, user_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))


class GameService:
    def __init__(
        self,
        game_repository: GameRepository,
        user_repository: UserRepository,
        group_repository: GroupRepository,
    ) -> None:
        self._repository = game_repository
        self._user_repository = user_repository
        self._group_repository = group_repository

    def get_all_games(self) -> list[GameResponse]:
        games = self._repository.get_all()
        return [GameResponse.model_validate(g) for g in games]

    def get_game(self, game_id: int) -> GameResponse:
        try:
            game = self._repository.get_by_id(game_id)
            return GameResponse.model_validate(game)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def create_game(self, game_data: dict, owner_id: int) -> GameResponse:
        # 소유자 ID를 게임 데이터에 추가
        game_data["owner_id"] = owner_id
        
        game = self._repository.add(game_data)
        return GameResponse.model_validate(game)

    def update_game(self, game_id: int, game_data: dict) -> GameResponse:
        try:
            game = self._repository.update(game_id, game_data)
            return GameResponse.model_validate(game)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def delete_game(self, game_id: int) -> Response:
        try:
            self._repository.delete_by_id(game_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def get_games_by_filter(
        self, group_id: int, user_id: Optional[int] = None
    ) -> list[GameResponse]:
        games = self._repository.get_by_filtered(group_id, user_id)
        return [GameResponse.model_validate(game) for game in games]

    def create_game_pairs(
        self, group_id: int, pointed_users: List[List[int]]
    ) -> list[GameResponse]:
        created_games = []
        for pair in pointed_users:
            # 각 pair는 반드시 2개의 사용자 id([origin, point])를 포함해야 함
            if len(pair) != 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="각 pair는 정확히 2개의 사용자 id를 포함해야 합니다.",
                )
            game_data = {
                "group_id": group_id,
                "user_id": pair[0],
                "matched_user_id": pair[1],
            }
            game = self._repository.add(game_data)
            created_games.append(game)
        return [GameResponse.model_validate(game) for game in created_games]

    def get_games_by_user(
        self, user_id: int, channel_id: Optional[int] = None
    ) -> List[GameResponse]:
        games = self._repository.get_by_user(user_id)
        if channel_id is not None:
            groups = self._group_repository.get_by_filtered(channel_id, user_id)
            games = [game for game in games if game.group_id in [group.id for group in groups]]  # type: ignore
        return [GameResponse.model_validate(game) for game in games]

    def get_games_by_user_with_matched_user(
        self, user_id: int, channel_id: Optional[int] = None
    ) -> List[GameWithUserResponse]:
        games = self._repository.get_by_user(user_id)
        if channel_id is not None:
            groups = self._group_repository.get_by_filtered(channel_id, user_id)
            games = [game for game in games if game.group_id in [group.id for group in groups]]  # type: ignore
        game_responses = []
        for game in games:
            matched_user = self._user_repository.get_by_id(game.matched_user_id)  # type: ignore
            game_response = GameWithUserResponse(
                game=GameResponse.model_validate(game),
                matched_user=UserResponse.model_validate(matched_user),
            )
            game_responses.append(game_response)
        return game_responses


class ReviewService(UserServiceMixin):
    def __init__(
        self, review_repository: ReviewRepository, user_repository: UserRepository
    ) -> None:
        self._repository = review_repository
        self._user_repository = user_repository

    def _augment_review(self, review_obj) -> dict:
        """
        리뷰 객체(review_obj)를 딕셔너리로 복사한 후,
        리뷰의 target_user_id로 사용자 정보를 조회하여
        target_user_gender 와 target_user_name 필드를 추가합니다.
        """
        review_data = review_obj.__dict__.copy()
        try:
            reviewer_user = self._user_repository.get_by_id(
                review_data["reviewer_user_id"]
            )
        except NotFoundError as e:
            raise HTTPException(
                status_code=404, detail=f"리뷰어 유저를 찾을 수 없습니다: {str(e)}"
            )
        review_data["reviewer_user_gender"] = reviewer_user.gender
        review_data["reviewer_user_name"] = reviewer_user.username
        return review_data

    def get_all_reviews(self) -> list[ReviewResponse]:
        reviews = self._repository.get_all()
        return [
            ReviewResponse.model_validate(self._augment_review(review))
            for review in reviews
        ]

    def get_review(self, review_id: int) -> ReviewResponse:
        try:
            review = self._repository.get_by_id(review_id)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        return ReviewResponse.model_validate(self._augment_review(review))


    def create_review_with_owner(self, review_data: dict, owner_id: Union[int, None]) -> ReviewResponse:
        '''
        소유자 ID를 리뷰 데이터에 추가합니다.
        소유자 ID가 제공되지 않으면 리뷰어의 ID를 사용합니다.
        '''
        if owner_id is None:
            review_data["owner_id"] = review_data["reviewer_user_id"]
        else:
            review_data["owner_id"] = owner_id
        
        review = self._repository.add(review_data)
        return ReviewResponse.model_validate(self._augment_review(review))

    def update_review(self, review_id: int, review_data: dict) -> ReviewResponse:
        try:
            review = self._repository.update(review_id, review_data)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))
        return ReviewResponse.model_validate(self._augment_review(review))

    def delete_review(self, review_id: int):
        try:
            self._repository.delete_by_id(review_id)
            from fastapi import Response
            from fastapi import status

            return Response(status_code=status.HTTP_204_NO_CONTENT)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def get_reviews_by_channel(
        self, channel_id: int, target_user_id: Optional[int] = None
    ) -> List[ReviewResponse]:
        reviews = self._repository.get_by_channel(channel_id, target_user_id)
        return [
            ReviewResponse.model_validate(self._augment_review(review))
            for review in reviews
        ]

    def get_reviews_by_target_user(
        self, user_id: int, channel_id: Optional[int] = None
    ) -> List[ReviewResponse]:
        if channel_id is not None:
            reviews = self._repository.get_by_channel(
                channel_id, target_user_id=user_id
            )
        else:
            reviews = self._repository.get_by_target_user(user_id)
        return [
            ReviewResponse.model_validate(self._augment_review(review))
            for review in reviews
        ]

    def get_reviews_by_filter(
        self, channel_id: int, target_user_id: Optional[int] = None
    ) -> List[ReviewResponse]:
        reviews = self._repository.get_by_filtered(channel_id, target_user_id)
        return [
            ReviewResponse.model_validate(self._augment_review(review))
            for review in reviews
        ]


class BrandService(FileHandlerMixin, UserServiceMixin):
    def __init__(
        self,
        brand_repository: BrandRepository,
        minio_repository: MinioRepository,
        brand_qcc_repo: BrandQuestionCardCategoryRepository,
        channel_repository: ChannelRepository,
        image_repository: ImageRepository,
        user_repository: UserRepository,  # user_service 대신 user_repository
    ) -> None:
        self._repository = brand_repository
        self._minio_repository = minio_repository
        self._brand_qcc_repo = brand_qcc_repo
        self._channel_repository = channel_repository
        self._image_repository = image_repository
        self._user_repository = user_repository  # user_service 대신 user_repository

    def _get_image_response(self, image) -> Optional[ImageResponse]:
        if image is None:
            return None
        return ImageResponse(
            id=image.id,
            url=self._resolve_url(safe_image(image).path)
        )

    def _format_brand_response(self, brand) -> BrandResponse:                
        brand_dict = brand.__dict__.copy()
        brand_dict["thumbnailImage"] = self._transfrom_image_path_to_url(brand.thumbnail_image)
        brand_dict["detailImages"] = [self._transfrom_image_path_to_url(image) for image in brand.detail_images]
        return BrandResponse.model_validate(brand_dict)

    def get_all_brands(
        self, 
        state: Optional[BrandState] = None, 
        sort_by: str = "id", 
        descending: bool = False, 
        offset: int = 0, 
        limit: int = 100,
        owner_id: Optional[int] = None,
    ) -> BrandListResponse:
        brands, total_count = self._repository.get_all_with_count(
            state=state, 
            sort_by=sort_by, 
            descending=descending, 
            offset=offset, 
            limit=limit,
            owner_id=owner_id
        )
        return BrandListResponse(
            brands=[self._format_brand_response(brand) for brand in brands],
            totalCount=total_count,
        )
    

    def _get_allocated_question_card_dec_list(self, brand_id: int) -> List[dict]:
        # 브랜드에 연결된 카드덱(카테고리)와 그에 소속된 카드들을 조회하는 예시 구현
        with self._brand_qcc_repo.session_factory() as session:

            links = (
                session.query(BrandQuestionCardCategory)
                .filter(BrandQuestionCardCategory.brandId == brand_id)
                .all()
            )
            allocated = []
            for link in links:
                category = (
                    session.query(QuestionCardCategory)
                    .filter(QuestionCardCategory.id == link.questionCardCategoryId)
                    .first()
                )
                if category:
                    cards = (
                        session.query(QuestionCard)
                        .filter(QuestionCard.cardCategoryId == category.id)
                        .all()
                    )
                    card_list = []
                    for card in cards:
                        card_dict = card.__dict__.copy()
                        card_dict["image"] = ImageResponse(
                            id=safe_image(card.image).id,
                            url=self._resolve_url(safe_image(card.image).path)
                        )
                        card_list.append(QuestionCardResponse.model_validate(card_dict))
                    category_dict = category.__dict__.copy()
                    category_dict["coverImage"] = ImageResponse(
                        id=safe_image(category.cover_image).id,
                        url=self._resolve_url(safe_image(category.cover_image).path)
                    )
                    dec = QuestionCardDecResponse.model_validate(
                        {
                            **QuestionCardCategoryResponse.model_validate(
                                category_dict
                            ).dict(),
                            "questionCardList": [card.dict() for card in card_list],
                        }
                    )
                    allocated.append(dec)
            return allocated

    def get_brand(self, brand_id: int) -> BrandResponse:
        brand = self._repository.get_by_id(brand_id)        
        return self._format_brand_response(brand)

    def create_brand(self, brand_data: dict, owner_id: int) -> BrandResponse:
        # 소유자 ID를 브랜드 데이터에 추가
        brand_data["owner_id"] = owner_id
        
        brand = self._repository.add(brand_data)
        return BrandResponse.model_validate(brand)

    def create_brand_with_file(self, brand_data: dict, file: UploadFile) -> BrandResponse:
        """
        브랜드 생성 후, file이 제공되면 파일 업로드로 생성된 이미지 레코드를 사용하여
        thumbnail_image_id를 업데이트합니다.
        """
        brand = self._repository.add(brand_data)
        if file:
            new_thumbnail_path = self.upload_and_replace_file(
                file,
                lambda id, image_id, filename: PathHelper.generate_brand_thumbnail_path(brand.title, image_id, filename),  # type: ignore
                brand.id,  # type: ignore
                None
            )
            # 이미지 레코드를 생성하고, 해당 id를 FK로 업데이트
            image = self._image_repository.add(path=new_thumbnail_path)
            self._repository.update(brand.id, {"thumbnail_image_id": image.id})  # type: ignore
        return self.get_brand(brand.id)  # type: ignore 

    def update_brand(self, brand_id: int, brand_data: dict) -> BrandResponse:
        """
        브랜드 상세 정보를 수정하고, 업데이트된 브랜드 정보를 반환합니다.
        """
        brand = self._repository.update(brand_id, brand_data)
        return self.get_brand(brand.id)  # type: ignore

    def update_brand_with_file(self, brand_id: int, brand_data: dict, file: UploadFile) -> BrandResponse:
        """
        브랜드 수정 후, file이 제공되면 기존 이미지 삭제 후 새로운 이미지 레코드를 생성하여 업데이트합니다.
        """
        self._repository.update(brand_id, brand_data)
        if file:
            brand = self._repository.get_by_id(brand_id)
            new_thumbnail_path = self.upload_and_replace_file(
                file,
                lambda id, image_id, filename: PathHelper.generate_brand_thumbnail_path(brand.title, image_id, filename),  # type: ignore
                brand_id,
                safe_image(brand.thumbnail_image).path if brand.thumbnail_image else None
            )
            image = self._image_repository.add(path=new_thumbnail_path)
            self._repository.update(brand_id, {"thumbnail_image_id": image.id})
        return self.get_brand(brand_id)

    def delete_brand(self, brand_id: int) -> None:
        channels = self._channel_repository.get_by_brand_id(brand_id)
        if channels:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="브랜드와 연관된 채널이 존재하여 삭제할 수 없습니다."
            )

        try:
            links = self._brand_qcc_repo.get_links_by_brand(brand_id)
            for link in links:
                self._brand_qcc_repo.delete_link(link.brandId, link.questionCardCategoryId)
        except Exception as e:
            logger.error(f"브랜드와 연결된 관계 삭제 실패: {e}")

        # 1. 썸네일 삭제
        brand = self._repository.get_by_id(brand_id)
        if brand.thumbnail_image:
            try:
                self._minio_repository.delete_file(brand.thumbnail_image.path)
            except Exception as e:
                logger.error(f"브랜드 썸네일 삭제 실패: {brand.thumbnail_image.path}, {e}")

        # 2. detail 이미지 일괄 삭제
        for image in brand.detail_images:  # type: ignore
            try:
                self._minio_repository.delete_file(image.path)
            except Exception as e:
                logger.error(f"브랜드 상세 이미지 삭제 실패: {image.path}, {e}")
            # self._image_repository.delete_image(image.id) 

        # 3. 브랜드 자체 삭제
        try:
            self._repository.delete_by_id(brand_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    def delete_detail_image(self, brand_id: int, image_id: int) -> Response:
        """
        단일 detail image 삭제.
        S3 파일 삭제 → DB 레코드 삭제 → 204 반환
        """
        # 1. 이미지 존재 및 소속 브랜드 확인
        image = self._image_repository.get_image_by_id(image_id)
        if image.brand_id != brand_id: # type: ignore
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="이미지를 찾을 수 없습니다.")

        # 2. S3 삭제
        try:
            self._minio_repository.delete_file(str(image.path))
        except Exception as e:
            logger.error(f"상세 이미지 S3 삭제 실패: {image.path}, {e}")

        # 3. DB 레코드 삭제
        self._image_repository.delete_image(image_id)

        return Response(status_code=status.HTTP_204_NO_CONTENT)

    def upload_thumbnail(self, brand_id: int, file: UploadFile) -> ImageResponse:
        """
        브랜드의 thumbnail 이미지를 업로드하거나 교체합니다.
        """

        try:
            brand = self._repository.get_by_id(brand_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

        old_path = brand.thumbnail_image.path if brand.thumbnail_image else None
        new_path = self.upload_and_replace_file(
            file,
            PathHelper.generate_brand_thumbnail_path,
            brand_id,
            old_path
        )
        # 기존 이미지 레코드 삭제
        if brand.thumbnail_image:
            try:
                self._image_repository.delete_image(brand.thumbnail_image.id)
            except Exception:
                pass

        # 새 이미지 레코드 생성 및 브랜드에 연결
        image = self._image_repository.add(path=new_path)
        self._repository.update(brand_id, {"thumbnail_image_id": image.id})
        image_response = self._get_image_response(image)
        if image_response:
            return image_response
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="이미지 레코드 생성 실패")

    def upload_detail_image(self, brand_id: int, file: UploadFile) -> schemas.ImageResponse:
        """
        브랜드의 상세 이미지(detailImages)를 단일 업로드합니다.
        - 이미지를 S3에 저장하고 DB에 레코드를 추가합니다.
        - 업로드된 이미지의 URL 형태로 반환합니다.
        """
        # 1) 브랜드 존재 여부 확인
        try:
            brand = self._repository.get_by_id(brand_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

        # 2) 파일 업로드 (S3) 및 경로 생성
        new_path = self.handle_file_upload(
            file,
            PathHelper.generate_brand_detail_image_path,
            brand_id
        )

        # 3) DB 이미지 레코드 생성 (brand_id FK로 연결)
        image = self._image_repository.add(path=new_path, brand_id=brand_id)

        # 4) 업로드된 개별 이미지 정보만 반환
        return self._transfrom_image_path_to_url(image)

    def update_brand_state(self, brand_id: int, state: BrandState) -> BrandResponse:
        self._repository.update_state(brand_id, state)
        return self.get_brand(brand_id)


class QuestionCardCategoryService(FileHandlerMixin, UserServiceMixin):
    def __init__(
        self,
        category_repository: QuestionCardCategoryRepository,
        minio_repository: MinioRepository,
        question_card_repo: QuestionCardRepository,
        brand_qcc_repo: BrandQuestionCardCategoryRepository,
        image_repository: ImageRepository,
        user_repository: UserRepository,  # user_service 대신 user_repository
    ) -> None:
        self._repository = category_repository
        self._minio_repository = minio_repository
        self._question_card_repo = question_card_repo
        self._brand_qcc_repo = brand_qcc_repo
        self._image_repository = image_repository
        self._user_repository = user_repository  # user_service 대신 user_repository

    def _get_image_response(self, image) -> Optional[ImageResponse]:
        if image is None:
            return None
        return ImageResponse(
            id=image.id,
            url=self._resolve_url(safe_image(image).path)
        )

    def get_all_categories(
        self,
        owner_id: Optional[int] = None,
    ) -> List[QuestionCardCategoryResponse]:
        categories = self._repository.get_all(owner_id=owner_id)
        response = []
        for category in categories:
            data = category.__dict__.copy()
            data["coverImage"] = self._get_image_response(category.cover_image)
            response.append(QuestionCardCategoryResponse.model_validate(data))
        return response

    def get_category(self, category_id: int) -> QuestionCardCategoryResponse:
        category = self._repository.get_by_id(category_id)
        data = category.__dict__.copy()
        data["coverImage"] = self._get_image_response(category.cover_image)
        return QuestionCardCategoryResponse.model_validate(data)

    def create_category(self, category_data: dict, owner_id: int) -> QuestionCardCategoryResponse:
        # 소유자 ID를 카테고리 데이터에 추가
        category_data["owner_id"] = owner_id
        
        category = self._repository.add(category_data)
        return QuestionCardCategoryResponse.model_validate(category.__dict__)

    def update_category(
        self, category_id: int, category_data: dict
    ) -> QuestionCardCategoryResponse:
        # update 시에도 이미지 관련 처리는 제외
        category = self._repository.update(category_id, category_data)
        data = category.__dict__.copy()
        data["coverImage"] = self._get_image_response(category.cover_image)
        return QuestionCardCategoryResponse.model_validate(data)

    # 신규 API: 카테고리 커버 이미지 업로드 (기존 이미지가 있다면 삭제 후 업로드)
    def upload_category_image(
        self, category_id: int, file: UploadFile
    ) -> QuestionCardCategoryResponse:
        category = self._repository.get_by_id(category_id)
        new_cover_path = self.upload_and_replace_file(
            file,
            PathHelper.generate_question_card_category_cover_image_path,
            category_id,
            safe_image(category.cover_image).path,
        )
        # 기존 업로드된 파일이 있다면 Image 레코드 삭제
        if category.cover_image:
            self._image_repository.delete_image(category.cover_image.id)
            
        # 신규 업로드된 파일에 대해 Image 레코드를 생성합니다.
        image = self._image_repository.add(path=new_cover_path)
        
        # 기존 카테고리 테이블에 새 이미지 레코드(FK)를 반영합니다.
        self._repository.update(category_id, {"cover_image_id": image.id})
        return self.get_category(category_id)

    # 수정된 delete_category 메서드: FK로 연결된 질문 카드까지 조회하여 삭제
    def delete_category(self, category_id: int) -> None:
        # 1. 해당 카테고리에 속한 질문 카드들을 조회하여 삭제 처리
        cards = self._question_card_repo.get_all_by_category(category_id)
        for card in cards:
            # 질문 카드 이미지가 존재하면 삭제 (S3상의 파일 삭제)
            if card.image:
                try:
                    self._minio_repository.delete_file(safe_image(card.image).path)  # type: ignore
                except Exception as e:
                    logger.error(
                        f"질문 카드 이미지 삭제 실패: {safe_image(card.image).path}, {e}"
                    )
            # 질문 카드 DB 레코드 삭제
            self._question_card_repo.delete_by_id(card.id)  # type: ignore

        # 2. 카테고리와 연결된 브랜드 연관 관계(다대다 링크) 제거
        try:
            self._brand_qcc_repo.delete_links_by_category(category_id)
        except Exception as e:
            logger.error(f"카테고리 연관 링크 삭제 실패: {e}")

        # 3. 카테고리 커버 이미지 삭제
        category = self._repository.get_by_id(category_id)
        if category.cover_image:
            try:
                self._minio_repository.delete_file(safe_image(category.cover_image).path)
            except Exception as e:
                logger.error(
                    f"카테고리 커버 이미지 삭제 실패: {safe_image(category.cover_image).path}, {e}"
                )
        # 4. 카테고리 자체 삭제
        self._repository.delete_by_id(category_id)


class QuestionCardService(FileHandlerMixin):
    def __init__(self, card_repository: QuestionCardRepository, minio_repository, image_repository: ImageRepository):
        self._repository = card_repository
        self._minio_repository = minio_repository
        self._image_repository = image_repository

    def get_cards_by_category(self, category_id: int) -> List[QuestionCardResponse]:
        cards = self._repository.get_all_by_category(category_id)
        response = []
        for card in cards:
            data = card.__dict__.copy()
            data["image"] = self._transfrom_image_path_to_url(card.image)
            response.append(QuestionCardResponse.model_validate(data))
        return response

    def get_card(self, card_id: int) -> QuestionCardResponse:
        card = self._repository.get_by_id(card_id)
        data = card.__dict__.copy()
        data["image"] = self._transfrom_image_path_to_url(card.image)
        return QuestionCardResponse.model_validate(data)

    def create_card(self, card_data: dict) -> QuestionCardResponse:
        card = self._repository.add(card_data)
        return QuestionCardResponse.model_validate(card.__dict__)

    def update_card(self, card_id: int, card_data: dict) -> QuestionCardResponse:
        card = self._repository.update(card_id, card_data)
        data = card.__dict__.copy()
        data["image"] = self._transfrom_image_path_to_url(card.image)
        return QuestionCardResponse.model_validate(data)

    def upload_card_image_with_replacement(self, card_id: int, file: UploadFile) -> QuestionCardResponse:
        card = self._repository.get_by_id(card_id)
        new_image_path = self.upload_and_replace_file(
            file,
            PathHelper.generate_question_card_image_path,
            card_id,
            safe_image(card.image).path if card.image else None
        )
        # 이미지 레코드를 생성하고, 해당 id로 FK 업데이트
        image = self._image_repository.add(path=new_image_path)
        updated_card = self._repository.update(card_id, {"image_id": image.id})
        data = updated_card.__dict__.copy()
        data["image"] = self._transfrom_image_path_to_url(updated_card.image)
        return QuestionCardResponse.model_validate(data)

    def delete_card(self, card_id: int) -> None:
        card = self._repository.get_by_id(card_id)
        if card.image:
            try:
                self._minio_repository.delete_file(safe_image(card.image).path)
            except Exception as e:
                logger.error(f"질문 카드 이미지 삭제 실패: {safe_image(card.image).path}, {e}")
        self._repository.delete_by_id(card_id)


class BrandQuestionCardCategoryService(FileHandlerMixin):
    def __init__(
        self,
        brand_qcc_repo: BrandQuestionCardCategoryRepository,
        question_card_category_repo: QuestionCardCategoryRepository,
        question_card_repo: QuestionCardRepository,
        brand_repository: BrandRepository,
        minio_repository: MinioRepository,
    ):
        self._brand_qcc_repo = brand_qcc_repo
        self._question_card_category_repo = question_card_category_repo
        self._question_card_repo = question_card_repo
        self._brand_repository = brand_repository
        self._minio_repository = minio_repository

    def add_link(
        self, brand_id: int, category_id: int
    ) -> BrandQuestionCardCategoryResponse:
        with self._brand_qcc_repo.session_factory() as session:
            link = BrandQuestionCardCategory(
                brandId=brand_id, questionCardCategoryId=category_id
            )
            session.add(link)
            session.commit()
            session.refresh(link)
            return BrandQuestionCardCategoryResponse.model_validate(link.__dict__)

    def get_link(
        self, brand_id: int, category_id: int
    ) -> BrandQuestionCardCategoryResponse:
        with self._brand_qcc_repo.session_factory() as session:
            link = (
                session.query(BrandQuestionCardCategory)
                .filter(
                    BrandQuestionCardCategory.brandId == brand_id,
                    BrandQuestionCardCategory.questionCardCategoryId == category_id,
                )
                .first()
            )
            if not link:
                raise NotFoundError(
                    f"Link for Brand {brand_id} and Category {category_id} not found."
                )
            return BrandQuestionCardCategoryResponse.model_validate(link.__dict__)

    def delete_link(self, brand_id: int, category_id: int) -> None:
        with self._brand_qcc_repo.session_factory() as session:
            link = (
                session.query(BrandQuestionCardCategory)
                .filter(
                    BrandQuestionCardCategory.brandId == brand_id,
                    BrandQuestionCardCategory.questionCardCategoryId == category_id,
                )
                .first()
            )
            if not link:
                raise NotFoundError(
                    f"Link for Brand {brand_id} and Category {category_id} not found."
                )
            session.delete(link)
            session.commit()

    def get_category_list_by_brand(self, brand_id: int) -> list[QuestionCardCategoryResponse]:
        """
        주어진 브랜드(brand_id)에 연결된 질문 카드 카테고리 목록만 반환합니다.
        """
        links = self._brand_qcc_repo.get_links_by_brand(brand_id)
        categories = []
        for link in links:
            try:
                # repository를 통해 카테고리 조회 (존재하지 않는 경우 건너뜀)
                category = self._question_card_category_repo.get_by_id(link.questionCardCategoryId)
            except NotFoundError:
                continue
            category_dict = category.__dict__.copy()

            category_dict["coverImage"] = ImageResponse(
                id=category.cover_image.id,
                url=self._resolve_url(safe_image(category.cover_image).path)
            )
            categories.append(QuestionCardCategoryResponse.model_validate(category_dict))
        return categories

    def get_categories_by_brand(self, brand_id: int) -> QuestionCardCategoryWithBrand:
        """
        주어진 브랜드에 대한 정보와 질문 카드 카테고리 목록을 합쳐서 반환합니다.
        get_category_list_by_brand 메서드를 활용하여 카테고리 목록만 재사용합니다.
        """
        brand = self._brand_repository.get_by_id(brand_id)
        categories = self.get_category_list_by_brand(brand_id)
        return QuestionCardCategoryWithBrand(
            brandId=brand.id,  # type: ignore
            brandTitle=brand.title,  # type: ignore
            brandThumbnailUrl=self._resolve_url(safe_image(brand.thumbnail_image).path),  # type: ignore
            cardCategories=categories,
        )

    # 브랜드에 연결된 질문 카드 카테고리와 해당 카드들을 조회하는 메서드
    def get_cards_by_brand(self, brand_id: int) -> BrandWithAllItemsResponse:
        # repository에 구현된 메서드를 사용하여 브랜드와 연결된 링크 목록을 조회합니다.
        links = self._brand_qcc_repo.get_links_by_brand(brand_id)
        allocated = []
        for link in links:
            try:
                category = self._question_card_category_repo.get_by_id(link.questionCardCategoryId)  # type: ignore
            except NotFoundError:
                continue  # 해당 카테고리가 없으면 건너뜁니다.
            cards = self._question_card_repo.get_all_by_category(category.id)  # type: ignore
            card_list = []
            for card in cards:
                card_dict = card.__dict__.copy()
                card_dict["image"] = ImageResponse(
                    id=safe_image(card.image).id,
                    url=self._resolve_url(safe_image(card.image).path)
                )
                card_list.append(QuestionCardResponse.model_validate(card_dict))
            category_dict = category.__dict__.copy()
            category_dict["coverImage"] = ImageResponse(
                id=safe_image(category.cover_image).id,
                url=self._resolve_url(safe_image(category.cover_image).path)
            )
            dec = QuestionCardDecResponse.model_validate(
                {
                    **QuestionCardCategoryResponse.model_validate(category_dict).dict(),
                    "questionCardList": [card.dict() for card in card_list],
                }
            )
            allocated.append(dec)
        # 브랜드 기본 정보를 조회하고, allocated 질문 카드 덱 리스트를 포함하여 응답 스키마를 구성합니다.
        brand = self._brand_repository.get_by_id(brand_id)
        brand_dict = brand.__dict__.copy()
        brand_dict["thumbnailImage"] = ImageResponse(
            id=safe_image(brand.thumbnail_image).id,
            url=self._resolve_url(safe_image(brand.thumbnail_image).path)
        )
        result_dict = {
            **BrandResponse.model_validate(brand_dict).dict(),
            "allocatedQuestionCardDecList": [dec.dict() for dec in allocated],
        }
        return BrandWithAllItemsResponse.model_validate(result_dict)


class SurveyService:
    def __init__(self, survey_repository: SurveyRepository):
        self._survey_repository = survey_repository

    def get_survey_by_id(self, survey_id: int) -> Union[SurveyFormResponse, None]:
        survey = self._survey_repository.get_survey_by_id(survey_id)
        if survey is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
        return survey
    
    def get_survey_form_by_brand(self, brand_id: int) -> SurveyFormResponse:
        survey = self._survey_repository.get_survey_by_brand(brand_id)
        if survey is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
        return survey

    def create_survey_response(self, data: dict) -> SurveyResponseResponse:
        try:
            dto = SurveyResponseRequest.model_validate(data)
            created = self._survey_repository.add_survey_response(dto.model_dump())
            return created
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    def update_survey_response(self, response_id: int, update_data: dict) -> SurveyResponseResponse:
        try:
            updated = self._survey_repository.update_survey_response(response_id, update_data)
            return updated
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    def create_survey(self, brand_id: int, owner_id: int) -> int:
        survey = self._survey_repository.create_survey(brand_id)
        return survey.id

    def update_survey(self, survey_id: int, update_data: dict) -> SurveyFormResponse:
        try:
            return self._survey_repository.update_survey(survey_id, update_data)            
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    def add_survey_questions(self, survey_id: int) -> SurveyFormResponse:
        """
        설문 문항 생성 시 클라이언트 요청 데이터 대신 로컬 파일(data/jjin_f_gathering_questions.json)을 참조하여
        survey_question을 생성하고, 설문과 연결합니다.
        """
        try:
            import json
            from pathlib import Path

            file_path = Path("data/jjin_f_gathering_questions.json")
            with file_path.open("r", encoding="utf-8") as f:
                questions_data = json.load(f)
                
            survey = self._survey_repository.add_survey_questions(survey_id, questions_data)
            return survey
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


class SurveyFormService(FileHandlerMixin):
    def __init__(self, minio_repository):
        """
        minio_repository를 주입받아 파일 업로드 기능에 활용합니다.
        """
        self._minio_repository = minio_repository

    def upload_survey_form_image(self, file: UploadFile) -> dict:
        """
        설문 양식 이미지를 업로드하고, 업로드된 이미지의 object key와 presigned URL을 반환합니다.
        """
        new_image_path = self.handle_file_upload(
            file,
            lambda dummy, image_id, filename: PathHelper.generate_survey_form_image_path(image_id, filename),
            0  # 특별한 id가 없으므로 0을 전달합니다.
        )
        return {
            "imagePath": new_image_path,
            "imageUrl": self._minio_repository.get_presigned_url(new_image_path)
        }


class BrandReviewService(FileHandlerMixin):
    def __init__(self, review_repository: BrandReviewRepository, minio_repository: MinioRepository, image_repository: ImageRepository) -> None:
        self._repository = review_repository
        self._minio_repository = minio_repository
        self._image_repository = image_repository

    def _transform_brand_review_from_s3_to_url(self, review: BrandReviewResponse) -> BrandReviewUrlResponse:
        review_dict = review.model_dump()
        images_transformed = [self._transfrom_image_path_to_url(img) for img in review.images] if review.images else []
        return BrandReviewUrlResponse(**review_dict, imageList=images_transformed)
    
    def get_all_reviews(self, offset: int = 0, limit: int = 100, sort_by: str = "id", descending: bool = False, owner_id: int = 0) -> BrandReviewUrlListResponse:
        reviews, total_count = self._repository.get_all(offset, limit, sort_by, descending, owner_id)
        return BrandReviewUrlListResponse(reviews=[self._transform_brand_review_from_s3_to_url(review) for review in reviews], totalCount=total_count)

    def create_review(self, review_create: BrandReviewCreate, owner_id: int) -> BrandReviewUrlResponse:
        review = self._repository.add(review_create, owner_id)
        return self._transform_brand_review_from_s3_to_url(review)

    def get_review(self, review_id: int) -> BrandReviewUrlResponse:
        try:
            review = self._repository.get_by_id(review_id)
            return self._transform_brand_review_from_s3_to_url(review)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def update_review(self, review_id: int, review_update: BrandReviewUpdate) -> BrandReviewUrlResponse:
        try:
            review = self._repository.update(review_id, review_update)
            return self._transform_brand_review_from_s3_to_url(review)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def delete_review(self, review_id: int) -> None:
        try:
            self._repository.delete_by_id(review_id)
        except NotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def upload_brand_review_image(self, brand_review_id: int, file: UploadFile) -> BrandReviewUploadImageResponse:
        new_image_path = self.handle_file_upload(
            file,
            lambda dummy, image_id, filename: PathHelper.generate_brand_review_image_path(image_id, filename),
            brand_review_id
        )
        image = self._image_repository.add(new_image_path, brand_review_id)
        return BrandReviewUploadImageResponse(
            image_id=safe_image(image).id, # type: ignore
            image_url=self._minio_repository.get_img_proxy_url(new_image_path)
        )
    
    def delete_brand_review_image(self, image_id: int) -> None:
        image = self._image_repository.get_image_by_id(image_id)
        self._image_repository.delete_image(image_id)
        self._minio_repository.delete_file(safe_image(image).path) # type: ignore #TODO
        return None
    
    # Add to services.py
class LandingPageService(FileHandlerMixin):
    """
    랜딩 페이지 관련 비즈니스 로직을 처리하는 서비스입니다.
    메인 이미지 및 갤러리 이미지를 관리합니다.
    소유자별로 설정을 관리합니다.
    """
    def __init__(
        self, 
        landing_repository: LandingPageSettingRepository,
        minio_repository: MinioRepository,
        image_repository: ImageRepository
    ):
        self._repository = landing_repository
        self._minio_repository = minio_repository
        self._image_repository = image_repository
        
    # --- 메인 이미지 관리 ---
    def set_main_image(self, file: UploadFile, owner_id: int = 0) -> ImageResponse:
        """메인 이미지를 설정합니다. 소유자 ID를 포함합니다."""
        try:
            object_key = self.handle_file_upload(
                file, PathHelper.generate_landing_main_image_path, 0
            )
            
            # 이미지 메타데이터 저장
            new_image = self._image_repository.add(
                object_key
            )
            
            # 랜딩 페이지 설정에 메인 이미지 ID 저장 (소유자 ID 포함)
            self._repository.upsert_setting('main_image_id', new_image.id, owner_id)
            
            # 이미지 정보 반환
            return self._transfrom_image_path_to_url(new_image)
            
        except Exception as e:
            logger.error(f"Failed to set main image: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to set main image"
            )
    
    def delete_main_image(self, owner_id: int = 0) -> None:
        """메인 이미지를 삭제합니다. 소유자 ID로 필터링합니다."""
        try:
            # 현재 메인 이미지 ID 조회 (소유자 ID로 필터링)
            image_id = self._repository.get_setting('main_image_id', owner_id)
            
            if image_id:
                # 이미지 정보 조회
                image = self._image_repository.get_image_by_id(image_id)
                if image:
                    # MinIO에서 파일 삭제
                    try:
                        self._minio_repository.delete_file(image.path) # type: ignore
                    except Exception as e:
                        logger.error(f"Failed to delete file from MinIO: {e}")
                    
                    # DB에서 이미지 레코드 삭제
                    self._image_repository.delete_image(image_id)
            
            # 설정에서 메인 이미지 ID 삭제 (소유자 ID로 필터링)
            self._repository.delete_setting('main_image_id', owner_id)
            
        except Exception as e:
            logger.error(f"Failed to delete main image: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete main image"
            )
    
    def get_main_image(self, owner_id: int) -> Optional[ImageResponse]:
        """현재 메인 이미지 정보를 조회합니다. 소유자 ID로 필터링합니다."""
        try:
            image_id = self._repository.get_setting('main_image_id', owner_id)
            if not image_id:
                return None
            image = self._image_repository.get_image_by_id(image_id)
            if not image:
                return None
            return self._transfrom_image_path_to_url(image)
            
        except Exception as e:
            logger.error(f"Failed to get main image: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get main image"
            )
    
    # --- 갤러리 이미지 관리 ---
    def add_gallery_image(self, file: UploadFile, owner_id: int = 0) -> ImageResponse:
        """갤러리에 이미지를 추가합니다. 소유자 ID를 포함합니다."""
        try:
            object_key = self.handle_file_upload(
                file, PathHelper.generate_landing_gallery_image_path, 0
            )
            
            # 이미지 메타데이터 저장
            new_image = self._image_repository.add(
                object_key
            )
            
            # 현재 갤러리 이미지 ID 목록 조회 (소유자 ID로 필터링)
            gallery_ids = self._repository.get_setting('gallery_image_ids', owner_id)
            if gallery_ids is None:
                gallery_ids = []
            elif not isinstance(gallery_ids, list):
                gallery_ids = []
            
            # 새 이미지 ID 추가
            gallery_ids.append(new_image.id)
            self._repository.upsert_setting('gallery_image_ids', gallery_ids, owner_id)
            return self._transfrom_image_path_to_url(new_image)
            
        except Exception as e:
            logger.error(f"Failed to add gallery image: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to add gallery image"
            )
    
    def delete_gallery_image(self, image_id: int, owner_id: int = 0) -> None:
        """갤러리에서 이미지를 삭제합니다. 소유자 ID로 필터링합니다."""
        try:
            # 현재 갤러리 이미지 ID 목록 조회 (소유자 ID로 필터링)
            gallery_ids = self._repository.get_setting('gallery_image_ids', owner_id)
            
            if not gallery_ids or not isinstance(gallery_ids, list):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Gallery is empty or not found"
                )
            
            # 이미지 ID가 갤러리에 있는지 확인
            if image_id not in gallery_ids:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Image not found in gallery"
                )
            
            # 이미지 정보 조회
            image = self._image_repository.get_image_by_id(image_id)
            if image:
                # MinIO에서 파일 삭제
                try:
                    self._minio_repository.delete_file(image.path) # type: ignore
                except Exception as e:
                    logger.error(f"Failed to delete file from MinIO: {e}")
                
                # DB에서 이미지 레코드 삭제
                self._image_repository.delete_image(image_id)
            
            # 갤러리 이미지 ID 목록에서 제거
            gallery_ids.remove(image_id)
            
            # 갤러리 이미지 ID 목록 업데이트 (소유자 ID 포함)
            self._repository.upsert_setting('gallery_image_ids', gallery_ids, owner_id)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to delete gallery image: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete gallery image"
            )
    
    def get_gallery_images(self, owner_id: int = 0) -> List[ImageResponse]:
        """현재 갤러리 이미지 목록을 조회합니다. 소유자 ID로 필터링합니다."""
        try:
            gallery_ids = self._repository.get_setting('gallery_image_ids', owner_id)
            if not gallery_ids or not isinstance(gallery_ids, list):
                return []
                
            return [self._transfrom_image_path_to_url(self._image_repository.get_image_by_id(image_id)) for image_id in gallery_ids]
            
        except Exception as e:
            logger.error(f"Failed to get gallery images: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get gallery images"
            )
            
    def get_all_landing_settings(self, owner_id: int = 0) -> Dict[str, Any]:
        """소유자의 모든 랜딩 페이지 설정을 조회합니다."""
        try:
            return self._repository.get_all_settings_by_owner(owner_id)
        except Exception as e:
            logger.error(f"Failed to get all landing settings: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get all landing settings"
            )


class SurveyDocumentService:
    def __init__(self, survey_repo: DocumentRepository) -> None:
        self._survey_repo = survey_repo

    def create(self, payload: dict, owner_id: int) -> dict:
        """
        설문 생성 시 questions 필드 내부의 각 항목에 _id를 생성하여
        surveys 컬렉션에 임베드 형태로 저장합니다.
        """
        questions = payload.get("questions", [])
        # 1) 각 질문에 내부 _id 생성
        for q in questions:
            # ObjectId 를 문자열로 변환하여 사용
            q["_id"] = str(ObjectId())
        payload["questions"] = questions
        payload["ownerId"] = owner_id
        # insert_one에서 created_at 자동 추가
        survey_id = self._survey_repo.insert_one(payload)
        if not survey_id:
            logger.error("Failed to insert survey document")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Survey 생성 실패"
            )

        # 저장된 설문 문서 조회
        survey = self._survey_repo.find_by_id(survey_id)
        if not survey:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Survey 조회 실패"
            )
        return survey

    def list(self, brand_id: Optional[int] = None, owner_id: Optional[int] = None) -> List[dict]:
        filt: dict = {}
        if brand_id is not None:
            filt["brand_id"] = brand_id
        if owner_id is not None:
            filt["ownerId"] = owner_id
        surveys, _ = self._survey_repo.find_many(
            filter_dict=filt,
        )
        return surveys

    def get(self, survey_id: str) -> dict:
        survey = self._survey_repo.find_by_id(survey_id)
        if not survey:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Survey not found"
            )
        return survey

    def update(self, survey_id: str, update_data: dict) -> dict:
        # 질문 업데이트가 포함된 경우 새 _id 부여
        if "questions" in update_data:
            for q in update_data["questions"]:
                if "_id" not in q:
                    q["_id"] = str(ObjectId())
        modified = self._survey_repo.update_by_id(survey_id, {"$set": update_data})
        if not modified:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Survey not found"
            )
        return self.get(survey_id)

    def delete(self, survey_id: str) -> None:
        deleted = self._survey_repo.delete_by_id(survey_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Survey not found"
            )

class SurveyResponseDocumentService:
    def __init__(
        self,
        doc_repo: DocumentRepository,
        survey_repo: DocumentRepository,
    ) -> None:
        """
        doc_repo: survey_responses 컬렉션용
        survey_repo: surveys 컬렉션용 (존재 검증)
        """
        self._doc_repo = doc_repo
        self._survey_repo = survey_repo

    def create(self, survey_id: str, payload: dict, owner_id: int) -> dict:
        # 1) 설문 존재 검증
        if not self._survey_repo.find_by_id(survey_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")

        # 2) 기본 필드 설정
        payload["surveyId"]    = survey_id
        payload["submittedAt"] = datetime.utcnow()
        payload["registState"] = SurveyRegistState.PENDING
        payload["ownerId"] = owner_id
        # updatedAt 는 update() 시점에 자동 추가됨

        # 3) 저장
        resp_id = self._doc_repo.insert_one(payload)
        if not resp_id:
            logger.error("Failed to insert survey response")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="SurveyResponse 생성 실패"
            )
        return self.get(resp_id)

    def list(
        self,
        survey_id: Optional[str] = None,
        channel_id: Optional[int] = None,
        offset: int = 0,
        limit: int = 20,
        sort_by: str = "submittedAt",
        descending: bool = True,
        owner_id: Optional[int] = None,
    ) -> dict:
        """
        survey_id, channel_id로 필터링, 페이지네이션 및 정렬 지원
        """
        filt: dict = {}
        if survey_id:
            filt["surveyId"] = survey_id
        if channel_id is not None:
            filt["channelId"] = channel_id
        if owner_id is not None:
            filt["ownerId"] = owner_id

        responses, total_count = self._doc_repo.find_many(
            filter_dict=filt,
            sort_by=sort_by,
            descending=descending,
            limit=limit,
            skip=offset,
        )
        return {
            "responses": responses,
            "totalCount": total_count
        }

    def get(self, response_id: str) -> dict:
        """
        단일 응답 조회
        """
        resp = self._doc_repo.find_by_id(response_id)
        if not resp:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SurveyResponse not found")
        return resp

    def update(self, response_id: str, update_data: dict) -> dict:
        """
        상태 변경(registState), answers 수정 등을 수행하며
        updated_at 은 Repository 에서 자동 추가됨
        """
        modified = self._doc_repo.update_by_id(
            response_id,
            {"$set": update_data}
        )
        if not modified:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SurveyResponse not found")
        return self.get(response_id)

    def delete(self, response_id: str) -> None:
        """
        단일 응답 삭제
        """
        deleted = self._doc_repo.delete_by_id(response_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SurveyResponse not found")

class HostRegistService:
    def __init__(self, host_regist_repository: HostRegistRepository, user_repository: UserRepository) -> None:
        self._repository = host_regist_repository
        self._user_repository = user_repository

    def create_host_regist(self, user_id: int) -> schemas.HostRegistResponse:
        # 중복 신청 확인
        existing = self._repository.get_by_user_id(user_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 호스트 등록 신청이 존재합니다."
            )

        # 사용자 존재 확인
        try:
            user = self._user_repository.get_by_id(user_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

        # 등록 신청 생성
        host_regist_data = {
            "user_id": user_id,
            "state": "PENDING",
        }
        return self._repository.add(host_regist_data)

    def get_host_regist(self, host_regist_id: int) -> schemas.HostRegistResponse:
        try:
            return self._repository.get_by_id(host_regist_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    def get_host_regist_by_user_id(self, user_id: int) -> Optional[schemas.HostRegistResponse]:
        return self._repository.get_by_user_id(user_id)

    def get_all_host_regists(self, sort_by: str = "id", descending: bool = False, offset: int = 0, limit: int = 100) -> schemas.HostRegistListResponse:
        host_regists, total_count = self._repository.get_all(sort_by, descending, offset, limit)
        return schemas.HostRegistListResponse(
            regists=host_regists,
            totalCount=total_count
        )

    def update_host_regist_state(self, host_regist_id: int, state: HostRegistState) -> schemas.HostRegistResponse:
        try:
            host_regist = self._repository.get_by_id(host_regist_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        
        if state == HostRegistState.ACCEPT:
            self._user_repository.update(host_regist.user.id, {"role": "admin"})
        elif state == HostRegistState.REJECT:
            self._user_repository.update(host_regist.user.id, {"role": "user"})
        
        return self._repository.update_state(host_regist_id, state)

    def delete_host_regist(self, host_regist_id: int) -> None:
        try:
            self._repository.delete_by_id(host_regist_id)
        except NotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
