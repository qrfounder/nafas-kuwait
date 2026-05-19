import hashlib


def sha256_lower(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode("utf-8")).hexdigest()


def hash_phone_meta(kuwait_digits: str) -> str:
    """Meta: digits only 96551234567, no +."""
    return sha256_lower(kuwait_digits)


def hash_phone_tiktok(kuwait_digits: str) -> str:
    """TikTok: E.164 with + prefix before hash."""
    return sha256_lower(f"+{kuwait_digits}")


def hash_name_meta(name: str) -> str:
    parts = name.strip().lower().split()
    if not parts:
        return ""
    return sha256_lower(parts[0])
