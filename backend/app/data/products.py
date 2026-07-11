"""Product catalog, Nafas USA. Prices are USD; mirror frontend/src/data/products.ts."""

PRODUCTS = {
    "test": {
        "slug": "test",
        "title_ar": "Nafas Home Comfort Kit",
        "subtitle_ar": "At-home comfort devices, heat, back stretch, neck massager (not medical treatment)",
        "description_en": (
            "A three-piece Nafas comfort kit with a wireless warming belt, lower-back stretch arch, "
            "and adhesive neck massager. Designed for everyday home use. Not a medical device."
        ),
        "base_price": 77.4,
        "anchor_single": 112.9,
        "tiers": [
            {"tier": 1, "label_ar": "1 kit", "price": 77.4, "anchor": 77.4, "badge": None},
            {"tier": 2, "label_ar": "2 kits", "price": 96.8, "anchor": 96.8, "badge": None},
            {"tier": 3, "label_ar": "3 kits", "price": 119.4, "anchor": 119.4, "badge": None},
        ],
        "includes": ["period-belt", "lumbar", "neck"],
        "post_upsell": {"sku": "head-massager", "title_ar": "Electric headband massager", "anchor": 52, "price": 52},
        "google_product_category": "2330",
        "brand": "Nafas",
        "condition": "new",
        "mpn": "NF-TEST-KIT",
        "identifier_exists": False,
        "gtin": None,
        "shipping_weight_lb": 2.4,
    },
    "cycle-relief": {
        "slug": "cycle-relief",
        "title_ar": "Cycle Comfort Kit",
        "subtitle_ar": "Heat and stretch tools for comfortable days at home",
        "description_en": (
            "Nafas Cycle Comfort Kit includes a wireless warming belt, lower-back stretch arch, "
            "and adhesive neck & shoulder massager. Built for everyday home comfort during your cycle. "
            "Ships in the USA. At-home comfort devices only, not medical devices."
        ),
        "base_price": 77.4,
        "anchor_single": 112.9,
        "tiers": [
            {"tier": 1, "label_ar": "1 kit for you", "price": 77.4, "anchor": 77.4, "badge": None},
            {"tier": 2, "label_ar": "2 kits to share", "price": 96.8, "anchor": 96.8, "badge": None},
            {"tier": 3, "label_ar": "3 kits for the family", "price": 119.4, "anchor": 119.4, "badge": "Most popular"},
        ],
        "includes": ["period-belt", "lumbar", "neck"],
        "post_upsell": {"sku": "head-massager", "title_ar": "Electric headband massager", "anchor": 52, "price": 52},
        "google_product_category": "2330",
        "brand": "Nafas",
        "condition": "new",
        "mpn": "NF-CYCLE-KIT",
        "identifier_exists": False,
        "gtin": None,
        "shipping_weight_lb": 2.4,
    },
    "body-relief": {
        "slug": "body-relief",
        "title_ar": "Body Ease Kit",
        "subtitle_ar": "Desk days, long drives, and screen time: stretch and massage tools for home",
        "description_en": (
            "Nafas Body Ease Kit includes a lower-back stretch arch, adhesive neck massager, "
            "and electric headband massager. For everyday muscle tension from sitting, AC offices, "
            "and phones. At-home comfort devices only, not medical devices."
        ),
        "base_price": 77.4,
        "anchor_single": 112.9,
        "tiers": [
            {"tier": 1, "label_ar": "1 kit for you", "price": 77.4, "anchor": 77.4, "badge": None},
            {"tier": 2, "label_ar": "2 kits", "price": 96.8, "anchor": 96.8, "badge": None},
            {"tier": 3, "label_ar": "3 kits", "price": 119.4, "anchor": 119.4, "badge": "Most popular"},
        ],
        "includes": ["lumbar", "neck", "head-massager"],
        "post_upsell": {"sku": "knee-sleeves", "title_ar": "Compression knee sleeves (pair)", "anchor": 48, "price": 48},
        "google_product_category": "2330",
        "brand": "Nafas",
        "condition": "new",
        "mpn": "NF-BODY-KIT",
        "identifier_exists": False,
        "gtin": None,
        "shipping_weight_lb": 2.6,
    },
    "mother-gift": {
        "slug": "mother-gift",
        "title_ar": "Mom Gift Kit",
        "subtitle_ar": "A thoughtful comfort box for the woman who rarely asks for help",
        "description_en": (
            "Nafas Mom Gift Kit includes a wireless warming belt, compression knee sleeves (pair), "
            "lower-back stretch arch, and gift-ready packaging. A practical present for everyday "
            "comfort at home. At-home comfort devices only, not medical devices."
        ),
        "base_price": 77.4,
        "anchor_single": 112.9,
        "tiers": [
            {"tier": 1, "label_ar": "1 gift-ready kit", "price": 77.4, "anchor": 77.4, "badge": None},
            {"tier": 2, "label_ar": "2 kits for you and mom", "price": 96.8, "anchor": 96.8, "badge": None},
            {"tier": 3, "label_ar": "3 kits for the family", "price": 119.4, "anchor": 119.4, "badge": "Most popular"},
        ],
        "includes": ["period-belt", "knee-sleeves", "lumbar", "gift-box"],
        "post_upsell": {"sku": "lumbar", "title_ar": "Extra back stretch arch", "anchor": 44, "price": 44},
        "google_product_category": "2330",
        "brand": "Nafas",
        "condition": "new",
        "mpn": "NF-MOM-KIT",
        "identifier_exists": False,
        "gtin": None,
        "shipping_weight_lb": 2.8,
    },
}

CROSS_SELLS = {
    "knee-sleeves": {"sku": "knee-sleeves", "title_ar": "Compression knee sleeves (pair)", "price": 48},
    "lumbar": {"sku": "lumbar", "title_ar": "Extra back stretch arch", "price": 44},
    "head-massager": {"sku": "head-massager", "title_ar": "Electric headband massager", "price": 52},
}

SKU_LABELS = {
    "period-belt": "Wireless warming belt (USB rechargeable)",
    "lumbar": "Lower-back stretch arch",
    "neck": "Adhesive pulse massager for neck & shoulders",
    "head-massager": "Electric headband massager",
    "knee-sleeves": "Compression knee sleeves (pair)",
    "gift-box": "Gift-ready packaging",
}

SKU_HINTS = {
    "period-belt": "Wireless; 3 heat & vibration modes; USB charging",
    "lumbar": "Plastic arch; 3 height levels; no electricity",
    "neck": "Small adhesive pad with pulses, not a large pillow",
    "head-massager": "Forehead band; gentle pulses; 2 modes; USB charging",
    "knee-sleeves": "Knit compression; patella support; non-slip; pair",
    "gift-box": "Ready-to-gift packaging",
}

SINGLE_SKU_PRICES = {
    "period-belt": {"price": 62, "anchor": 62},
    "lumbar": {"price": 55, "anchor": 55},
    "neck": {"price": 60, "anchor": 60},
    "head-massager": {"price": 64, "anchor": 64},
    "knee-sleeves": {"price": 58, "anchor": 58},
    "gift-box": {"price": 40, "anchor": 40},
}

DEFAULT_SKU_QUANTITY = 50
