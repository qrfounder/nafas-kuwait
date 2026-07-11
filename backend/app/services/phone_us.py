import re

_US_LOCAL_RE = re.compile(r"^[2-9]\d{2}[2-9]\d{6}$")


def normalize_us_phone(raw: str) -> str | None:
    """Return 1 + 10-digit national number, or None if invalid."""
    if not raw:
        return None
    digits = re.sub(r"\D", "", raw.strip())
    if not digits:
        return None

    if digits.startswith("001"):
        digits = digits[3:]
    if digits.startswith("1") and len(digits) == 11:
        national = digits[1:]
        if _US_LOCAL_RE.match(national):
            return digits
        return None

    if len(digits) == 10 and _US_LOCAL_RE.match(digits):
        return "1" + digits

    return None


def validate_us_phone(raw: str) -> tuple[bool, str | None, str]:
    normalized = normalize_us_phone(raw)
    if normalized:
        return True, normalized, ""
    return (
        False,
        None,
        "Enter a valid US phone number (10 digits). Example: 4155552671",
    )
