"""store settings, redirects, product overrides

Revision ID: 003
Revises: 002
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "store_settings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("shop_url", sa.String(256), nullable=False),
        sa.Column("meta_pixel_id", sa.String(64), nullable=True),
        sa.Column("tiktok_pixel_id", sa.String(64), nullable=True),
        sa.Column("snap_pixel_id", sa.String(64), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )
    op.create_table(
        "redirects",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("from_path", sa.String(512), nullable=False),
        sa.Column("to_path", sa.String(1024), nullable=False),
        sa.Column("status_code", sa.Integer(), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column("note", sa.String(256), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )
    op.create_index("ix_redirects_from_path", "redirects", ["from_path"], unique=True)
    op.create_table(
        "product_overrides",
        sa.Column("slug", sa.String(64), primary_key=True),
        sa.Column("title_ar", sa.String(256), nullable=True),
        sa.Column("subtitle_ar", sa.String(512), nullable=True),
        sa.Column("base_price", sa.Float(), nullable=True),
        sa.Column("anchor_single", sa.Float(), nullable=True),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.Column("tiers_json", sa.Text(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("product_overrides")
    op.drop_index("ix_redirects_from_path", table_name="redirects")
    op.drop_table("redirects")
    op.drop_table("store_settings")
