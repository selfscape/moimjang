"""
Repositories module.
Repository returns should be schemas. Because it can't used after commit.
"""

import base64
from contextlib import AbstractContextManager
from typing import Callable, BinaryIO, List, Optional, Tuple, Union, Any, Dict
from datetime import timedelta, datetime

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from minio import Minio
from minio.error import S3Error
from pymongo.collection import Collection
from bson import ObjectId

from .models import (
    User,
    Channel,
    Group,
    Game,
    Review,
    ChannelUser,
    GroupUser,
    Brand,
    QuestionCardCategory,
    QuestionCard,
    BrandQuestionCardCategory,
    Survey,
    SurveyResponse,
    ResponseAnswer,
    SurveyQuestion,
    Image,
    BrandReview,
    LandingPageSetting,
    HostRegist,
)
from .enums import (
    BrandState,
    ChannelState,
)
from .schemas import (
    ChannelUserLink,
    GroupUserLink,
    JoinedUser,
    BrandQuestionCardCategoryResponse,
    ChannelResponse,
    SurveyFormResponse,
    SurveyResponseResponse,
    BrandReviewCreate,
    BrandReviewUpdate,
    BrandReviewResponse,
    HostRegistResponse,
)
from .utils.logger_config import configure_logger

logger = configure_logger()

class NotFoundError(Exception):
    pass


########################################################
# UserRepository
########################################################


class UserRepository:

    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_all_with_count(
        self,
        sort_by: str = "id",
        descending: bool = False,
        offset: int = 0,
        limit: int = 100,
        owner_id: Optional[int] = None,
    ) -> tuple[List[User], int]:
        with self.session_factory() as session:
            query = session.query(User)
            if owner_id is not None:
                query = query.filter(User.owner_id == owner_id)
            if hasattr(User, sort_by):
                column = getattr(User, sort_by)
                query = query.order_by(column.desc() if descending else column)
            total_count = query.count()            
            query = query.offset(offset).limit(limit)
            return query.all(), total_count

    def get_by_id(self, user_id: int) -> User:
        with self.session_factory() as session:
            user = session.query(User).filter(User.id == user_id).scalar()
            if not user:
                raise NotFoundError(f"User {user_id} not found")
            return user

    def add(self, user_data: dict) -> User:
        with self.session_factory() as session:
            user = User(**user_data)
            session.add(user)
            session.commit()
            session.refresh(user)
            return user

    def update(self, user_id: int, user_data: dict) -> User:
        with self.session_factory() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise NotFoundError(f"User {user_id} not found")
            for key, value in user_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            session.commit()
            session.refresh(user)
            return user

    def delete_by_id(self, user_id: int) -> None:
        with self.session_factory() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise NotFoundError(f"User {user_id} not found")
            session.delete(user)
            session.commit()

    def get_by_email(self, email: str) -> User:
        with self.session_factory() as session:
            user = session.query(User).filter(User.email == email).first()
            return user

    def get_total_count(self) -> int:
        with self.session_factory() as session:
            return session.query(User).count()

    def get_user_by_id(self, user_id: int) -> User:
        with self.session_factory() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise NotFoundError(f"User {user_id} not found")
            return user

    def filter_users(
        self, name: Optional[str] = None, email: Optional[str] = None
    ) -> List[User]:
        with self.session_factory() as session:
            query = session.query(User)
            if name is not None:
                # username 필드에서 대소문자 구분 없이 부분 매칭
                query = query.filter(User.username.ilike(f"%{name}%"))
            if email is not None:
                # 실제 email 필드를 대상으로 대소문자 구분 없이 부분 매칭
                query = query.filter(User.email.ilike(f"%{email}%"))
            return query.all()


# --------------------------
# ChannelRepository
# --------------------------
class ChannelRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_all(
        self,
        sort_by: str = "id",
        descending: bool = False,
        brand_id: Optional[int] = None,
        channel_state: Optional[ChannelState] = None,
        offset: int = 0,
        limit: int = 100,
        owner_id: Optional[int] = None,
    ) -> tuple[list[ChannelResponse], int]:
        with self.session_factory() as session:
            query = session.query(Channel)
            if brand_id is not None:
                query = query.filter(Channel.brand_id == brand_id)
            if channel_state is not None:
                query = query.filter(Channel.channel_state == channel_state.value)
            if owner_id is not None:
                query = query.filter(Channel.owner_id == owner_id)
            if hasattr(Channel, sort_by):
                column = getattr(Channel, sort_by)
                query = query.order_by(column.desc() if descending else column)
            total_count = query.count()
            channels = query.offset(offset).limit(limit).all()
            return (
                [ChannelResponse.model_validate(channel) for channel in channels],
                total_count,
            )

    def get_by_brand_id(
        self,
        brand_id: int,
        sort_by: str = "id",
        descending: bool = False,
    ) -> List[ChannelResponse]:
        with self.session_factory() as session:
            query = session.query(Channel).filter(Channel.brand_id == brand_id)
            if hasattr(Channel, sort_by):
                column = getattr(Channel, sort_by)
                query = query.order_by(column.desc() if descending else column)
            return [
                ChannelResponse.model_validate(channel)
                for channel in query.all()
            ]

    def get_by_id(self, channel_id: int) -> ChannelResponse:
        with self.session_factory() as session:
            channel = session.query(Channel).filter(Channel.id == channel_id).first()
            if not channel:
                raise NotFoundError(f"Channel {channel_id} not found")
            return ChannelResponse.model_validate(channel)

    def add(self, channel_data: dict) -> ChannelResponse:
        with self.session_factory() as session:
            channel = Channel(**channel_data)
            session.add(channel)
            session.commit()
            session.refresh(channel)
            return ChannelResponse.model_validate(channel)

    def update(self, channel_id: int, channel_data: dict) -> ChannelResponse:
        with self.session_factory() as session:
            channel = session.query(Channel).filter(Channel.id == channel_id).first()
            if not channel:
                raise NotFoundError(f"Channel {channel_id} not found")
            for key, value in channel_data.items():
                if hasattr(channel, key):
                    setattr(channel, key, value)
            session.commit()
            session.refresh(channel)
            return ChannelResponse.model_validate(channel)

    def delete_by_id(self, channel_id: int) -> None:
        with self.session_factory() as session:
            channel = session.query(Channel).filter(Channel.id == channel_id).first()
            if not channel:
                raise NotFoundError(f"Channel {channel_id} not found")
            session.delete(channel)
            session.commit()

    def update_state(self, channel_id: int, state: ChannelState) -> ChannelResponse:
        channel = self.update(channel_id, {"channel_state": state})
        return ChannelResponse.model_validate(channel)


# --------------------------
# GroupRepository
# --------------------------
class GroupRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_all(
        self,
        sort_by: str = "id",
        descending: bool = False,
        owner_id: Optional[int] = None,
    ) -> List[Group]:
        with self.session_factory() as session:
            query = session.query(Group)
            if owner_id is not None:
                query = query.filter(Group.owner_id == owner_id)
            if hasattr(Group, sort_by):
                column = getattr(Group, sort_by)
                query = query.order_by(column.desc() if descending else column)
            return query.all()

    def get_by_id(self, group_id: int) -> Group:
        with self.session_factory() as session:
            group = session.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise NotFoundError(f"Group {group_id} not found")
            return group

    def add(self, group_data: dict) -> Group:
        with self.session_factory() as session:
            group = Group(**group_data)
            session.add(group)
            session.commit()
            session.refresh(group)
            return group

    def update(self, group_id: int, group_data: dict) -> Group:
        with self.session_factory() as session:
            group = session.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise NotFoundError(f"Group {group_id} not found")
            for key, value in group_data.items():
                if hasattr(group, key):
                    setattr(group, key, value)
            session.commit()
            session.refresh(group)
            return group

    def delete_by_id(self, group_id: int) -> None:
        with self.session_factory() as session:
            group = session.query(Group).filter(Group.id == group_id).first()
            if not group:
                raise NotFoundError(f"Group {group_id} not found")
            session.delete(group)
            session.commit()

    def get_by_channel(self, channel_id: int, owner_id: Optional[int] = None) -> List:
        with self.session_factory() as session:
            query = session.query(Group).filter(Group.channel_id == channel_id)
            if owner_id is not None:
                query = query.filter(Group.owner_id == owner_id)
            return query.all()

    def get_by_user(self, user_id: int) -> List[Group]:
        with self.session_factory() as session:
            return (
                session.query(Group)
                .join(GroupUser)
                .filter(GroupUser.user_id == user_id)
                .all()
            )

    def get_by_filtered(self, channel_id: int, user_id: int) -> List[Group]:
        with self.session_factory() as session:
            query = session.query(Group)
            if channel_id is not None:
                query = query.filter(Group.channel_id == channel_id)
            if user_id is not None:
                query = query.join(GroupUser, GroupUser.group_id == Group.id).filter(
                    GroupUser.user_id == user_id
                )
            return query.all()


# --------------------------
# GameRepository
# --------------------------
class GameRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_all(self, owner_id: Optional[int] = None) -> List[Game]:
        with self.session_factory() as session:
            query = session.query(Game)
            if owner_id is not None:
                query = query.filter(Game.owner_id == owner_id)
            return query.all()

    def get_by_id(self, game_id: int) -> Game:
        with self.session_factory() as session:
            game = session.query(Game).filter(Game.id == game_id).first()
            if not game:
                raise NotFoundError(f"Game {game_id} not found")
            return game

    def add(self, game_data: dict) -> Game:
        with self.session_factory() as session:
            game = Game(**game_data)
            session.add(game)
            session.commit()
            session.refresh(game)
            return game

    def update(self, game_id: int, game_data: dict) -> Game:
        with self.session_factory() as session:
            game = session.query(Game).filter(Game.id == game_id).first()
            if not game:
                raise NotFoundError(f"Game {game_id} not found")
            for key, value in game_data.items():
                if hasattr(game, key):
                    setattr(game, key, value)
            session.commit()
            session.refresh(game)
            return game

    def delete_by_id(self, game_id: int) -> None:
        with self.session_factory() as session:
            game = session.query(Game).filter(Game.id == game_id).first()
            if not game:
                raise NotFoundError(f"Game {game_id} not found")
            session.delete(game)
            session.commit()

    def get_by_group(self, group_id: int) -> List[Game]:
        with self.session_factory() as session:
            return session.query(Game).filter(Game.group_id == group_id).all()

    def get_by_user(self, user_id: int) -> List[Game]:
        with self.session_factory() as session:
            return session.query(Game).filter(Game.user_id == user_id).all()

    def get_user_by_id(self, user_id: int) -> User:
        with self.session_factory() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                raise NotFoundError(f"User {user_id} not found")
            return user

    def get_by_filtered(
        self, group_id: int, user_id: Optional[int] = None
    ) -> List[Game]:
        with self.session_factory() as session:
            query = session.query(Game)
            if group_id is not None:
                query = query.filter(Game.group_id == group_id)
            if user_id is not None:
                query = query.filter(Game.user_id == user_id)
            return query.all()

    def delete_all_by_user(self, user_id: int) -> None:
        with self.session_factory() as session:
            session.query(Game).filter(
                or_(Game.user_id == user_id, Game.matched_user_id == user_id)
            ).delete(synchronize_session=False)
            session.commit()


# --------------------------
# ReviewRepository
# --------------------------
class ReviewRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_all(self, owner_id: Optional[int] = None) -> List[Review]:
        with self.session_factory() as session:
            query = session.query(Review)
            if owner_id is not None:
                query = query.filter(Review.owner_id == owner_id)
            return query.all()

    def get_by_id(self, review_id: int) -> Review:
        with self.session_factory() as session:
            review = session.query(Review).filter(Review.id == review_id).first()
            if not review:
                raise NotFoundError(f"Review {review_id} not found")
            return review

    def add(self, review_data: dict) -> Review:
        with self.session_factory() as session:
            review = Review(**review_data)
            session.add(review)
            session.commit()
            session.refresh(review)
            return review

    def update(self, review_id: int, review_data: dict) -> Review:
        with self.session_factory() as session:
            review = session.query(Review).filter(Review.id == review_id).first()
            if not review:
                raise NotFoundError(f"Review {review_id} not found")
            for key, value in review_data.items():
                if hasattr(review, key):
                    setattr(review, key, value)
            session.commit()
            session.refresh(review)
            return review

    def delete_by_id(self, review_id: int) -> None:
        with self.session_factory() as session:
            review = session.query(Review).filter(Review.id == review_id).first()
            if not review:
                raise NotFoundError(f"Review {review_id} not found")
            session.delete(review)
            session.commit()

    def get_by_channel(
        self, channel_id: int, target_user_id: Optional[int] = None
    ) -> List:
        with self.session_factory() as session:
            query = session.query(Review).filter(Review.channel_id == channel_id)
            if target_user_id is not None:
                query = query.filter(Review.target_user_id == target_user_id)
            return query.all()

    def get_by_user(self, user_id: int) -> List[Review]:
        with self.session_factory() as session:
            return (
                session.query(Review).filter(Review.reviewer_user_id == user_id).all()
            )

    def get_by_target_user(self, user_id: int) -> List[Review]:
        with self.session_factory() as session:
            return session.query(Review).filter(Review.target_user_id == user_id).all()

    def get_by_filtered(
        self, channel_id: int, target_user_id: Optional[int] = None
    ) -> List[Review]:
        with self.session_factory() as session:
            query = session.query(Review)
            if channel_id is not None:
                query = query.filter(Review.channel_id == channel_id)
            if target_user_id is not None:
                query = query.filter(Review.target_user_id == target_user_id)
            return query.all()

    def delete_all_by_user(self, user_id: int) -> None:
        with self.session_factory() as session:
            session.query(Review).filter(
                or_(
                    Review.reviewer_user_id == user_id, Review.target_user_id == user_id
                )
            ).delete(synchronize_session=False)
            session.commit()


# --------------------------
# ChannelUserRepository (join 테이블)
# --------------------------
class ChannelUserRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_channels_by_user(self, user_id: int) -> list[dict]:
        with self.session_factory() as session:
            results = (
                session.query(ChannelUser, Channel, User)
                .join(Channel, Channel.id == ChannelUser.channel_id)
                .join(User, User.id == ChannelUser.user_id)
                .filter(ChannelUser.user_id == user_id)
                .all()
            )
            records = []
            for _, channel, user in results:
                channel_link = ChannelUserLink(
                    channel_id=channel.id,
                    channel_name=channel.title,
                    user_id=user.id,
                    user_name=user.username,
                    user_gender=user.gender,
                )
                records.append(channel_link.model_dump())
            return records

    def add_user_to_channel(self, channel_id: int, user_id: int) -> ChannelUser:
        with self.session_factory() as session:
            channel_user = ChannelUser(channel_id=channel_id, user_id=user_id)
            session.add(channel_user)
            session.commit()
            session.refresh(channel_user)
            return channel_user

    def remove_user_from_channel(self, channel_id: int, user_id: int) -> None:
        with self.session_factory() as session:
            cu = (
                session.query(ChannelUser)
                .filter(
                    ChannelUser.channel_id == channel_id, ChannelUser.user_id == user_id
                )
                .first()
            )
            if not cu:
                raise NotFoundError(
                    f"ChannelUser (channel: {channel_id}, user: {user_id}) not found"
                )
            session.delete(cu)
            session.commit()

    def get_users_by_channel(self, channel_id: int) -> list[dict]:
        with self.session_factory() as session:
            results = (
                session.query(ChannelUser, Channel, User)
                .join(Channel, Channel.id == ChannelUser.channel_id)
                .join(User, User.id == ChannelUser.user_id)
                .filter(ChannelUser.channel_id == channel_id)
                .all()
            )
            records = []
            for _, channel, user in results:
                channel_link = ChannelUserLink(
                    channel_id=channel.id,
                    channel_name=channel.title,
                    user_id=user.id,
                    user_name=user.username,
                    user_gender=user.gender,
                )
                records.append(channel_link.model_dump())
            return records

    def get_joined_users(self, channel_id: int) -> list[JoinedUser]:
        with self.session_factory() as session:
            results = (
                session.query(ChannelUser, User)
                .join(User, User.id == ChannelUser.user_id)
                .filter(ChannelUser.channel_id == channel_id)
                .all()
            )
            records = []
            for _, user in results:
                joined_user = JoinedUser(
                    id=user.id,
                    user_name=user.username,
                    gender=user.gender,
                    birth_year=user.birth_year,
                )
                records.append(joined_user)
            return records

    def get_channel_users_not_in_group(self, channel_id: int) -> List[User]:
        """
        특정 채널에 가입한 사용자 중, 해당 채널 소속 그룹에 가입하지 않은 사용자를 조회합니다.
        단일 쿼리 내에서 서브쿼리를 사용하여 처리합니다.
        """
        with self.session_factory() as session:
            # 먼저, 해당 채널에 속한 그룹에 가입한 사용자 ID들을 서브쿼리로 구합니다.
            subquery = (
                session.query(GroupUser.user_id)
                .join(Group, Group.id == GroupUser.group_id)
                .filter(Group.channel_id == channel_id)
                .subquery()
            )

            # 채널에 가입한 사용자 중, 위 서브쿼리의 결과에 포함되지 않은 사용자들을 조회합니다.
            results = (
                session.query(User)
                .join(ChannelUser, ChannelUser.user_id == User.id)
                .filter(
                    ChannelUser.channel_id == channel_id,
                    ~User.id.in_(subquery),  # type: ignore
                )
                .all()
            )

            # 필요한 경우 User 모델을 적절히 dict로 변환한 후 반환합니다.
            return results

    def get_by_user(self, user_id: int) -> List[ChannelUser]:
        with self.session_factory() as session:
            return (
                session.query(ChannelUser).filter(ChannelUser.user_id == user_id).all()
            )


# --------------------------
# GroupUserRepository (join 테이블)
# --------------------------
class GroupUserRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_users_by_group(self, group_id: int) -> List[GroupUser]:
        with self.session_factory() as session:
            return session.query(GroupUser).filter(GroupUser.group_id == group_id).all()

    def add_user_to_group(self, group_id: int, user_id: int) -> GroupUser:
        with self.session_factory() as session:
            group_user = GroupUser(group_id=group_id, user_id=user_id)
            session.add(group_user)
            session.commit()
            session.refresh(group_user)
            return group_user

    def remove_user_from_group(self, group_id: int, user_id: int) -> None:
        with self.session_factory() as session:
            gu = (
                session.query(GroupUser)
                .filter(GroupUser.group_id == group_id, GroupUser.user_id == user_id)
                .first()
            )
            if not gu:
                raise NotFoundError(
                    f"GroupUser (group: {group_id}, user: {user_id}) not found"
                )
            session.delete(gu)
            session.commit()

    def get_groups_by_user(self, user_id: int) -> list[dict]:
        """
        특정 유저가 가입한 그룹 정보를 조회합니다.
        내부 스키마 GroupUserLink를 사용하여 관리합니다.
        """
        with self.session_factory() as session:
            results = (
                session.query(GroupUser, Group, User)
                .join(Group, Group.id == GroupUser.group_id)
                .join(User, User.id == GroupUser.user_id)
                .filter(GroupUser.user_id == user_id)
                .all()
            )
            records = []
            for _, group, user in results:
                group_link = GroupUserLink(
                    group_id=group.id,
                    group_name=group.group_name,
                    user_id=user.id,
                    user_name=user.username,
                    user_gender=user.gender,
                )
                records.append(group_link.model_dump())
            return records

    def get_joined_users(self, group_id: int) -> list[dict]:
        """
        특정 그룹 내 가입한 사용자의 정보를 조회합니다.
        기존 하드코딩 dict 대신 이미 정의된 JoinedUser 스키마를 사용합니다.
        """
        with self.session_factory() as session:
            results = (
                session.query(GroupUser, User)
                .join(User, User.id == GroupUser.user_id)
                .filter(GroupUser.group_id == group_id)
                .all()
            )
            records = []
            for _, user in results:
                joined = JoinedUser(
                    id=user.id,
                    user_name=user.username,
                    gender=user.gender,
                    birth_year=user.birth_year,
                )
                records.append(joined.model_dump())
            return records


class MinioRepository:
    def __init__(self, minio_client: Minio, bucket_name: str = "socialing", cdn_url: Optional[str] = None, cdn_opt_rs: Optional[str] = None) -> None:
        self.client = minio_client
        self.bucket_name = bucket_name
        self.cdn_url = cdn_url
        self.cdn_opt_rs = cdn_opt_rs

        if not self.client.bucket_exists(bucket_name):
            self.client.make_bucket(bucket_name)

    def list_objects(self, table_type: str, table_id: int) -> List[str]:
        prefix = f"{table_type}/{table_id}/"
        objects = self.client.list_objects(
            self.bucket_name, prefix=prefix, recursive=True
        )
        return [obj.object_name for obj in objects if obj.object_name is not None]

    def is_object_exists(self, object_key: str, file_size: int) -> bool:
        try:
            stat = self.client.stat_object(self.bucket_name, object_key)
            if stat.size == file_size:
                return True
            else:
                return False
        except S3Error:
            return False

    def get_img_proxy_url(self, object_path: str) -> str:
        """
        S3 오브젝트 경로를 이미지 프록시 URL로 변환합니다.
        
        Args:
            object_path: S3 객체 경로 (예: "brands/thumbnail/1/123_image.jpg")
            
        Returns:
            이미지 프록시 URL (예: "https://<cdn_url>/insecure/rs:fill:400:300/<Base64enc>")
            
        Raises:
            ValueError: 객체가 존재하지 않을 경우
        """
        # 1. 객체 존재 여부 검증
        try:
            self.client.stat_object(self.bucket_name, object_path)
        except S3Error as e:
            logger.error(f"Object does not exist: {object_path}, {str(e)}")
        
        # 2. S3 경로 생성 (s3://bucket/path)
        s3_path = f"s3://{self.bucket_name}/{object_path}"
        # 3. URL-safe base64 인코딩
        base64_encoded = base64.urlsafe_b64encode(s3_path.encode()).decode().rstrip("=")
        
        # 4. 최종 URL 조합
        if not self.cdn_url:
            logger.warning("cdn_url is not set, using empty string")
            cdn_url = ""
        else:
            cdn_url = self.cdn_url
        
        if not self.cdn_opt_rs:
            logger.warning("cdn_opt_rs is not set, using empty string")
            cdn_opt_rs = ""
        else:
            cdn_opt_rs = self.cdn_opt_rs
            
        return f"https://{cdn_url}/insecure/{cdn_opt_rs}/{base64_encoded}"

    def upload_file(
        self, file_data: BinaryIO, file_size: int, content_type: str, object_key: str
    ) -> str:
        try:
            self.client.put_object(
                bucket_name=self.bucket_name,
                object_name=object_key,
                data=file_data,
                length=file_size,
                content_type=content_type,
            )
            return object_key
        except S3Error as e:
            raise ValueError(f"Failed to upload file: {str(e)}")

    def delete_file(self, object_key: str) -> None:
        try:
            self.client.remove_object(self.bucket_name, object_key)
        except S3Error as e:
            raise ValueError(f"Failed to delete file: {str(e)}")


class BrandRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def add(self, brand_data: dict) -> Brand:
        with self.session_factory() as session:
            brand = Brand(**brand_data)
            session.add(brand)
            session.commit()
            session.refresh(brand)
            return brand

    def get_by_id(self, brand_id: int) -> Brand:
        with self.session_factory() as session:
            brand = (
                session.query(Brand)
                .options(joinedload(Brand.thumbnail_image))
                .options(joinedload(Brand.detail_images))
                .filter(Brand.id == brand_id)
                .first()
            )
            if not brand:
                raise NotFoundError(f"Brand {brand_id} not found")
            return brand

    def update(self, brand_id: int, update_data: dict) -> Brand:
        with self.session_factory() as session:
            brand = (
                session.query(Brand)
                .options(joinedload(Brand.thumbnail_image))
                .options(joinedload(Brand.detail_images))
                .filter(Brand.id == brand_id)
                .first()
            )
            if not brand:
                raise NotFoundError(f"Brand {brand_id} not found")
            for key, value in update_data.items():
                if hasattr(brand, key):
                    setattr(brand, key, value)
            session.commit()
            session.refresh(brand)
            return brand

    def delete_by_id(self, brand_id: int) -> None:
        with self.session_factory() as session:
            brand = session.query(Brand).filter(Brand.id == brand_id).first()
            if not brand:
                raise NotFoundError(f"Brand with id {brand_id} not found.")
            session.delete(brand)
            session.commit()

    def get_all_with_count(
        self,
        state: Optional[BrandState] = None,
        sort_by: str = "id",
        descending: bool = False,
        offset: int = 0,
        limit: int = 100,
        owner_id: Optional[int] = None,
    ) -> tuple[list[Brand], int]:
        with self.session_factory() as session:
            query = (
                session.query(Brand)
                .options(joinedload(Brand.thumbnail_image))
                .options(joinedload(Brand.detail_images))
            )
            if state is not None:
                query = query.filter(Brand.brand_state == state.value)
            if owner_id is not None:
                query = query.filter(Brand.owner_id == owner_id)
            if hasattr(Brand, sort_by):
                column = getattr(Brand, sort_by)
                query = query.order_by(column.desc() if descending else column)
            total_count = query.count()
            brands = query.offset(offset).limit(limit).all()
            return (
                brands,
                total_count,
            )

    def update_state(self, brand_id: int, state: BrandState) -> Brand:
        return self.update(brand_id, {"brand_state": state})


class QuestionCardCategoryRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_by_id(self, category_id: int) -> QuestionCardCategory:
        with self.session_factory() as session:
            category = (
                session.query(QuestionCardCategory)
                .options(joinedload(QuestionCardCategory.cover_image))
                .filter(QuestionCardCategory.id == category_id)
                .first()
            )
            if not category:
                raise NotFoundError(f"Category {category_id} not found")
            return category

    def get_all(self, owner_id: Optional[int] = None) -> list[QuestionCardCategory]:
        with self.session_factory() as session:
            query = session.query(QuestionCardCategory).options(joinedload(QuestionCardCategory.cover_image))
            if owner_id is not None:
                query = query.filter(QuestionCardCategory.owner_id == owner_id)
            return query.all()

    def add(self, category_data: dict) -> QuestionCardCategory:
        with self.session_factory() as session:
            category = QuestionCardCategory(**category_data)
            session.add(category)
            session.commit()
            session.refresh(category)
            return category

    def update(self, category_id: int, update_data: dict) -> QuestionCardCategory:
        with self.session_factory() as session:
            category = (
                session.query(QuestionCardCategory)
                .options(joinedload(QuestionCardCategory.cover_image))
                .filter(QuestionCardCategory.id == category_id)
                .first()
            )
            if not category:
                raise NotFoundError(f"Category {category_id} not found")
            for key, value in update_data.items():
                if hasattr(category, key):
                    setattr(category, key, value)
            session.commit()
            session.refresh(category)
            return category

    def delete_by_id(self, category_id: int) -> None:
        with self.session_factory() as session:
            category = (
                session.query(QuestionCardCategory)
                .filter(QuestionCardCategory.id == category_id)
                .first()
            )
            if not category:
                raise NotFoundError(
                    f"QuestionCardCategory with id {category_id} not found."
                )
            session.delete(category)
            session.commit()


class QuestionCardRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def get_by_id(self, card_id: int) -> QuestionCard:
        with self.session_factory() as session:
            card = (
                session.query(QuestionCard)
                .options(joinedload(QuestionCard.image))
                .filter(QuestionCard.id == card_id)
                .first()
            )
            if not card:
                raise NotFoundError(f"Card {card_id} not found")
            return card

    def get_all_by_category(self, category_id: int) -> list[QuestionCard]:
        with self.session_factory() as session:
            return (
                session.query(QuestionCard)
                .options(joinedload(QuestionCard.image))
                .filter(QuestionCard.cardCategoryId == category_id)
                .all()
            )

    def add(self, card_data: dict) -> QuestionCard:
        with self.session_factory() as session:
            card = QuestionCard(**card_data)
            session.add(card)
            session.commit()
            session.refresh(card)
            return card

    def update(self, card_id: int, update_data: dict) -> QuestionCard:
        with self.session_factory() as session:
            card = (
                session.query(QuestionCard)
                .options(joinedload(QuestionCard.image))
                .filter(QuestionCard.id == card_id)
                .first()
            )
            if not card:
                raise NotFoundError(f"Card {card_id} not found")
            for key, value in update_data.items():
                if hasattr(card, key):
                    setattr(card, key, value)
            session.commit()
            session.refresh(card)
            return card

    def delete_by_id(self, card_id: int) -> None:
        with self.session_factory() as session:
            card = (
                session.query(QuestionCard).filter(QuestionCard.id == card_id).first()
            )
            if not card:
                raise NotFoundError(f"QuestionCard with id {card_id} not found.")
            session.delete(card)
            session.commit()


class BrandQuestionCardCategoryRepository:
    def __init__(
        self, session_factory: Callable[..., AbstractContextManager[Session]]
    ) -> None:
        self.session_factory = session_factory

    def add_link(self, brand_id: int, category_id: int) -> BrandQuestionCardCategory:
        with self.session_factory() as session:
            link = BrandQuestionCardCategory(
                brandId=brand_id, questionCardCategoryId=category_id
            )
            session.add(link)
            session.commit()
            session.refresh(link)
            return link

    def get_link(self, brand_id: int, category_id: int) -> BrandQuestionCardCategory:
        with self.session_factory() as session:
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
            return link

    def get_links_by_brand(self, brand_id: int) -> List[BrandQuestionCardCategoryResponse]:
        with self.session_factory() as session:
            return [
                BrandQuestionCardCategoryResponse.model_validate(link.__dict__)
                for link in session.query(BrandQuestionCardCategory)
                .filter(BrandQuestionCardCategory.brandId == brand_id)
                .all()
            ]

    def delete_link(self, brand_id: int, category_id: int) -> None:
        with self.session_factory() as session:
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

    def delete_links_by_category(self, category_id: int) -> None:
        with self.session_factory() as session:
            links = session.query(BrandQuestionCardCategory).filter(
                BrandQuestionCardCategory.questionCardCategoryId == category_id
            ).all()
            for link in links:
                session.delete(link)
            session.commit()


class SurveyRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        """
        session_factory: Session을 context manager로 생성하는 콜러블
        """
        self.session_factory = session_factory

    def get_survey_by_id(self, survey_id: int) -> Union[SurveyFormResponse, None]:
        with self.session_factory() as session:
            survey = session.query(Survey).filter(Survey.id == survey_id).first()
            if not survey:
                return None
            return SurveyFormResponse.model_validate(survey)
    
    def get_survey_by_brand(self, brand_id: int) -> Union[SurveyFormResponse, None]:
        with self.session_factory() as session:
            survey = (
                session.query(Survey)
                .filter(Survey.brand_id == brand_id, Survey.is_active == True)
                .first()
            )
            if not survey:
                return None
            # ORM 객체를 스키마로 반환
            return SurveyFormResponse.model_validate(survey)

    def add_survey_response(self, survey_response_data: dict) -> SurveyResponseResponse:
        with self.session_factory() as session:
            survey = (
                session.query(Survey)
                .filter(
                    Survey.id == survey_response_data["survey_id"],
                    Survey.is_active == True
                )
                .first()
            )
            if not survey:
                raise NotFoundError(f"Survey with id {survey_response_data['survey_id']} not found.")

            survey_response = SurveyResponse(
                survey_id=survey_response_data["survey_id"],
                channel_id=survey_response_data.get("channel_id"),
                user_id=survey_response_data.get("user_id"),
                submitted_at=datetime.now(),
                regist_state="PENDING"
            )
            session.add(survey_response)
            session.flush()  # survey_response.id 할당

            for question_id, answer in survey_response_data["response"].items():
                answer_obj = ResponseAnswer(
                    response_id=survey_response.id,
                    question_id=question_id,
                    answer_value=str(answer)
                )
                session.add(answer_obj)

            session.commit()
            session.refresh(survey_response)

            # SQLAlchemy 모델을 dict로 변환하고 _sa_instance_state 제거
            response_data = survey_response.__dict__.copy()
            response_data.pop('_sa_instance_state', None)
            # 응답(answers) 정보를 별도로 생성한 answers_dict를 추가
            answers_dict = {answer.question_id: answer.answer_value for answer in survey_response.answers}
            response_data['response'] = answers_dict

            # 변환된 dict를 사용하여 스키마로 검증 및 반환
            return SurveyResponseResponse.model_validate(response_data)

    def get_survey_responses(
        self,
        brand_id: int,
        channel_id: Optional[int],
        offset: int,
        limit: int,
        sort_by: str,
        descending: bool,
    ) -> Tuple[List[SurveyResponseResponse], int]:
        with self.session_factory() as session:
            query = session.query(SurveyResponse).join(Survey).filter(Survey.brand_id == brand_id)
            if channel_id is not None:
                query = query.filter(SurveyResponse.channel_id == channel_id)

            sort_attr = getattr(SurveyResponse, sort_by, None)
            if sort_attr is not None:
                query = query.order_by(sort_attr.desc() if descending else sort_attr)

            total_count = query.count()
            items = query.offset(offset).limit(limit).all()
            results = []
            for rsp in items:
                data = rsp.__dict__.copy()
                data.pop("_sa_instance_state", None)
                # answer dict 생성
                answers = {a.question_id: a.answer_value for a in rsp.answers}
                data["response"] = answers
                results.append(SurveyResponseResponse.model_validate(data))
            return results, total_count

    def update_survey_response(self, response_id: int, update_data: dict) -> SurveyResponseResponse:
        with self.session_factory() as session:
            rsp = session.query(SurveyResponse).filter(SurveyResponse.id == response_id).first()
            if not rsp:
                raise NotFoundError(f"SurveyResponse {response_id} not found.")
            # 상태, 채널 동시 업데이트
            if update_data.get("regist_state") is not None:
                rsp.regist_state = update_data["regist_state"]
            if update_data.get("channel_id") is not None:
                rsp.channel_id = update_data["channel_id"]

            session.commit()
            session.refresh(rsp)

            data = rsp.__dict__.copy()
            data.pop("_sa_instance_state", None)
            answers = {a.question_id: a.answer_value for a in rsp.answers}
            data["response"] = answers
            return SurveyResponseResponse.model_validate(data)

    def create_survey(self, brand_id: int) -> SurveyFormResponse:
        with self.session_factory() as session:
            new_survey = Survey(brand_id=brand_id, title="", description="")
            session.add(new_survey)
            session.commit()
            session.refresh(new_survey)
            # 생성한 ORM 객체를 스키마로 변환하여 반환
            return SurveyFormResponse.model_validate(new_survey)

    def update_survey(self, survey_id: int, update_data: dict) -> SurveyFormResponse:
        with self.session_factory() as session:
            survey = session.query(Survey).filter(Survey.id == survey_id).first()
            if not survey:
                raise NotFoundError(f"Survey with id {survey_id} not found.")
            survey.title = update_data.get("title", survey.title)
            survey.description = update_data.get("description", survey.description)
            session.commit()
            session.refresh(survey)
            # 수정된 ORM 객체를 스키마로 변환하여 반환
            return SurveyFormResponse.model_validate(survey)

    def add_survey_questions(self, survey_id: int, questions_data: dict) -> SurveyFormResponse:
        with self.session_factory() as session:
            survey = session.query(Survey).filter(Survey.id == survey_id).first()
            if not survey:
                raise NotFoundError(f"Survey with id {survey_id} not found.")
            questions_array = questions_data.get("schemas", {}).get("questions", [])
            for question in questions_array:
                config = {}
                if "numericOnly" in question:
                    config["numericOnly"] = question["numericOnly"]
                if "multiSelect" in question:
                    config["multiSelect"] = question["multiSelect"]
                new_question = SurveyQuestion(
                    survey_id=survey_id,
                    order=question["id"],
                    type=question["type"].upper(),
                    title=question["title"],
                    description=question.get("description", ""),
                    config=config if config else None,
                    options=question.get("options"),
                    is_required=True
                )
                session.add(new_question)
            session.commit()
            session.refresh(survey)
            return SurveyFormResponse.model_validate(survey)


class ImageRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]], bucket_name: str = "socialing") -> None:
        self.session_factory = session_factory
        self.bucket_name = bucket_name

    def add(self, path: str, brand_review_id: int | None = None, brand_id: int | None = None) -> Image:
        with self.session_factory() as session:
            image = Image(bucket=self.bucket_name, path=path, brand_review_id=brand_review_id, brand_id=brand_id)
            session.add(image)
            session.commit()
            session.refresh(image)
            return image

    def get_image_by_id(self, image_id: int) -> Image:
        with self.session_factory() as session:
            return session.query(Image).filter(Image.id == image_id).first()

    def delete_images_by_brand_review_id(self, brand_review_id: int) -> None:
        """
        주어진 brand_review_id에 해당하는 모든 이미지를 DB에서 삭제합니다.
        """
        with self.session_factory() as session:
            images = session.query(Image).filter(Image.brand_review_id == brand_review_id).all()
            for image in images:
                session.delete(image)
            session.commit()
    
    def delete_image(self, image_id: int) -> None:
        """
        주어진 image_id를 가진 이미지 행을 DB에서 삭제합니다.
        """
        with self.session_factory() as session:
            img = session.query(Image).filter(Image.id == image_id).first()
            if img:
                session.delete(img)
                session.commit()


class BrandReviewRepository:
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session_factory = session_factory

    def add(self, review_create: BrandReviewCreate, owner_id: int) -> BrandReviewResponse:
        with self.session_factory() as session:
            new_review = BrandReview(
                user_id=review_create.user_id,
                brand_id=review_create.brand_id,
                contents="",      # 생성 시 후기는 빈 문자열로 초기화
                is_display=False, # 기본값
                owner_id=owner_id,
            )
            session.add(new_review)
            session.commit()
            session.refresh(new_review)
            # ORM 객체의 내부 속성을 매칭하여 스키마 반환
            return BrandReviewResponse.model_validate(new_review)

    def get_by_id(self, review_id: int) -> BrandReviewResponse:
        with self.session_factory() as session:
            review = session.query(BrandReview).options(joinedload(BrandReview.images)).filter(BrandReview.id == review_id).first()
            if not review:
                raise NotFoundError(f"리뷰 {review_id}를 찾을 수 없습니다.")
            return BrandReviewResponse.model_validate(review)

    def update(self, review_id: int, review_update: BrandReviewUpdate) -> BrandReviewResponse:
        with self.session_factory() as session:
            review: BrandReview | None = session.query(BrandReview).filter(BrandReview.id == review_id).first()
            if not review:
                raise NotFoundError(f"리뷰 {review_id}를 찾을 수 없습니다.")
            if review_update.contents is not None:
                review.contents = review_update.contents # type: ignore
            if review_update.is_display is not None:
                review.is_display = review_update.is_display # type: ignore
            
            session.commit()
            session.refresh(review)
            return BrandReviewResponse.model_validate(review)

    def delete_by_id(self, review_id: int) -> None:
        with self.session_factory() as session:
            review = session.query(BrandReview).filter(BrandReview.id == review_id).first()
            if not review:
                raise NotFoundError(f"리뷰 {review_id}를 찾을 수 없습니다.")
            session.delete(review)
            session.commit()

    def get_all(self, offset: int = 0, limit: int = 100, sort_by: str = "id", descending: bool = False, owner_id: int = 0) -> tuple[List[BrandReviewResponse], int]:
        with self.session_factory() as session:
            query = session.query(BrandReview).options(joinedload(BrandReview.images))
            if owner_id:
                query = query.filter(BrandReview.owner_id == owner_id)
            if hasattr(BrandReview, sort_by):
                column = getattr(BrandReview, sort_by)
                query = query.order_by(column.desc() if descending else column)
            total_count = query.count()
            reviews = query.offset(offset).limit(limit).all()
            return [BrandReviewResponse.model_validate(review) for review in reviews], total_count

# Add to repositories.py
class LandingPageSettingRepository:
    """
    랜딩 페이지 설정을 관리하는 리포지토리.
    키-값 형태로 설정을 저장하고 조회합니다.
    소유자별로 설정을 관리합니다.
    """
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]) -> None:
        self.session_factory = session_factory

    def get_setting(self, key: str, owner_id: Optional[int] = None) -> Optional[Any]:
        """특정 설정 키의 값을 가져옵니다. 소유자 ID로 필터링합니다."""
        with self.session_factory() as session:
            setting = session.query(LandingPageSetting.setting_value)\
                        .filter(LandingPageSetting.setting_key == key)
            if owner_id:
                setting = setting.filter(LandingPageSetting.owner_id == owner_id)
            return setting.scalar()

    def upsert_setting(self, key: str, value: Any, owner_id: int = 0) -> None:
        """설정 키-값을 추가하거나 업데이트합니다 (UPSERT). 소유자 ID를 포함합니다."""
        with self.session_factory() as session:
            # 먼저 기존 설정이 있는지 확인 (소유자 ID로 필터링)
            existing = session.query(LandingPageSetting)\
                        .filter(LandingPageSetting.setting_key == key)\
                        .filter(LandingPageSetting.owner_id == owner_id)\
                        .first()
            
            if existing:
                # 기존 설정이 있으면 업데이트
                existing.setting_value = value
            else:
                # 없으면 새로 생성 (소유자 ID 포함)
                new_setting = LandingPageSetting(
                    setting_key=key, 
                    setting_value=value,
                    owner_id=owner_id
                )
                session.add(new_setting)
            
            session.commit()

    def delete_setting(self, key: str, owner_id: int = 0) -> bool:
        """특정 설정 키를 삭제합니다. 소유자 ID로 필터링합니다. 삭제된 경우 True를 반환합니다."""
        with self.session_factory() as session:
            result = session.query(LandingPageSetting)\
                    .filter(LandingPageSetting.setting_key == key)\
                    .filter(LandingPageSetting.owner_id == owner_id)\
                    .delete()
            session.commit()
            return result > 0
            
    def get_all_settings_by_owner(self, owner_id: int = 0) -> Dict[str, Any]:
        """특정 소유자의 모든 설정을 조회합니다."""
        with self.session_factory() as session:
            settings = session.query(LandingPageSetting)\
                        .filter(LandingPageSetting.owner_id == owner_id)\
                        .all()
            return {setting.setting_key: setting.setting_value for setting in settings}  # type: ignore


class HostRegistRepository:
    """
    호스트 등록 신청 관련 리포지토리입니다.
    """
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory

    def _to_schema(self, host_regist: HostRegist) -> HostRegistResponse:
        # # ORM → dict 변환
        # host_regist_dict = host_regist.__dict__.copy()
        # host_regist_dict.pop("_sa_instance_state", None)
        # # user 관계도 dict로 변환
        # if host_regist.user:
        #     user_dict = host_regist.user.__dict__.copy()
        #     user_dict.pop("_sa_instance_state", None)
        #     host_regist_dict["user"] = UserResponse.model_validate(user_dict)
        return HostRegistResponse.model_validate(host_regist)

    def add(self, data: dict) -> HostRegistResponse:
        """
        호스트 등록 신청을 추가합니다.
        """
        with self.session_factory() as session:
            host_regist = HostRegist(**data)
            session.add(host_regist)
            session.commit()
            session.refresh(host_regist)
            # user 관계 로딩
            session.refresh(host_regist, attribute_names=["user"])
            return self._to_schema(host_regist)

    def get_by_id(self, host_regist_id: int) -> HostRegistResponse:
        """
        ID로 호스트 등록 신청을 조회합니다.
        """
        with self.session_factory() as session:
            host_regist = session.query(HostRegist).options(joinedload(HostRegist.user)).filter(HostRegist.id == host_regist_id).first()
            if not host_regist:
                raise NotFoundError(f"HostRegist with id {host_regist_id} not found")
            return self._to_schema(host_regist)

    def get_by_user_id(self, user_id: int) -> Optional[HostRegistResponse]:
        """
        사용자 ID로 호스트 등록 신청을 조회합니다.
        """
        with self.session_factory() as session:
            host_regist = session.query(HostRegist).options(joinedload(HostRegist.user)).filter(HostRegist.user_id == user_id).first()
            if not host_regist:
                return None
            return self._to_schema(host_regist)

    def get_by_user_username(self, username: str) -> List[HostRegistResponse]:
        """
        사용자 이름으로 호스트 등록 신청을 조회합니다.
        """
        with self.session_factory() as session:
            host_regists = session.query(HostRegist).join(User, HostRegist.user_id == User.id).filter(User.username == username).all()
            return [self._to_schema(host_regist) for host_regist in host_regists]
            
    def get_all(self, sort_by: str = "id", descending: bool = False, offset: int = 0, limit: int = 100) -> tuple[List[HostRegistResponse], int]:
        """
        모든 호스트 등록 신청을 조회합니다.
        """
        with self.session_factory() as session:
            query = session.query(HostRegist).options(joinedload(HostRegist.user))
            # 정렬 처리
            sort_column = getattr(HostRegist, sort_by, HostRegist.id)
            if descending:
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())
            # 페이지네이션 처리
            total_count = query.count()
            items = query.offset(offset).limit(limit).all()
            return [self._to_schema(item) for item in items], total_count

    def update(self, host_regist_id: int, data: dict) -> HostRegistResponse:
        """
        호스트 등록 신청 정보를 업데이트합니다.
        """
        with self.session_factory() as session:
            host_regist = session.query(HostRegist).options(joinedload(HostRegist.user)).filter(HostRegist.id == host_regist_id).first()
            if not host_regist:
                raise NotFoundError(f"HostRegist with id {host_regist_id} not found")
            for key, value in data.items():
                if hasattr(host_regist, key):
                    setattr(host_regist, key, value)
            session.commit()
            session.refresh(host_regist)
            return self._to_schema(host_regist)

    def update_state(self, host_regist_id: int, state: str) -> HostRegistResponse:
        """
        호스트 등록 상태를 업데이트합니다.
        """
        return self.update(host_regist_id, {"state": state})

    def delete_by_id(self, host_regist_id: int) -> None:
        """
        ID로 호스트 등록 신청을 삭제합니다.
        """
        with self.session_factory() as session:
            host_regist = session.query(HostRegist).filter(HostRegist.id == host_regist_id).first()
            if not host_regist:
                raise NotFoundError(f"HostRegist with id {host_regist_id} not found")
            session.delete(host_regist)
            session.commit()


class DocumentRepository:
    """Repository for managing documents in a MongoDB collection."""
    
    def __init__(self, get_collection: Callable[[str], Collection], collection_name: str) -> None:
        """
        MongoDB 컬렉션에 액세스하는 문서 리포지토리를 초기화합니다.
        
        Args:
            get_collection: 컬렉션 이름으로 컬렉션 객체를 반환하는 함수
            collection_name: 사용할 컬렉션 이름
        """
        self.get_collection = get_collection
        self.collection_name = collection_name
    
    @property
    def collection(self) -> Collection:
        """현재 리포지토리가 사용하는 컬렉션 객체를 반환합니다."""
        return self.get_collection(self.collection_name)
    
    def insert_one(self, document: Dict) -> Optional[str]:
        """컬렉션에 단일 문서를 삽입합니다."""
        try:
            # 생성 시간 추가
            if 'created_at' not in document:
                document['created_at'] = datetime.utcnow()
            
            result = self.collection.insert_one(document)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error inserting document into {self.collection_name}: {e}")
            return None
    
    def find_by_id(self, id: str) -> Optional[Dict]:
        """ID로 문서를 조회합니다."""
        try:
            result = self.collection.find_one({"_id": ObjectId(id)})
            if result and '_id' in result:
                result['_id'] = str(result['_id'])  # ObjectId를 문자열로 변환
            return result
        except Exception as e:
            logger.error(f"Error finding document by ID in {self.collection_name}: {e}")
            return None
    
    def find_many(
        self,
        filter_dict: Union[Dict, None] = None,
        sort_by: Optional[str] = None,
        descending: bool = True,
        limit: int = 0,
        skip: int = 0
    ) -> Tuple[List[Dict], int]:
        """여러 문서를 조회 (페이지네이션/정렬 지원, totalCount 반환)"""
        filter_dict = filter_dict or {}
        try:
            cursor = self.collection.find(filter_dict)
            if sort_by:
                cursor = cursor.sort([(sort_by, -1 if descending else 1)])
            if skip:
                cursor = cursor.skip(skip)
            if limit:
                cursor = cursor.limit(limit)
            total_count = self.collection.count_documents(filter_dict)
            results = list(cursor)
            for result in results:
                if '_id' in result:
                    result['_id'] = str(result['_id'])
            return results, total_count
        except Exception as e:
            logger.error(f"Error finding documents in {self.collection_name}: {e}")
            return [], 0
    
    def update_by_id(self, id: str, update_dict: Dict) -> Optional[int]:
        """ID로 문서를 업데이트합니다."""
        try:
            # 업데이트 시간 추가
            if '$set' in update_dict:
                update_dict['$set']['updated_at'] = datetime.utcnow()
            else:
                update_dict['$set'] = {'updated_at': datetime.utcnow()}
                
            result = self.collection.update_one(
                {"_id": ObjectId(id)}, 
                update_dict
            )
            return result.modified_count
        except Exception as e:
            logger.error(f"Error updating document in {self.collection_name}: {e}")
            return None
    
    def delete_by_id(self, id: str) -> Optional[int]:
        """ID로 문서를 삭제합니다."""
        try:
            result = self.collection.delete_one({"_id": ObjectId(id)})
            return result.deleted_count
        except Exception as e:
            logger.error(f"Error deleting document in {self.collection_name}: {e}")
            return None
    
    def count_documents(self, filter_dict: Union[Dict, None] = None) -> int:
        """문서 수를 계산합니다."""
        filter_dict = filter_dict or {}
        try:
            return self.collection.count_documents(filter_dict)
        except Exception as e:
            logger.error(f"Error counting documents in {self.collection_name}: {e}")
            return 0
