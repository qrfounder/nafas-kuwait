"""sku inventory

Revision ID: 005
Revises: 004
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "sku_inventory",
        sa.Column("sku", sa.String(64), primary_key=True),
        sa.Column("label_ar", sa.String(256), nullable=False),
        sa.Column("hint_ar", sa.String(512), nullable=True),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("anchor", sa.Float(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("sku_inventory")
