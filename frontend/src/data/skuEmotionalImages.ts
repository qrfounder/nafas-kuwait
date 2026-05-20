const sku = (name: string) => `/products/emotional/sku/${name}.png`

export const SKU_EMOTIONAL: Record<
  string,
  { src: string; caption_ar: string; mood: 'shame' | 'fear' | 'guilt' | 'relief' | 'hope' | 'love' }
> = {
  'period-belt': {
    src: sku('period-belt'),
    caption_ar: 'من مغص يثقل الشهر، إلى حرارة تريح',
    mood: 'relief',
  },
  lumbar: {
    src: sku('lumbar'),
    caption_ar: 'ظهر التكييف، ١٥ دقيقة تفرق',
    mood: 'relief',
  },
  neck: {
    src: sku('neck'),
    caption_ar: 'رقبة التلفون، راحة قبل ما يطول التعب',
    mood: 'hope',
  },
  'head-massager': {
    src: sku('head-massager'),
    caption_ar: 'صداع يطول الليل، عصابة قبل النوم',
    mood: 'hope',
  },
  'knee-sleeves': {
    src: sku('knee-sleeves'),
    caption_ar: 'ركبة أمك، دعامة خفيفة يومية',
    mood: 'love',
  },
  'gift-box': {
    src: sku('gift-box'),
    caption_ar: 'هدية تُستخدم، مو تُنسى',
    mood: 'love',
  },
}

export function skuEmotional(skuId: string) {
  return SKU_EMOTIONAL[skuId]
}
