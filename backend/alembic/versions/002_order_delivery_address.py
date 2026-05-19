"""order delivery address

Revision ID: 002
Revises: 001
Create Date: 2026-05-19

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("governorate", sa.String(64), nullable=True))
    op.add_column("orders", sa.Column("area", sa.String(128), nullable=True))
    op.add_column("orders", sa.Column("block", sa.String(32), nullable=True))
    op.add_column("orders", sa.Column("street", sa.String(128), nullable=True))
    op.add_column("orders", sa.Column("building", sa.String(64), nullable=True))
    op.add_column("orders", sa.Column("delivery_notes", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("orders", "delivery_notes")
    op.drop_column("orders", "building")
    op.drop_column("orders", "street")
    op.drop_column("orders", "block")
    op.drop_column("orders", "area")
    op.drop_column("orders", "governorate")
