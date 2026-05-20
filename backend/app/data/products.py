"""Product catalog، pain bundles only (Nafas Kuwait). Prices mirror frontend/src/data/products.ts."""

PRODUCTS = {
    "cycle-relief": {
        "slug": "cycle-relief",
        "title_ar": "نظام راحة الدورة",
        "subtitle_ar": "الألم اللي تتحملينه بصمت كل شهر ،  فيه حل بالبيت",
        "base_price": 125,
        "anchor_single": 177,
        "tiers": [
            {"tier": 1, "label_ar": "بوكس واحد ،  لكِ", "price": 125, "anchor": 177, "badge": None},
            {"tier": 2, "label_ar": "بوكسين ،  لكِ ولأختك", "price": 209, "anchor": 250, "badge": "وفّري ١٣ د.ك"},
            {"tier": 3, "label_ar": "3 بوكسات ،  للعائلة", "price": 279, "anchor": 375, "badge": "الأكثر طلباً"},
        ],
        "includes": ["period-belt", "lumbar", "neck"],
        "post_upsell": {"sku": "head-massager", "title_ar": "عصابة مساج الرأس الكهربائية", "anchor": 74, "price": 52},
    },
    "body-relief": {
        "slug": "body-relief",
        "title_ar": "راحة الجسم",
        "subtitle_ar": "التكييف يريحك من الحر ويقتل ظهرك ورقبتك",
        "base_price": 128,
        "anchor_single": 179,
        "tiers": [
            {"tier": 1, "label_ar": "بوكس واحد ،  لكِ", "price": 128, "anchor": 179, "badge": None},
            {"tier": 2, "label_ar": "بوكسين", "price": 214, "anchor": 256, "badge": "وفّري ١٣ د.ك"},
            {"tier": 3, "label_ar": "3 بوكسات", "price": 294, "anchor": 384, "badge": "الأكثر طلباً"},
        ],
        "includes": ["lumbar", "neck", "head-massager"],
        "post_upsell": {"sku": "knee-sleeves", "title_ar": "دعامة ضغط للركبة ،  زوج لأمك", "anchor": 67, "price": 48},
    },
    "mother-gift": {
        "slug": "mother-gift",
        "title_ar": "هدية أمي",
        "subtitle_ar": "أمك ما تشتكي ،  أنتِ اللي تعرفين ألم ركبها",
        "base_price": 149,
        "anchor_single": 215,
        "tiers": [
            {"tier": 1, "label_ar": "بوكس واحد ،  هدية", "price": 149, "anchor": 215, "badge": None},
            {"tier": 2, "label_ar": "بوكسين ،  لكِ ولأمك", "price": 254, "anchor": 298, "badge": "وفّري ١٤ د.ك"},
            {"tier": 3, "label_ar": "3 بوكسات ،  للعائلة", "price": 349, "anchor": 447, "badge": "الأكثر طلباً"},
        ],
        "includes": ["period-belt", "knee-sleeves", "lumbar", "gift-box"],
        "post_upsell": {"sku": "lumbar", "title_ar": "ممدد ظهر إضافي لأمك", "anchor": 64, "price": 44},
    },
}

CROSS_SELLS = {
    "knee-sleeves": {"sku": "knee-sleeves", "title_ar": "دعامة ضغط للركبة ،  زوج", "price": 48},
    "lumbar": {"sku": "lumbar", "title_ar": "ممدد ظهر إضافي", "price": 44},
    "head-massager": {"sku": "head-massager", "title_ar": "عصابة مساج الرأس الكهربائية", "price": 52},
}

SKU_LABELS = {
    "period-belt": "حزام حرارة لاسلكي للدورة (USB)",
    "lumbar": "ممدد ومقوم أسفل الظهر",
    "neck": "مدلك كهربائي لاصق ،  رقبة وكتف",
    "head-massager": "عصابة مساج الرأس الكهربائية",
    "knee-sleeves": "دعامة ضغط للركبة (تريكو)",
    "gift-box": "تغليف هدية فاخر",
}
