# Nano Banana Pro — Nafas emotional product images

Generate **2K**, aspect **4:3** (hero, before, after, unboxing) or **21:9** (transformation wide).

**Brand:** Nafas (نفس) · rose `#8B3A52` · cream `#F7F5F2` · gold accent · soft luxury wellness · Kuwait home aesthetic · modest Khaleeji woman (hijab optional) · **no text in image** · no medical claims · cinematic editorial.

**Hero rule (required):** Split before/after emotional background (cool pain left, warm relief right). **Real product large in center (50–60% of frame)** on white/cream card, sharp focus. Product from `frontend/public/products/` reference. Background is mood only, not a second product photo.

**pain-before / pain-after (required):** Full cinematic lifestyle scenes (woman + environment + light), not flat color gradients. Same modest Khaleeji casting vibe as hero; **no text**; 4:3; export to paths below. The repo script `scripts/build_emotional_heroes.py` **does not** overwrite existing `pain-before.png` / `pain-after.png` (use `--force-mood-panels` only for emergency placeholders).

**Output paths** (save exactly):

```
frontend/public/products/emotional/{bundle}/{scene}.png
frontend/public/products/emotional/home/hero.png
frontend/public/products/emotional/home/pain-{cycle,back,neck}.png
```

| Bundle slug | Scenes |
|-------------|--------|
| `cycle-relief` | hero, pain-before, pain-after, unboxing, transformation |
| `body-relief` | hero, pain-before, pain-after, unboxing, transformation |
| `mother-gift` | hero, pain-before, pain-after, unboxing, transformation |

**Image-to-image:** Upload real product photo from `frontend/public/products/` when prompting unboxing scenes.

---

## cycle-relief — نظام راحة الدورة ($49)

### hero.png — hope
```
Cinematic lifestyle photo, Khaleeji woman in modest cream loungewear at home Kuwait apartment, relieved peaceful expression, wearing pink cordless period heating belt on lower abdomen, warm rose and cream color grade, soft window light, premium DTC wellness brand Nafas aesthetic, emotional hope after pain, no text
```

### pain-before.png — shame, silent suffering
```
Cinematic emotional portrait, Khaleeji woman alone on bed edge, hunched holding lower abdomen, menstrual pain, ashamed isolated mood, cool desaturated grey-blue lighting, fear of missing work, modest clothing hijab, shallow depth of field, no text, no gore
```

### pain-after.png — relief
```
Same woman calmer, gentle smile eyes closed, pink heating belt on abdomen, warm rose gold sunset lighting, relief and self-care at home, premium wellness, emotional afterglow, Kuwait interior soft bokeh, no text
```

### unboxing.png
```
Flat lay product photography, open premium cream gift box on marble surface, pink period heating belt, black lumbar back stretcher arch, white butterfly EMS neck pad, rose ribbon, Nafas luxury COD unboxing aesthetic, soft shadows, no text
```
**Reference images:** period-belt.png, lumbar.png, neck.png

### transformation.png — before/after split
```
Wide cinematic split composition, left side woman in pain holding stomach dark cool tones, right side same woman relieved with heating belt warm rose tones, clear before after emotional storytelling, Kuwait home, editorial advertising, no text labels
```
Aspect: **21:9**

---

## body-relief — راحة الجسم ($52)

### hero.png
```
Khaleeji working woman at home after office, relaxed on floor using black lumbar back stretcher, white EMS neck pad visible on shoulder, warm AC room Kuwait, rose cream color grade, back pain relief lifestyle, premium Nafas brand, hopeful mood, no text
```

### pain-before.png — fear, AC betrayal
```
Woman at desk under air conditioning vent, clutching lower back and neck, exhausted pain, blue cold lighting, phone on desk, emotional stress, modest office-home hybrid Kuwait, cinematic, no text
```

### pain-after.png
```
Same woman peaceful lying on back stretcher, neck pad attached, warm ambient lamp, relief expression, 15 minute evening routine, rose warm tones, no text
```

### unboxing.png
```
Flat lay black lumbar stretcher, white neck EMS butterfly pad, gold rose head massager headband, cream packaging tissue, body relief wellness box Nafas, studio lighting, no text
```
**References:** lumbar.png, neck.png, head-massager.png

### transformation.png
Aspect **21:9** — desk pain vs home relief split, cool vs warm.

---

## mother-gift — هدية أمي ($55)

### hero.png — love, guilt redeemed
```
Emotional scene daughter handing cream gift box to middle-aged Khaleeji mother at home, mother touching knee support sleeve box visible, warm golden hour, love and care, premium gift moment Kuwait, rose cream palette, no text
```

### pain-before.png — guilt
```
Middle-aged mother sitting quietly holding knee in pain, daughter watching worried in background soft focus, guilt love emotion, muted tones, mother does not complain visual story, modest dress, no text
```

### pain-after.png
```
Mother smiling wearing grey compression knee sleeve and pink heating belt, daughter beside her relieved, warm home interior, gift ribbon on table, emotional payoff, no text
```

### unboxing.png
```
Gift flat lay: pink heating belt, grey knee compression sleeves pair, black back stretcher, cream gift box with gold ribbon, Mother's day premium Kuwait COD, no text
```
**References:** period-belt.png, knee-sleeves.png, lumbar.png

### transformation.png
Aspect **21:9** — mother's silent knee pain vs happy with gift products.

---

## API quick reference (Nano Banana Pro)

```json
{
  "mode": "text-to-image",
  "resolution": "2K",
  "aspect_ratio": "4:3",
  "prompt": "..."
}
```

For `transformation.png` use `"aspect_ratio": "21:9"`.

Unboxing: use `"mode": "image-to-image"` + `input_images` = product PNG URLs.

After export, refresh: http://localhost:5173/product/cycle-relief
