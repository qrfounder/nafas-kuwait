import re

_KW_LOCAL_RE = re.compile(r"^[2-9]\d{7}$")


def normalize_kuwait_phone(raw: str) -> str | None:
    """Return 965 + 8-digit national number, or None if invalid."""
    if not raw:
        return None
    digits = re.sub(r"\D", "", raw.strip())
    if not digits:
        return None

    if digits.startswith("00965"):
        digits = digits[2:]
    if digits.startswith("965"):
        if len(digits) == 11 and _KW_LOCAL_RE.match(digits[3:]):
            return digits
        if len(digits) > 11:
            digits = digits[:11]
        if len(digits) == 11 and _KW_LOCAL_RE.match(digits[3:]):
            return digits
        return None

    if digits.startswith("0") and len(digits) == 9:
        digits = digits[1:]

    if len(digits) == 8 and _KW_LOCAL_RE.match(digits):
        return "965" + digits

    if len(digits) > 8 and digits.startswith("965") and len(digits) >= 11:
        cand = digits[:11]
        if _KW_LOCAL_RE.match(cand[3:]):
            return cand

    return None


def validate_kuwait_phone(raw: str) -> tuple[bool, str | None, str]:
    normalized = normalize_kuwait_phone(raw)
    if normalized:
        return True, normalized, ""
    return (
        False,
        None,
        "أدخلي رقم جوال أو أرضي كويتي (8 أرقام). مثال: 51234567 أو 22334455",
    )
