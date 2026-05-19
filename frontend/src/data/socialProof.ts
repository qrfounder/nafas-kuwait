import { IMAGES } from './images'

export type Review = {
  id: string
  name: string
  area: string
  product: string
  date: string
  rating: number
  text: string
  initials: string
  photo: string
  photoCaption: string
}

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'سارة الع.',
    area: 'السالمية',
    product: 'نظام راحة الدورة',
    date: '12 مايو 2026',
    rating: 5,
    text: 'الحزام اللاسلكي على البطن يريحني أول يومين. ممدد الظهر استخدمه بعد التكييف — مو نفس الشي.',
    initials: 'سع',
    photo: IMAGES.reviews.heat,
    photoCaption: 'حزام حرارة لاسلكي — استخدام منزلي',
  },
  {
    id: '2',
    name: 'فاطمة م.',
    area: 'حولي',
    product: 'هدية أمي',
    date: '8 مايو 2026',
    rating: 5,
    text: 'طلبت هدية لأمي — دعامة الركبة والحزام والظهر في بوكس واحد. التأكيد على التلفون كان محترم.',
    initials: 'فم',
    photo: IMAGES.reviews.gift,
    photoCaption: 'دعامة الركبة — بوكس هدية أمي',
  },
  {
    id: '3',
    name: 'نورة الش.',
    area: 'الجابرية',
    product: 'راحة الجسم',
    date: '5 مايو 2026',
    rating: 5,
    text: 'البوكس فيه كل القطع اللي في الإعلان. الممدد والمدلك اللاصق مع بعض أنسب من قطعة وحدة.',
    initials: 'نش',
    photo: IMAGES.reviews.massage,
    photoCaption: 'ممدد الظهر والمدلك اللاصق',
  },
  {
    id: '4',
    name: 'مريم خ.',
    area: 'الفروانية',
    product: 'نظام راحة الدورة',
    date: '3 مايو 2026',
    rating: 5,
    text: 'دفع عند الاستلام بدون ما أحط بيانات بطاقة. هذا اللي خلاني أطلب.',
    initials: 'مخ',
    photo: IMAGES.reviews.cod,
    photoCaption: 'توصيل COD — الكويت',
  },
  {
    id: '5',
    name: 'هيا ع.',
    area: 'مشرف',
    product: 'بوكسين',
    date: '1 مايو 2026',
    rating: 4,
    text: 'طلبت بوكسين — واحد لي وواحد لأختي. السعر منطقي للي داخل البوكس.',
    initials: 'هع',
    photo: IMAGES.reviews.box,
    photoCaption: 'محتويات البوكس',
  },
  {
    id: '6',
    name: 'دلال ر.',
    area: 'العديلية',
    product: 'راحة الجسم',
    date: '28 أبريل 2026',
    rating: 5,
    text: 'ما يحتاج تجمّلين كلام طبي — بس أجهزة راحة بالبيت وتشتغل.',
    initials: 'در',
    photo: IMAGES.reviews.family,
    photoCaption: 'باقة العائلة',
  },
]

export const TRUST_STATS = {
  rating: 4.8,
  count: 312,
  kuwaitOnly: true,
  disclaimer: 'متوسط تقييم من طلبات COD داخل الكويت',
}

export const ORDER_STEPS = [
  {
    step: '1',
    title: 'تطلبين أونلاين',
    desc: 'تختارين الباقة وتدخلين عنوان الكويت ورقمك — بدون بطاقة.',
  },
  {
    step: '2',
    title: 'نتصل للتأكيد',
    desc: 'فريق تأكيد بالعربي يتصل خلال ساعات ويتحقق من العنوان.',
  },
  {
    step: '3',
    title: 'نوصّل داخل الكويت',
    desc: 'شحن من 24 إلى 48 ساعة لمعظم المناطق.',
  },
  {
    step: '4',
    title: 'تدفعين عند الاستلام',
    desc: 'تفحصين الطرد أولاً وتدفعين كاش أو KNET حسب المندوب.',
  },
]

export const FAQ_ITEMS = [
  {
    q: 'هل الدفع عند الاستلام فقط؟',
    a: 'نعم — ما نطلب بطاقة أونلاين. تدفعين عند استلام الطرد من المندوب.',
  },
  {
    q: 'كم يأخذ التوصيل؟',
    a: 'عادة 24–48 ساعة داخل الكويت بعد تأكيد الطلب على الهاتف.',
  },
  {
    q: 'هل المنتج علاج طبي؟',
    a: 'لا — أجهزة حرارة وتدليك للراحة المنزلية. إذا عندج حالة طبية استشيري طبيبج.',
  },
  {
    q: 'ماذا لو ما ناسبني؟',
    a: 'تواصلي معنا خلال 7 أيام من الاستلام عند وجود عيب في المنتج — نرتب الاستبدال.',
  },
]
