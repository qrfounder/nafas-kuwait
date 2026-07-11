const sku = (name: string) => `/products/emotional/sku/${name}.png`

export const SKU_EMOTIONAL: Record<
  string,
  { src: string; caption_ar: string; mood: 'shame' | 'fear' | 'guilt' | 'relief' | 'hope' | 'love' }
> = {
  'period-belt': {
    src: sku('period-belt'),
    caption_ar: 'From a heavy cycle day to gentle heat at home',
    mood: 'relief',
  },
  lumbar: {
    src: sku('lumbar'),
    caption_ar: 'Desk back. fifteen minutes that help',
    mood: 'relief',
  },
  neck: {
    src: sku('neck'),
    caption_ar: 'Phone neck. ease before tension builds',
    mood: 'hope',
  },
  'head-massager': {
    src: sku('head-massager'),
    caption_ar: 'Long evenings. headband before bed',
    mood: 'hope',
  },
  'knee-sleeves': {
    src: sku('knee-sleeves'),
    caption_ar: 'Everyday knee support for walks',
    mood: 'love',
  },
  'gift-box': {
    src: sku('gift-box'),
    caption_ar: 'A gift she will use, not forget',
    mood: 'love',
  },
}

export function skuEmotional(skuId: string) {
  return SKU_EMOTIONAL[skuId]
}
