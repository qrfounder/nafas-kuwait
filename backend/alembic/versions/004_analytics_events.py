"""analytics events

Revision ID: 004
Revises: 003
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "analytics_events",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("visitor_id", sa.String(64), nullable=False),
        sa.Column("session_id", sa.String(64), nullable=False),
        sa.Column("event_type", sa.String(48), nullable=False),
        sa.Column("path", sa.String(512), nullable=True),
        sa.Column("product_slug", sa.String(64), nullable=True),
        sa.Column("value", sa.Float(), nullable=True),
        sa.Column("ip_address", sa.String(64), nullable=True),
        sa.Column("country", sa.String(64), nullable=True),
        sa.Column("city", sa.String(128), nullable=True),
        sa.Column("user_agent", sa.String(512), nullable=True),
        sa.Column("referrer", sa.String(512), nullable=True),
        sa.Column("utm_source", sa.String(128), nullable=True),
        sa.Column("utm_medium", sa.String(128), nullable=True),
        sa.Column("utm_campaign", sa.String(128), nullable=True),
        sa.Column("utm_content", sa.String(128), nullable=True),
        sa.Column("metadata_json", sa.Text(), nullable=True),
    )
    op.create_index("ix_analytics_events_created_at", "analytics_events", ["created_at"])
    op.create_index("ix_analytics_events_visitor_id", "analytics_events", ["visitor_id"])
    op.create_index("ix_analytics_events_session_id", "analytics_events", ["session_id"])
    op.create_index("ix_analytics_events_event_type", "analytics_events", ["event_type"])
    op.create_index("ix_analytics_events_country", "analytics_events", ["country"])
    op.create_index("ix_analytics_events_city", "analytics_events", ["city"])
    op.create_index("ix_analytics_visitor_created", "analytics_events", ["visitor_id", "created_at"])
    op.create_index("ix_analytics_event_created", "analytics_events", ["event_type", "created_at"])


def downgrade() -> None:
    op.drop_index("ix_analytics_event_created", table_name="analytics_events")
    op.drop_index("ix_analytics_visitor_created", table_name="analytics_events")
    op.drop_index("ix_analytics_events_city", table_name="analytics_events")
    op.drop_index("ix_analytics_events_country", table_name="analytics_events")
    op.drop_index("ix_analytics_events_event_type", table_name="analytics_events")
    op.drop_index("ix_analytics_events_session_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_visitor_id", table_name="analytics_events")
    op.drop_index("ix_analytics_events_created_at", table_name="analytics_events")
    op.drop_table("analytics_events")
