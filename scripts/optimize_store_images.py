#!/usr/bin/env python3
"""
Generate WebP (+ responsive widths) for storefront images.
Run before build: python3 scripts/optimize_store_images.py
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "frontend/public"
MANIFEST_PATH = PUBLIC / "image-manifest.json"

QUALITY = 82
METHOD = 6

# max dimension + srcset widths per category
CATEGORIES: dict[str, tuple[int, list[int]]] = {
    "hero": (1400, [640, 960, 1400]),
    "showcase": (960, [400, 640, 960]),
    "pain": (640, [400, 640]),
    "transformation": (1200, [640, 960, 1200]),
    "catalog": (256, [128, 256]),
    "logo": (200, [128, 200]),
}

# Paths never referenced in the UI — skip conversion (delete separately)
SKIP_PATTERNS = (
    "unboxing.png",
    "complete-system.png",
    "/reviews/review-",
    "/emotional/sku/period-belt.png",
    "/emotional/sku/gift-box.png",
    "/emotional/sku/lumbar.png",
    "/emotional/sku/neck.png",
    "/emotional/sku/head-massager.png",
    "/emotional/sku/knee-sleeves.png",
    "-lifestyle.png",
    "knee-sleeves-box.png",
)


def category_for(path: Path) -> str | None:
    s = path.as_posix()
    if any(p in s for p in SKIP_PATTERNS):
        return None
    if path.suffix.lower() not in (".png", ".jpg", ".jpeg"):
        return None
    if "/brand/" in s:
        return "logo"
    if "-showcase" in s:
        return "showcase"
    if "pain-" in s or "/home/pain" in s:
        return "pain"
    if "transformation" in s:
        return "transformation"
    if "/products/" in s and "/emotional/" not in s:
        return "catalog"
    if "hero.png" in s:
        return "hero"
    if "/emotional/" in s:
        return "hero"
    return "hero"


def resize_cover(img: Image.Image, max_side: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_side:
        return img
    if w >= h:
        nw = max_side
        nh = int(h * max_side / w)
    else:
        nh = max_side
        nw = int(w * max_side / h)
    return img.resize((nw, nh), Image.Resampling.LANCZOS)


def save_webp(img: Image.Image, dest: Path) -> int:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")
    img.save(dest, "WEBP", quality=QUALITY, method=METHOD)
    return dest.stat().st_size


def optimize_file(path: Path) -> dict | None:
    cat = category_for(path)
    if cat is None:
        return None
    max_dim, widths = CATEGORIES[cat]
    img = Image.open(path)
    if img.mode == "P":
        img = img.convert("RGBA" if "transparency" in img.info else "RGB")

    rel = "/" + path.relative_to(PUBLIC).as_posix()
    base = path.with_suffix("")
    generated: list[int] = []

    for w in widths:
        variant = resize_cover(img.copy(), w)
        out = Path(f"{base}-{w}.webp")
        size_kb = save_webp(variant, out) // 1024
        generated.append(w)
        print(f"  {out.name}: {size_kb}KB")

    default = resize_cover(img, max_dim)
    main_out = Path(f"{base}.webp")
    save_webp(default, main_out)
    print(f"  {main_out.name} (main)")

    return {
        "src": rel,
        "webp": rel.replace(path.suffix, ".webp"),
        "widths": generated,
        "category": cat,
    }


def main() -> None:
    manifest: dict[str, dict] = {}
    pngs = sorted(PUBLIC.rglob("*.png")) + sorted(PUBLIC.rglob("*.jpg"))

    for path in pngs:
        if "/payments/" in path.as_posix():
            continue
        cat = category_for(path)
        if cat is None:
            continue
        print(path.relative_to(ROOT))
        entry = optimize_file(path)
        if entry:
            manifest[entry["src"]] = entry

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\nWrote {len(manifest)} entries → {MANIFEST_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
