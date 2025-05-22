"""make id for pk in landingPagesettings 

Revision ID: b9a75c45fcef
Revises: 3edfc2e495c7
Create Date: 2025-05-16 00:45:41.214612

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine import Connection
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = 'b9a75c45fcef'
down_revision: Union[str, None] = '3edfc2e495c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### 기본 키 변경 과정 ###
    
    # 1. 기존 기본 키 제약 조건 삭제 (이름 지정 없이 삭제)
    op.execute('ALTER TABLE landing_page_settings DROP CONSTRAINT IF EXISTS landing_page_settings_pkey')
    
    # 2. 인덱스 삭제 (필요한 경우)
    op.drop_index(op.f('ix_landing_page_settings_setting_key'), table_name='landing_page_settings')
    
    # 3. id 컬럼 추가 (자동 증가 설정)
    op.add_column('landing_page_settings', sa.Column('id', sa.Integer(), nullable=True))
    
    # 4. 기존 행에 id 값 채우기 - 시퀀스 생성 및 값 할당
    conn = op.get_bind()
    conn.execute(text("CREATE SEQUENCE IF NOT EXISTS landing_page_settings_id_seq"))
    conn.execute(text("ALTER TABLE landing_page_settings ALTER COLUMN id SET DEFAULT nextval('landing_page_settings_id_seq')"))
    conn.execute(text("UPDATE landing_page_settings SET id = nextval('landing_page_settings_id_seq') WHERE id IS NULL"))
    
    # 5. id 컬럼을 NOT NULL로 변경
    op.alter_column('landing_page_settings', 'id', nullable=False)
    
    # 6. id를 새로운 기본 키로 설정
    op.create_primary_key('landing_page_settings_pkey', 'landing_page_settings', ['id'])
    
    # 7. 시퀀스를 테이블의 id 컬럼에 연결
    conn.execute(text("ALTER SEQUENCE landing_page_settings_id_seq OWNED BY landing_page_settings.id"))
    
    # 8. setting_key 컬럼을 NULL 허용으로 변경
    op.alter_column('landing_page_settings', 'setting_key',
               existing_type=sa.VARCHAR(length=255),
               nullable=True,
               existing_comment='설정 키 (예: main_image_id, gallery_image_ids)')
    
    # 9. setting_key에 대한 인덱스 재생성 (필요한 경우)
    op.create_index(op.f('ix_landing_page_settings_setting_key'), 'landing_page_settings', ['setting_key'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### 원래 상태로 되돌리기 ###
    
    # 1. id 기본 키 제약 조건 삭제
    op.drop_constraint('landing_page_settings_pkey', 'landing_page_settings', type_='primary')
    
    # 2. setting_key 인덱스 삭제 (필요한 경우)
    op.drop_index(op.f('ix_landing_page_settings_setting_key'), table_name='landing_page_settings')
    
    # 3. setting_key를 NOT NULL로 되돌리기
    op.alter_column('landing_page_settings', 'setting_key',
               existing_type=sa.VARCHAR(length=255),
               nullable=False,
               existing_comment='설정 키 (예: main_image_id, gallery_image_ids)')
    
    # 4. setting_key를 다시 기본 키로 설정
    op.create_primary_key('landing_page_settings_pkey', 'landing_page_settings', ['setting_key'])
    
    # 5. setting_key에 대한 인덱스 재생성 (필요한 경우)
    op.create_index(op.f('ix_landing_page_settings_setting_key'), 'landing_page_settings', ['setting_key'], unique=False)
    
    # 6. id 컬럼 삭제
    op.drop_column('landing_page_settings', 'id')
    
    # 7. 시퀀스 삭제
    conn = op.get_bind()
    conn.execute(text("DROP SEQUENCE IF EXISTS landing_page_settings_id_seq"))
    # ### end Alembic commands ###
