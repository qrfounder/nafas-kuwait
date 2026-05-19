/**
 * Emotional scene images per bundle — Nafas brand (rose #8B3A52, cream #F7F5F2).
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
      alt: 'راحة بعد ألم الدورة — حزام حرارة نفس',
      caption_ar: 'من الصمت… إلى راحة تقدرين تشرحينها',
      mood: 'hope',
    },
    'pain-before': {
      src: e('cycle-relief', 'pain-before'),
      alt: 'ألم الدورة — تعب بصمت',
      caption_ar: 'الألم اللي ما تقدرين تشرحينه لأحد',
      mood: 'shame',
    },
    'pain-after': {
      src: e('cycle-relief', 'pain-after'),
      alt: 'راحة بعد استخدام نظام نفس',
      caption_ar: '١٥ دقيقة بالبيت — بدون صيدلية',
      mood: 'relief',
    },
    unboxing: {
      src: e('cycle-relief', 'unboxing'),
      alt: 'بوكس نظام راحة الدورة من نفس',
      caption_ar: '٣ قطع مختلفة — نظام واحد',
      mood: 'hope',
    },
    transformation: {
      src: e('cycle-relief', 'transformation'),
      alt: 'قبل وبعد — ألم الدورة وراحة نفس',
      caption_ar: 'قبل · بعد',
      mood: 'relief',
    },
    whyBody:
      'كل شهر نفس القصة: مغص يوقفج عن الشغل والخروج، وتتحملين بصمت لأن ما تبي تشرحين لأحد. مو عيب — بس يستاهل راحة بالبيت.',
    boxBody: 'حزام حرارة لاسلكي + ممدد ظهر + مدلك رقبة — ثلاث قطع مختلفة، مو قطعة رخيصة من النون.',
    howBody:
      '١) حزام على البطن ٢) ممدد الظهر ١٠ دقائق ٣) مدلك الرقبة قبل النوم — روتين واحد يريحج.',
  },
  'body-relief': {
    hero: {
      src: e('body-relief', 'hero'),
      alt: 'راحة الظهر والرقبة بعد التكييف — نفس',
      caption_ar: 'التكييف يريحك من الحر… ويقتل ظهرك',
      mood: 'relief',
    },
    'pain-before': {
      src: e('body-relief', 'pain-before'),
      alt: 'ألم ظهر ورقبة من التكييف والشغل',
      caption_ar: 'تعب ما يبان — بس أنتِ تعرفين',
      mood: 'fear',
    },
    'pain-after': {
      src: e('body-relief', 'pain-after'),
      alt: 'استرخاء بعد ممدد الظهر ومدلك الرقبة',
      caption_ar: 'بعد يوم طويل — تسترجعين جسمج',
      mood: 'relief',
    },
    unboxing: {
      src: e('body-relief', 'unboxing'),
      alt: 'بوكس راحة الجسم من نفس',
      caption_ar: 'ظهر · رقبة · رأس — بوكس الشغل والبيت',
      mood: 'hope',
    },
    transformation: {
      src: e('body-relief', 'transformation'),
      alt: 'قبل وبعد — ألم المكتب وراحة نفس',
      caption_ar: 'قبل · بعد',
      mood: 'relief',
    },
    whyBody:
      'التكييف والتلفون والحجاب — ظهرك ورقبتك يدفعون السعر كل يوم. الخوف إن الألم يزيد وانتِ ما تقدرين توقفين الشغل.',
    boxBody: 'ممدد ظهر (بدون كهرباء) + مدلك رقبة لاصق + عصابة رأس — نظام للي قاعدة طول اليوم.',
    howBody:
      'بعد الشغل: ممدد ١٥ دقيقة، مدلك رقبة، عصابة جبهة قبل النوم — بدون مسكنات كل ساعة.',
  },
  'mother-gift': {
    hero: {
      src: e('mother-gift', 'hero'),
      alt: 'هدية أمي — بوكس نفس',
      caption_ar: 'أمك ما تشتكي… بس أنتِ تعرفين',
      mood: 'love',
    },
    'pain-before': {
      src: e('mother-gift', 'pain-before'),
      alt: 'قلق على أمي وألم ركبتها',
      caption_ar: 'ذنب الحب — تبي تريحينها',
      mood: 'guilt',
    },
    'pain-after': {
      src: e('mother-gift', 'pain-after'),
      alt: 'أم مرتاحة بعد هدية نفس',
      caption_ar: 'هدية تستخدمها كل أسبوع',
      mood: 'love',
    },
    unboxing: {
      src: e('mother-gift', 'unboxing'),
      alt: 'بوكس هدية أمي من نفس',
      caption_ar: 'تغليف هدية + راحة حقيقية',
      mood: 'hope',
    },
    transformation: {
      src: e('mother-gift', 'transformation'),
      alt: 'قبل وبعد — هدية أمي من نفس',
      caption_ar: 'قبل · بعد',
      mood: 'love',
    },
    whyBody:
      'أمك ما تقول «تعبانة» — بس تشوفينها تمسك ركبتها وتسكت. الهدية مو بس غلاف؛ رسالة إنكِ فاهمتها.',
    boxBody: 'حزام حرارة + دعامة ركبة (زوج) + ممدد ظهر + تغليف هدية — بوكس واحد COD.',
    howBody:
      'اهديه البوكس جاهز — حزام للبطن، دعامة للركبة، ممدد للظهر. راحة بالبيت بدون كلام طبي.',
  },
}

export function getProductEmotional(slug: string) {
  return PRODUCT_EMOTIONAL[slug]
}

export function emotionalScene(slug: string, scene: EmotionalScene): EmotionalFrame | undefined {
  return PRODUCT_EMOTIONAL[slug]?.[scene]
}
