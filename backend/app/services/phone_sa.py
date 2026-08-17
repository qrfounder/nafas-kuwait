import re

_ARABIC_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹", "01234567890123456789")
_SA_MOBILE = re.compile(r"^05\d{8}$")


def _digits_only(raw: str) -> str:
    return re.sub(r"\D", "", (raw or "").translate(_ARABIC_DIGITS).strip())


def normalize_saudi_phone(raw: str) -> str | None:
    """Return 05xxxxxxxx or None. Accepts +966, 966, 5xxxxxxxx, spaces, Arabic digits."""
    digits = _digits_only(raw)
    if digits.startswith("00966"):
        digits = digits[5:]
    elif digits.startswith("966"):
        digits = digits[3:]
    if digits.startswith("05") and len(digits) == 10 and _SA_MOBILE.fullmatch(digits):
        return digits
    if digits.startswith("5") and len(digits) == 9:
        return f"0{digits}"
    return None


def saudi_e164_digits(national_05: str) -> str:
    """9665xxxxxxxx for Meta/TikTok CAPI (no +)."""
    if national_05.startswith("0"):
        return f"966{national_05[1:]}"
    return f"966{national_05}"


def validate_saudi_phone(raw: str) -> tuple[bool, str | None, str]:
    normalized = normalize_saudi_phone(raw)
    if normalized:
        return True, normalized, ""
    return (
        False,
        None,
        "أدخل رقم جوال سعودي يبدأ بـ 05 ويتكون من 10 أرقام.",
    )
