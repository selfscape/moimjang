"""Add owner to all

Revision ID: 3edfc2e495c7
Revises: 3f263b1c54eb
Create Date: 2025-05-11 23:34:10.304524

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3edfc2e495c7'
down_revision: Union[str, None] = '3f263b1c54eb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('brand_question_card_categories', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_brand_question_card_categories_owner_id", 'brand_question_card_categories', 'users', ['owner_id'], ['id'])
    op.add_column('brand_reviews', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_brand_reviews_owner_id", 'brand_reviews', 'users', ['owner_id'], ['id'])
    op.add_column('brands', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_brands_owner_id", 'brands', 'users', ['owner_id'], ['id'])
    op.add_column('channels', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_channels_owner_id", 'channels', 'users', ['owner_id'], ['id'])
    op.add_column('channel_users', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_channel_users_owner_id", 'channel_users', 'users', ['owner_id'], ['id'])
    op.add_column('games', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_games_owner_id", 'games', 'users', ['owner_id'], ['id'])
    op.add_column('groups', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_groups_owner_id", 'groups', 'users', ['owner_id'], ['id'])
    op.add_column('group_users', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_group_users_owner_id", 'group_users', 'users', ['owner_id'], ['id'])
    op.add_column('images', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_images_owner_id", 'images', 'users', ['owner_id'], ['id'])
    op.add_column('landing_page_settings', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_landing_page_settings_owner_id", 'landing_page_settings', 'users', ['owner_id'], ['id'])
    op.add_column('question_card_categories', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_question_card_categories_owner_id", 'question_card_categories', 'users', ['owner_id'], ['id'])
    op.add_column('question_cards', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_question_cards_owner_id", 'question_cards', 'users', ['owner_id'], ['id'])
    op.add_column('response_answers', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_response_answers_owner_id", 'response_answers', 'users', ['owner_id'], ['id'])
    op.add_column('reviews', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_reviews_owner_id", 'reviews', 'users', ['owner_id'], ['id'])
    op.add_column('survey_questions', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_survey_questions_owner_id", 'survey_questions', 'users', ['owner_id'], ['id'])
    op.add_column('survey_responses', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_survey_responses_owner_id", 'survey_responses', 'users', ['owner_id'], ['id'])
    op.add_column('surveys', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    op.create_foreign_key("fk_surveys_owner_id", 'surveys', 'users', ['owner_id'], ['id'])
    op.add_column('users', sa.Column('owner_id', sa.Integer(), nullable=True, server_default='228'))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'owner_id')
    op.drop_constraint("fk_surveys_owner_id", 'surveys', type_='foreignkey')
    op.drop_column('surveys', 'owner_id')
    op.drop_constraint("fk_survey_responses_owner_id", 'survey_responses', type_='foreignkey')
    op.drop_column('survey_responses', 'owner_id')
    op.drop_constraint("fk_survey_questions_owner_id", 'survey_questions', type_='foreignkey')
    op.drop_column('survey_questions', 'owner_id')
    op.drop_constraint("fk_reviews_owner_id", 'reviews', type_='foreignkey')
    op.drop_column('reviews', 'owner_id')
    op.drop_constraint("fk_response_answers_owner_id", 'response_answers', type_='foreignkey')
    op.drop_column('response_answers', 'owner_id')
    op.drop_constraint("fk_question_cards_owner_id", 'question_cards', type_='foreignkey')
    op.drop_column('question_cards', 'owner_id')
    op.drop_constraint("fk_question_card_categories_owner_id", 'question_card_categories', type_='foreignkey')
    op.drop_column('question_card_categories', 'owner_id')
    op.drop_constraint("fk_landing_page_settings_owner_id", 'landing_page_settings', type_='foreignkey')
    op.drop_column('landing_page_settings', 'owner_id')
    op.drop_constraint("fk_images_owner_id", 'images', type_='foreignkey')
    op.drop_column('images', 'owner_id')
    op.drop_constraint("fk_groups_owner_id", 'groups', type_='foreignkey')
    op.drop_column('groups', 'owner_id')
    op.drop_constraint("fk_group_users_owner_id", 'group_users', type_='foreignkey')
    op.drop_column('group_users', 'owner_id')
    op.drop_constraint("fk_games_owner_id", 'games', type_='foreignkey')
    op.drop_column('games', 'owner_id')
    op.drop_constraint("fk_channels_owner_id", 'channels', type_='foreignkey')
    op.drop_column('channels', 'owner_id')
    op.drop_constraint("fk_channel_users_owner_id", 'channel_users', type_='foreignkey')
    op.drop_column('channel_users', 'owner_id')
    op.drop_constraint("fk_brands_owner_id", 'brands', type_='foreignkey')
    op.drop_column('brands', 'owner_id')
    op.drop_constraint("fk_brand_reviews_owner_id", 'brand_reviews', type_='foreignkey')
    op.drop_column('brand_reviews', 'owner_id')
    op.drop_constraint("fk_brand_question_card_categories_owner_id", 'brand_question_card_categories', type_='foreignkey')
    op.drop_column('brand_question_card_categories', 'owner_id')
    # ### end Alembic commands ###
