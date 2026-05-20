import { IMAGES } from './images'

export type ReviewPage = 'home' | 'collection' | 'cycle-relief' | 'body-relief' | 'mother-gift'

export type Review = {
  id: string
  name: string
  area: string
  product: string
  date: string
  rating: number
  text: string
  initials: string
  /** Customer portrait (Kuwait). */
  avatar: string
  /** Pages where this review should appear (always include "home"). */
  pages: ReviewPage[]
  /** Objection/theme for sorting (internal). */
  theme: string
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'سارة العتيبي',
    area: 'السالمية',
    product: 'نظام راحة الدورة',
    date: '14 مايو 2026',
    rating: 5,
    text: 'كنت مترددة من الإعلانات. الحزام على البطن أول يومين يريحني، وممدد الظهر بعد التكييف. ادفعت لما شفت الطرد، مو قبل.',
    initials: 'سع',
    avatar: IMAGES.reviewFaces.sara,
    pages: ['home', 'collection', 'cycle-relief'],
    theme: 'cod-trust',
  },
  {
    id: 'r2',
    name: 'مريم خالد',
    area: 'الفروانية',
    product: 'ادفعي عند الباب',
    date: '11 مايو 2026',
    rating: 5,
    text: 'ما حطيت رقم بطاقة ولا رابط دفع. المندوب جاب الطرد، فحصته، بعدين دفعت. هذا اللي يطمنج لو تخافين من النصب.',
    initials: 'مخ',
    avatar: IMAGES.reviewFaces.mariam,
    pages: ['home', 'collection', 'cycle-relief', 'body-relief', 'mother-gift'],
    theme: 'cod-scam',
  },
  {
    id: 'r3',
    name: 'نورة الشمري',
    area: 'الجابرية',
    product: 'راحة الجسم',
    date: '9 مايو 2026',
    rating: 5,
    text: 'خفت القطع تكون أصغر من الصورة. وصل نفس اللي بالموقع: ممدد، مدلك لاصق، عصابة رأس. مو قطعة وحدة مخفية.',
    initials: 'نش',
    avatar: IMAGES.reviewFaces.noura,
    pages: ['home', 'collection', 'body-relief', 'cycle-relief'],
    theme: 'box-match',
  },
  {
    id: 'r4',
    name: 'فاطمة المنصور',
    area: 'حولي',
    product: 'هدية أمي',
    date: '7 مايو 2026',
    rating: 5,
    text: 'أمي ما تشتكي بس تمسك ركبتها. البوكس فيه دعامة وحزام وظهر وتغليف. اتصلوا قبل الشحن، أسلوبهم محترم مو مزعج.',
    initials: 'فم',
    avatar: IMAGES.reviewFaces.fatima,
    pages: ['home', 'collection', 'mother-gift', 'cycle-relief', 'body-relief'],
    theme: 'mother-gift',
  },
  {
    id: 'r5',
    name: 'هيا العنزي',
    area: 'مشرف',
    product: 'ممدد ظهر (قطعة وحدة)',
    date: '5 مايو 2026',
    rating: 4,
    text: 'ما كنت أبي البوكس كامل. طلبت ممدد الظهر بس للتكييف بالشغل. وصل نفس الصورة، بلاستيك ثقيل مو رخيص.',
    initials: 'هع',
    avatar: IMAGES.reviewFaces.haya,
    pages: ['home', 'collection', 'body-relief', 'cycle-relief', 'mother-gift'],
    theme: 'single-piece',
  },
  {
    id: 'r6',
    name: 'دلال الرشيدي',
    area: 'العديلية',
    product: 'راحة الجسم',
    date: '3 مايو 2026',
    rating: 5,
    text: 'ما يقولون علاج ولا يوعدون شفاء. أجهزة راحة بالبيت. أنا استخدمهم للتعب، مو بدال دكتور.',
    initials: 'در',
    avatar: IMAGES.reviewFaces.dalal,
    pages: ['home', 'collection', 'body-relief', 'cycle-relief', 'mother-gift'],
    theme: 'not-medical',
  },
  {
    id: 'r7',
    name: 'ريم الصالح',
    area: 'الرميثية',
    product: 'نظام راحة الدورة',
    date: '1 مايو 2026',
    rating: 5,
    text: 'جربت قطعة من نون قبل، ما كملت الرقبة والبطن. هالبوكس ثلاث أشياء مختلفة، حسيت فرق لما استخدمتهم مع بعض.',
    initials: 'رص',
    avatar: IMAGES.reviewFaces.reem,
    pages: ['home', 'collection', 'cycle-relief', 'body-relief', 'mother-gift'],
    theme: 'vs-noon',
  },
  {
    id: 'r8',
    name: 'لولو المطيري',
    area: 'الفحيحيل',
    product: 'بوكسين للعائلة',
    date: '28 أبريل 2026',
    rating: 5,
    text: 'طلبت بوكسين، واحد لي وواحد لأختي. السعر منطقي لما تحسبين القطع. التوصيل خلال يومين بعد التأكيد.',
    initials: 'لم',
    avatar: IMAGES.reviewFaces.lulu,
    pages: ['home', 'collection', 'cycle-relief', 'mother-gift', 'body-relief'],
    theme: 'delivery',
  },
  {
    id: 'r9',
    name: 'شيخة الدوسري',
    area: 'بيان',
    product: 'راحة الجسم',
    date: '26 أبريل 2026',
    rating: 5,
    text: 'رقبتي من التلفون والحجاب. المدلك اللاصق صغير مو وسادة كبيرة، هذا اللي كنت أدوره. يشحن بالكابل.',
    initials: 'شد',
    avatar: IMAGES.reviewFaces.shaikha,
    pages: ['home', 'collection', 'body-relief', 'cycle-relief', 'mother-gift'],
    theme: 'neck-hijab',
  },
  {
    id: 'r10',
    name: 'أمل الزيد',
    area: 'القصور',
    product: 'هدية أمي',
    date: '24 أبريل 2026',
    rating: 4,
    text: 'خفت الهدية تطلع شكل بس. أمي استخدمت الحزام والدعامة أكثر من مرة. قالت خف ضغط الركبة وهي تمشي.',
    initials: 'أز',
    avatar: IMAGES.reviewFaces.amal,
    pages: ['home', 'collection', 'mother-gift', 'body-relief'],
    theme: 'gift-real-use',
  },
  {
    id: 'r11',
    name: 'موضي العازمي',
    area: 'الأحمدي',
    product: 'حزام الدورة (قطعة وحدة)',
    date: '22 أبريل 2026',
    rating: 5,
    text: 'ما أقدر أصرف على ثلاث قطع هالشهر. اخترت الحزام بس. يشحن بالكابل، ٣ أوضاع حرارة، يكفي أول يومين.',
    initials: 'مع',
    avatar: IMAGES.reviewFaces.moudi,
    pages: ['home', 'collection', 'cycle-relief', 'mother-gift'],
    theme: 'single-belt',
  },
  {
    id: 'r12',
    name: 'عائشة الهاجري',
    area: 'صباح السالم',
    product: 'راحة الجسم',
    date: '20 أبريل 2026',
    rating: 5,
    text: 'وصل مكسور مشبك صغير. تواصلت معاهم، بدلوه بدون فلسفة. هذا خلاني أطلب بوكس ثاني لأختي.',
    initials: 'عه',
    avatar: IMAGES.reviewFaces.aisha,
    pages: ['home', 'collection', 'body-relief', 'mother-gift', 'cycle-relief'],
    theme: 'returns',
  },
  {
    id: 'r13',
    name: 'منى السبيعي',
    area: 'السرة',
    product: 'نظام راحة الدورة',
    date: '18 أبريل 2026',
    rating: 5,
    text: 'أول مرة أطلب من متجر ما عرفته. التأكيد على التلفون كان بسيط: عنوان، وقت توصيل، خلاص. حسيته كويتي فعلاً.',
    initials: 'مس',
    avatar: IMAGES.reviewFaces.mona,
    pages: ['home', 'collection', 'cycle-relief', 'body-relief', 'mother-gift'],
    theme: 'phone-confirm',
  },
  {
    id: 'r14',
    name: 'زينب القحطاني',
    area: 'مبارك الكبير',
    product: 'دعامة ركبة (قطعة وحدة)',
    date: '16 أبريل 2026',
    rating: 5,
    text: 'طلبت دعامة الركبة لأمي بس، مو البوكس. تريكو ضغط، زوج للركبتين، ما انزلق. مناسبة للمشي اليومي.',
    initials: 'زق',
    avatar: IMAGES.reviewFaces.zainab,
    pages: ['home', 'collection', 'mother-gift', 'body-relief'],
    theme: 'single-knee',
  },
]

const MIN_REVIEWS = 10

/** At least 10 reviews per page; product-tagged first, then fill from pool. */
export function reviewsForPage(page: ReviewPage): Review[] {
  const forPage = REVIEWS.filter((r) => r.pages.includes(page))
  if (forPage.length >= MIN_REVIEWS) return forPage
  const fill = REVIEWS.filter((r) => !forPage.includes(r))
  return [...forPage, ...fill].slice(0, MIN_REVIEWS)
}

export const TRUST_STATS = {
  rating: 4.8,
  count: 312,
  kuwaitOnly: true,
  disclaimer: 'متوسط تقييم من طلبات داخل الكويت (ادفعي عند الباب)',
}

export const ORDER_STEPS = [
  {
    step: '1',
    title: 'تطلبين أونلاين',
    desc: 'اسمك ورقمك فقط، بدون بطاقة. عنوان التوصيل نثبّته معك بالمكالمة.',
  },
  {
    step: '2',
    title: 'نتصل للتأكيد',
    desc: 'خلّي جوالج قريب وشغال: نتصل خلال ساعة تقريباً في أوقات الدوام، نؤكد العنوان ونطلّع الشحنة.',
  },
  {
    step: '3',
    title: 'نوصّل داخل الكويت',
    desc: 'غالباً يوصل الطرد بين يوم وسبعة أيام من تأكيد المكالمة، حسب المنطقة والمندوب.',
  },
  {
    step: '4',
    title: 'تدفعين عند الاستلام',
    desc: 'تفحصين الطرد أولاً وتدفعين كاش أو KNET حسب المندوب.',
  },
]

export const FAQ_ITEMS = [
  {
    q: 'هل ادفعي عند الباب فقط؟',
    a: 'نعم، ما نطلب بطاقة أونلاين. تدفعين لما يوصل المندوب وتشوفين الطرد.',
  },
  {
    q: 'هل القطع نفس الصور؟',
    a: 'نعم، صور الموقع من المنتج الفعلي. البوكس يوضح كل قطعة قبل الطلب.',
  },
  {
    q: 'هل أقدر أطلب قطعة وحدة؟',
    a: 'نعم، من صفحة المنتج اختاري تبويب «قطعة واحدة» واختاري اللي يناسبج.',
  },
  {
    q: 'هل المنتج علاج طبي؟',
    a: 'لا، أجهزة حرارة وتدليك للراحة المنزلية. إذا عندج حالة طبية استشيري طبيبج.',
  },
  {
    q: 'ماذا لو ما ناسبني أو فيه عيب؟',
    a: 'تواصلي خلال 7 أيام عند وجود عيب، نرتب الاستبدال بدون تعقيد.',
  },
]
