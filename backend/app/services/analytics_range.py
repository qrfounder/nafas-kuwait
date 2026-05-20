from datetime import datetime, timedelta, timezone


def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def parse_range(
    preset: str | None,
    from_date: str | None,
    to_date: str | None,
) -> tuple[datetime, datetime, str]:
    now = utc_now()
    p = (preset or "week").lower().strip()

    if p == "custom" and from_date and to_date:
        start = datetime.fromisoformat(from_date.replace("Z", ""))
        end = datetime.fromisoformat(to_date.replace("Z", ""))
        if end.hour == 0 and end.minute == 0:
            end = end + timedelta(days=1) - timedelta(microseconds=1)
        return start, end, "custom"

    if p == "today":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        return start, now, "today"

    if p == "yesterday":
        end = now.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(microseconds=1)
        start = end.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1)
        return start, end, "yesterday"

    if p == "week":
        return now - timedelta(days=7), now, "week"

    if p == "month":
        return now - timedelta(days=30), now, "month"

    if p == "90d":
        return now - timedelta(days=90), now, "90d"

    return now - timedelta(days=7), now, "week"
