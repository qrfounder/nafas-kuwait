import re

_KW_MOBILE_PREFIXES = ("5", "6", "9")
_PHONE_RE = re.compile(r"^965([569]\d{7})$")


def normalize_kuwait_phone(raw: str) -> str | None:
    """Return 965XXXXXXXX or None if invalid."""
    if not raw:
        return None
    digits = re.sub(r"\D", "", raw.strip())
    if digits.startswith("00965"):
        digits = digits[2:]
    if digits.startswith("965"):
        pass
    elif len(digits) == 8 and digits[0] in _KW_MOBILE_PREFIXES:
        digits = "965" + digits
    else:
        return None
    if _PHONE_RE.match(digits):
        return digits
    return None


def validate_kuwait_phone(raw: str) -> tuple[bool, str | None, str]:
    normalized = normalize_kuwait_phone(raw)
    if normalized:
        return True, normalized, ""
    return False, None, "رقم الكويت غير صحيح. أدخلي 8 أرقام تبدأ بـ 5 أو 6 أو 9"
