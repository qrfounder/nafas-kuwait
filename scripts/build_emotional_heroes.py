#!/usr/bin/env python3
"""
Emotional product images — AI assets live under frontend/public/products/emotional/.

- pain-before.png / pain-after.png: generate with AI (see nanobanana-emotional-prompts.md).
  This script does NOT overwrite them by default (avoids wiping real scenes with gradients).

Optional: --force-mood-panels  → regenerate flat mood gradients for all bundles (legacy).

Hero + transformation: resized from existing hero.png when present.
"""

from __future__ import annotations

import argparse
from pathlib import Path

try:
    from PIL import Image, ImageFilter
except ImportError:
    raise SystemExit("pip install Pillow")

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "frontend/public/products/emotional"

BUNDLES = {
    "cycle-relief": {"before": (118, 128, 148), "after": (205, 142, 158)},
    "body-relief": {"before": (98, 122, 158), "after": (212, 152, 132)},
    "mother-gift": {"before": (128, 118, 128), "after": (222, 162, 142)},
}

HERO_W, HERO_H = 1200, 900


def mood_panel(rgb, w, h):
    img = Image.new("RGB", (w, h), rgb)
    px = img.load()
    for y in range(h):
        for x in range(w):
            vy = 1 - abs(y / h - 0.5) * 0.4
            vx = 1 - abs(x / w - 0.5) * 0.15
            px[x, y] = tuple(int(c * vy * vx) for c in rgb)
    return img.filter(ImageFilter.GaussianBlur(1.2))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--force-mood-panels",
        action="store_true",
        help="Overwrite pain-before/after with flat gradient placeholders (not recommended).",
    )
    args = ap.parse_args()

    for slug, cfg in BUNDLES.items():
        dest = OUT / slug
        dest.mkdir(parents=True, exist_ok=True)
        hero = dest / "hero.png"
        if not hero.exists():
            print("missing AI hero — generate:", hero)

        before_p = dest / "pain-before.png"
        after_p = dest / "pain-after.png"
        if args.force_mood_panels or not before_p.exists():
            mood_panel(cfg["before"], HERO_W, HERO_H).save(before_p, optimize=True, quality=90)
            print("wrote", before_p, "(mood panel)")
        else:
            print("keep", before_p)
        if args.force_mood_panels or not after_p.exists():
            mood_panel(cfg["after"], HERO_W, HERO_H).save(after_p, optimize=True, quality=90)
            print("wrote", after_p, "(mood panel)")
        else:
            print("keep", after_p)

        if hero.exists():
            im = Image.open(hero)
            im.resize((1600, 686), Image.Resampling.LANCZOS).save(
                dest / "transformation.png", optimize=True, quality=90
            )
            print("transformation", slug)


if __name__ == "__main__":
    main()
