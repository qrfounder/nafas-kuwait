#!/usr/bin/env python3
"""Convert review portraits to WebP: 200px, soft contrast, fast load."""

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
REVIEWS = ROOT / "frontend/public/reviews"
SIZE = 200
QUALITY = 82


def optimize(src: Path, dest: Path) -> None:
    img = Image.open(src).convert("RGB")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, (h - side) // 4)
    img = img.crop((left, top, left + side, top + side))
    img = img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    img = ImageEnhance.Contrast(img).enhance(0.9)
    img = ImageEnhance.Brightness(img).enhance(1.04)
    img = ImageEnhance.Color(img).enhance(0.95)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=QUALITY, method=6)
    print(f"{dest.name}: {dest.stat().st_size // 1024}KB")


def main():
    for png in sorted(REVIEWS.glob("review-*.png")):
        slug = png.stem.replace("review-", "")
        optimize(png, REVIEWS / f"review-{slug}.webp")
    for webp in sorted(REVIEWS.glob("review-*.webp")):
        if webp.with_suffix(".png").exists():
            continue
        optimize(webp, webp)


if __name__ == "__main__":
    main()
