"""Product catalog — pain bundles only (Nafas Kuwait)."""

PRODUCTS = {
    "cycle-relief": {
        "slug": "cycle-relief",
        "title_ar": "نظام راحة الدورة",
        "subtitle_ar": "الألم اللي تتحملينه بصمت كل شهر — فيه حل بالبيت",
        "base_price": 49,
        "anchor_single": 98,
        "tiers": [
            {"tier": 1, "label_ar": "بوكس واحد — لكِ", "price": 49, "anchor": 98, "badge": None},
            {"tier": 2, "label_ar": "بوكسين — لكِ ولأختك", "price": 89, "anchor": 196, "badge": "وفّري $9"},
            {"tier": 3, "label_ar": "3 بوكسات — للعائلة", "price": 129, "anchor": 294, "badge": "الأكثر طلباً"},
        ],
        "includes": ["period-belt", "lumbar", "neck"],
        "post_upsell": {"sku": "head-massager", "title_ar": "عصابة مساج الرأس الكهربائية", "anchor": 78, "price": 39},
    },
    "body-relief": {
        "slug": "body-relief",
        "title_ar": "راحة الجسم",
        "subtitle_ar": "التكييف يريحك من الحر ويقتل ظهرك ورقبتك",
        "base_price": 52,
        "anchor_single": 104,
        "tiers": [
            {"tier": 1, "label_ar": "بوكس واحد — لكِ", "price": 52, "anchor": 104, "badge": None},
            {"tier": 2, "label_ar": "بوكسين", "price": 94, "anchor": 208, "badge": "وفّري $10"},
            {"tier": 3, "label_ar": "3 بوكسات", "price": 138, "anchor": 312, "badge": "الأكثر طلباً"},
        ],
        "includes": ["lumbar", "neck", "head-massager"],
        "post_upsell": {"sku": "knee-sleeves", "title_ar": "دعامة ضغط للركبة — زوج لأمك", "anchor": 58, "price": 29},
    },
    "mother-gift": {
        "slug": "mother-gift",
        "title_ar": "هدية أمي",
        "subtitle_ar": "أمك ما تشتكي — أنتِ اللي تعرفين ألم ركبها",
        "base_price": 55,
        "anchor_single": 118,
        "tiers": [
            {"tier": 1, "label_ar": "بوكس واحد — هدية", "price": 55, "anchor": 118, "badge": None},
            {"tier": 2, "label_ar": "بوكسين — لكِ ولأمك", "price": 99, "anchor": 236, "badge": "وفّري $11"},
            {"tier": 3, "label_ar": "3 بوكسات — للعائلة", "price": 145, "anchor": 354, "badge": "الأكثر طلباً"},
        ],
        "includes": ["period-belt", "knee-sleeves", "lumbar", "gift-box"],
        "post_upsell": {"sku": "lumbar", "title_ar": "ممدد ظهر إضافي لأمك", "anchor": 48, "price": 24},
    },
}

CROSS_SELLS = {
    "knee-sleeves": {"sku": "knee-sleeves", "title_ar": "دعامة ضغط للركبة — زوج", "price": 12},
    "lumbar": {"sku": "lumbar", "title_ar": "ممدد ظهر إضافي", "price": 10},
    "head-massager": {"sku": "head-massager", "title_ar": "عصابة مساج الرأس الكهربائية", "price": 15},
}

SKU_LABELS = {
    "period-belt": "حزام حرارة لاسلكي للدورة (USB)",
    "lumbar": "ممدد ومقوم أسفل الظهر",
    "neck": "مدلك كهربائي لاصق — رقبة وكتف",
    "head-massager": "عصابة مساج الرأس الكهربائية",
    "knee-sleeves": "دعامة ضغط للركبة (تريكو)",
    "gift-box": "تغليف هدية فاخر",
}
