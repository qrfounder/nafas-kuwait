/**
 * Emotional scene images per bundle. Nafas brand (rose #8B3A52, cream #F7F5F2).
 * Generate via Nano Banana Pro using prompts in content/design/nanobanana-emotional-prompts.md
 */

export type EmotionalScene =
  | 'hero'
  | 'pain-before'
  | 'pain-after'
  | 'unboxing'
  | 'transformation'

export type EmotionalFrame = {
  src: string
  alt: string
  caption_ar: string
  mood: 'fear' | 'shame' | 'guilt' | 'relief' | 'hope' | 'love'
}

const e = (slug: string, scene: EmotionalScene) => `/products/emotional/${slug}/${scene}.png`

export const PRODUCT_EMOTIONAL: Record<
  string,
  Record<EmotionalScene, EmotionalFrame> & {
    whyBody: string
    boxBody: string
    howBody: string
  }
> = {
  'cycle-relief': {
    hero: {
      src: e('cycle-relief', 'hero'),
      alt: 'At-home comfort kit. Nafas warming belt',
      caption_ar: 'A calm home comfort routine',
      mood: 'hope',
    },
    'pain-before': {
      src: e('cycle-relief', 'pain-before'),
      alt: 'Quiet evening at home',
      caption_ar: 'A slower day at home',
      mood: 'shame',
    },
    'pain-after': {
      src: e('cycle-relief', 'pain-after'),
      alt: 'Using a Nafas comfort kit at home',
      caption_ar: 'A short session at home',
      mood: 'relief',
    },
    unboxing: {
      src: e('cycle-relief', 'unboxing'),
      alt: 'Nafas Cycle Comfort Kit box',
      caption_ar: 'Three different pieces, one kit',
      mood: 'hope',
    },
    transformation: {
      src: e('cycle-relief', 'transformation'),
      alt: 'Nafas Cycle Comfort Kit lifestyle',
      caption_ar: 'Home comfort tools',
      mood: 'relief',
    },
    whyBody:
      'A simple home kit for monthly comfort days: gentle heat, a back stretch arch, and a small neck massager. Built for short sessions at home, not a substitute for medical care.',
    boxBody:
      'Wireless warming belt + back stretch arch + adhesive neck massager. three different tools in one kit.',
    howBody:
      '1) Warming belt on the lower abdomen for a short session 2) Back arch for about 10 minutes 3) Neck massager before bed. Use only as feels comfortable.',
  },
  'body-relief': {
    hero: {
      src: e('body-relief', 'hero'),
      alt: 'Back and neck comfort after a long desk day. Nafas',
      caption_ar: 'Desk days and home stretch tools',
      mood: 'relief',
    },
    'pain-before': {
      src: e('body-relief', 'pain-before'),
      alt: 'Desk setup at home',
      caption_ar: 'Long sitting days',
      mood: 'fear',
    },
    'pain-after': {
      src: e('body-relief', 'pain-after'),
      alt: 'Using Nafas stretch and massage tools at home',
      caption_ar: 'A short evening routine',
      mood: 'relief',
    },
    unboxing: {
      src: e('body-relief', 'unboxing'),
      alt: 'Nafas Body Ease Kit box',
      caption_ar: 'Back, neck, head. desk-day kit',
      mood: 'hope',
    },
    transformation: {
      src: e('body-relief', 'transformation'),
      alt: 'Nafas Body Ease Kit lifestyle',
      caption_ar: 'Home comfort tools',
      mood: 'relief',
    },
    whyBody:
      'For people who sit a lot: a back stretch arch, adhesive neck massager, and headband massager for short sessions after work. Everyday home comfort, not medical treatment.',
    boxBody:
      'Back stretch arch (no electricity) + adhesive neck massager + headband massager.',
    howBody:
      'After work: arch about 15 minutes, then neck massager, then headband before bed if you like. Stop if anything feels uncomfortable.',
  },
  'mother-gift': {
    hero: {
      src: e('mother-gift', 'hero'),
      alt: 'A gift for mom. Nafas kit',
      caption_ar: 'A practical gift she can use',
      mood: 'love',
    },
    'pain-before': {
      src: e('mother-gift', 'pain-before'),
      alt: 'Thoughtful gift moment',
      caption_ar: 'A gift that shows you noticed',
      mood: 'guilt',
    },
    'pain-after': {
      src: e('mother-gift', 'pain-after'),
      alt: 'Opening a Nafas gift kit',
      caption_ar: 'Ready to use at home',
      mood: 'love',
    },
    unboxing: {
      src: e('mother-gift', 'unboxing'),
      alt: 'Nafas Mom Gift Kit box',
      caption_ar: 'Gift packaging + comfort tools',
      mood: 'hope',
    },
    transformation: {
      src: e('mother-gift', 'transformation'),
      alt: 'Nafas Mom Gift Kit',
      caption_ar: 'Gift-ready comfort kit',
      mood: 'love',
    },
    whyBody:
      'A practical gift box with a warming belt, compression knee sleeves, and a back stretch arch. plus gift-ready packaging. Home comfort tools, not medical devices.',
    boxBody:
      'Warming belt + compression knee sleeves (pair) + back stretch arch + gift packaging.',
    howBody:
      'Gift ready to open: belt for short heat sessions at home, knee sleeves for walks, arch for the back. Comfort products only.',
  },
}

export function getProductEmotional(slug: string) {
  return PRODUCT_EMOTIONAL[slug]
}

export function emotionalScene(slug: string, scene: EmotionalScene): EmotionalFrame | undefined {
  return PRODUCT_EMOTIONAL[slug]?.[scene]
}
