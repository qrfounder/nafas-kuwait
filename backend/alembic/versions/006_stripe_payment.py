"""stripe payment fields on orders

Revision ID: 006
Revises: 005
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("customer_email", sa.String(254), nullable=True))
    op.add_column(
        "orders",
        sa.Column("payment_status", sa.String(32), nullable=False, server_default="pending"),
    )
    op.add_column("orders", sa.Column("stripe_session_id", sa.String(256), nullable=True))
    op.create_index("ix_orders_stripe_session_id", "orders", ["stripe_session_id"])


def downgrade() -> None:
    op.drop_index("ix_orders_stripe_session_id", table_name="orders")
    op.drop_column("orders", "stripe_session_id")
    op.drop_column("orders", "payment_status")
    op.drop_column("orders", "customer_email")
