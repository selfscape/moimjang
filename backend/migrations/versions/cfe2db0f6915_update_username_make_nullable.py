"""Update username to be nullable and drop unique constraint

Revision ID: cfe2db0f6915
Revises: 9e7763fe6824
Create Date: 2025-03-07 11:04:47.811623

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cfe2db0f6915'
down_revision: Union[str, None] = '9e7763fe6824'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 기존 username 컬럼의 UNIQUE 제약조건 제거
    op.drop_constraint('users_username_key', 'users', type_='unique')
    op.alter_column('users', 'username',
                    existing_type=sa.VARCHAR(length=50),
                    nullable=True)


def downgrade() -> None:
    # non-nullable 복구 전, UNIQUE 제약조건 다시 생성
    op.alter_column('users', 'username',
                    existing_type=sa.VARCHAR(length=50),
                    nullable=False)
    op.create_unique_constraint('users_username_key', 'users', ['username'])
