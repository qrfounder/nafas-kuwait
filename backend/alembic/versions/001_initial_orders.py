"""initial orders

Revision ID: 001
Revises:
Create Date: 2026-05-15

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_number", sa.String(32), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("customer_name", sa.String(200), nullable=False),
        sa.Column("customer_phone", sa.String(20), nullable=False),
        sa.Column("product_slug", sa.String(64), nullable=False),
        sa.Column("offer_tier", sa.Integer(), nullable=False),
        sa.Column("subtotal_usd", sa.Float(), nullable=False),
        sa.Column("total_usd", sa.Float(), nullable=False),
        sa.Column("upsell_accepted", sa.Boolean(), default=False),
        sa.Column("upsell_sku", sa.String(64), nullable=True),
        sa.Column("upsell_price_usd", sa.Float(), nullable=True),
        sa.Column("items_json", sa.Text(), nullable=False),
        sa.Column("currency_display", sa.String(8), default="USD"),
        sa.Column("source", sa.String(64), nullable=True),
        sa.Column("utm_source", sa.String(128), nullable=True),
        sa.Column("utm_campaign", sa.String(128), nullable=True),
        sa.Column("event_id", sa.String(64), nullable=True),
        sa.Column("fbp", sa.String(256), nullable=True),
        sa.Column("fbc", sa.String(256), nullable=True),
        sa.Column("ttclid", sa.String(256), nullable=True),
        sa.Column("status", sa.String(32), default="new"),
    )
    op.create_index("ix_orders_order_number", "orders", ["order_number"], unique=True)
    op.create_index("ix_orders_customer_phone", "orders", ["customer_phone"])

    op.create_table(
        "order_lines",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("orders.id"), nullable=False),
        sa.Column("sku", sa.String(64), nullable=False),
        sa.Column("title_ar", sa.String(256), nullable=False),
        sa.Column("qty", sa.Integer(), default=1),
        sa.Column("price_usd", sa.Float(), nullable=False),
        sa.Column("line_type", sa.String(32), default="product"),
    )


def downgrade() -> None:
    op.drop_table("order_lines")
    op.drop_table("orders")
