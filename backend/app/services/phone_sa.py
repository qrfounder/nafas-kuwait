import re

_SA_RE = re.compile(r"^05\d{8}$")


def validate_saudi_phone(raw: str) -> tuple[bool, str | None, str]:
    digits = re.sub(r"\D", "", (raw or "").strip())
    if _SA_RE.fullmatch(digits):
        return True, digits, ""
    return (
        False,
        None,
        "أدخل رقم جوال سعودي يبدأ بـ 05 ويتكون من 10 أرقام.",
    )
