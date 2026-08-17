import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { getApiBase } from '../lib/apiBase'
import { trackStoreEvent } from '../lib/visitorAnalytics'
import './KsaLanding.css'

const CITIES = [
  'الرياض',
  'جدة',
  'مكة المكرمة',
  'المدينة المنورة',
  'الدمام',
  'الخبر',
  'الظهران',
  'الأحساء',
  'الطائف',
  'أبها',
  'خميس مشيط',
  'تبوك',
  'بريدة',
  'حائل',
  'جازان',
  'نجران',
  'ينبع',
  'الجبيل',
  'القطيف',
  'سكاكا',
  'عرعر',
]

const OFFERS = [
  { qty: 5, price: 340, qtyLabel: '٥ علب', priceLabel: '٣٤٠ ر.س', unit: '٦٨ ر.س للعلبة', badge: 'الأوفر', badgeClass: 'value' },
  { qty: 3, price: 280, qtyLabel: '٣ علب', priceLabel: '٢٨٠ ر.س', unit: '٩٣ ر.س للعلبة', badge: 'الأكثر مبيعاً', badgeClass: 'best' },
  { qty: 1, price: 179, qtyLabel: 'علبة واحدة', priceLabel: '١٧٩ ر.س', unit: 'تجربة أول مرة', badge: '', badgeClass: '' },
] as const

const LANDING_FAQS = [
  ['هل الدفع عند الاستلام؟', 'نعم. تدفع كاش للمندوب لما يوصلك الطلب. لا بطاقة ولا تحويل مقدم.'],
  ['كم ياخذ التوصيل؟', 'غالباً ٢٤ إلى ٤٨ ساعة داخل المملكة، حسب مدينتك.'],
  [
    'هل فيه آثار جانبية؟',
    'للاستخدام الخارجي فقط. لا تضعه على جرح مفتوح. إذا عندك حساسية معروفة من منتجات النحل، استشر مختصاً قبل الاستخدام.',
  ],
  ['كيف أختار الكمية؟', 'علبة للتجربة، ثلاث علب للبيت، خمس علب للأوفر سعر. لازم تختار عرض قبل تأكيد الطلب.'],
  ['متى يتصل المندوب؟', 'عادةً خلال أقل من ساعة على نفس رقم الجوال لتأكيد الطلب. خلّ الجوال قريب وجاوب حتى لو الرقم جديد.'],
  ['إذا ما لحقت الاتصال؟', 'نعاود الاتصال. لا تلغي الطلب. جاوب أول ما تقدر حتى نثبّت التوصيل.'],
  ['هل فيه تحدي ضمان ١٠٠٠ ريال؟', 'نعم. جرّب الدهان. إذا ما نفع خلال ٣٠ يوم نعوّضك بـ ١٠٠٠ ريال كاملة.'],
]

const THANKS_FAQS = [
  ['متى يتصل المندوب؟', 'عادةً خلال أقل من ساعة على نفس الجوال.'],
  ['أدفع الآن؟', 'لا. الدفع كاش عند الباب بعد ما يوصلك الطلب.'],
  ['إذا ما جاوبت؟', 'نعاود الاتصال. لا تلغي. جاوب أول ما تقدر.'],
  ['وش يصير بعد التأكيد؟', 'يطلع الطلب للتوصيل داخل المملكة. جهّز المبلغ كاش.'],
]

type ThanksData = {
  order: string
  name: string
  phone: string
  city: string
  qty: number
  price: number
}

export function KsaLandingPage() {
  const landingPath = useLocation().pathname.replace(/\/$/, '') || '/'
  const [qty, setQty] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [errs, setErrs] = useState({ name: false, phone: false, city: false, pack: false })
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [thanks, setThanks] = useState<ThanksData | null>(null)
  const [busy, setBusy] = useState(false)
  const [submitErr, setSubmitErr] = useState('')
  const scrolled = useRef(false)
  const formStarted = useRef(false)
  const price = useMemo(() => OFFERS.find((o) => o.qty === qty)?.price ?? null, [qty])

  useEffect(() => {
    const html = document.documentElement
    const prevLang = html.lang
    const prevDir = html.dir
    html.lang = 'ar'
    html.dir = 'rtl'
    document.title = 'خلطة أجدادنا كريم المفاصل والعظام'
    return () => {
      html.lang = prevLang
      html.dir = prevDir
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (scrolled.current) return
      const doc = document.documentElement
      if (doc.scrollHeight <= window.innerHeight) return
      if (window.scrollY / (doc.scrollHeight - window.innerHeight) < 0.5) return
      scrolled.current = true
      trackStoreEvent('view_content', { path: landingPath, product_slug: 'khalta-ajdadna', metadata: { step: 'scroll' } })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [landingPath])

  function pickOffer(next: number) {
    setQty(next)
    setErrs((e) => ({ ...e, pack: false }))
    trackStoreEvent('add_to_cart', {
      path: landingPath,
      product_slug: 'khalta-ajdadna',
      value: OFFERS.find((o) => o.qty === next)?.price,
      metadata: { step: 'choose_offer', qty: next },
    })
  }

  function markForm() {
    if (formStarted.current) return
    formStarted.current = true
    trackStoreEvent('checkout_form_start', { path: landingPath, product_slug: 'khalta-ajdadna', metadata: { step: 'fill_form' } })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const nameBad = name.trim().length < 2
    const phoneBad = !/^05\d{8}$/.test(phone.trim())
    const cityBad = !city.trim()
    const packBad = qty == null
    setErrs({ name: nameBad, phone: phoneBad, city: cityBad, pack: packBad })
    trackStoreEvent('checkout_visit', {
      path: landingPath,
      product_slug: 'khalta-ajdadna',
      metadata: { step: 'cta_click', valid: !(nameBad || phoneBad || cityBad || packBad) },
    })
    if (nameBad || phoneBad || cityBad || packBad) return

    setBusy(true)
    setSubmitErr('')
    try {
      const res = await fetch(`${getApiBase()}/api/orders/cod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          city: city.trim(),
          qty,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { order_number?: string; detail?: unknown }
      if (!res.ok || !data.order_number) {
        const d = data.detail
        const msg =
          typeof d === 'string'
            ? d
            : Array.isArray(d)
              ? d.map((x: { msg?: string }) => x.msg).filter(Boolean).join(' ')
              : 'تعذر إرسال الطلب. حاول مرة أخرى.'
        setSubmitErr(msg)
        return
      }
      const chosen = OFFERS.find((o) => o.qty === qty)!
      setThanks({
        order: data.order_number,
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        qty: chosen.qty,
        price: chosen.price,
      })
      trackStoreEvent('purchase', {
        path: '/thank-you',
        product_slug: 'khalta-ajdadna',
        value: chosen.price,
        metadata: { step: 'thank_you', order_number: data.order_number, qty: chosen.qty },
      })
    } catch {
      setSubmitErr('تعذر الاتصال. تأكد من الشبكة وحاول مرة أخرى.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ksa-landing">
      <div className="topbar">
        <div className="announce">
          <span>شحن مجاني وسريع داخل المملكة</span>
          <span>ضمان استرجاع 30 يوم</span>
          <span>ادفع عند الاستلام</span>
        </div>
        <div className="stockbar">متبقي 20 عبوة فقط في المخزون هذا الأسبوع. اطلب قبل النفاد</div>
      </div>

      <div className="wrap">
        <section className="hero">
          <h1>ودّع ألم المفاصل. الخلطة جاهزة من العلبة</h1>
          <p className="lede">سنام الجمل + مستخلص سم النحل + كولاجين. بدون نار، بدون سوق، ادفع عند الباب من 179 ر.س.</p>
          <div className="hero-photo">
            <img src="/landing/product-xicamel.png" alt="علبة وكريم خلطة أجدادنا للمفاصل والعظام" />
          </div>
          <div className="rating" aria-label="تقييم 4.8 من 5 بناءً على 186 تقييم">
            <div className="rating-stars">★★★★★</div>
            <div className="rating-meta">
              <b>4.8</b> من 5 · 186 تقييم
            </div>
            <div className="rating-sub">من عملاء في الرياض وجدة والدمام والخبر</div>
          </div>
          <a className="btn" href="#order">
            اطلب الآن. الدفع عند الاستلام
          </a>
          <div className="trust">
            <span>
              <i className="dot">✓</i> شحن مجاني
            </span>
            <span>
              <i className="dot">✓</i> ضمان 30 يوم
            </span>
            <span>
              <i className="dot">✓</i> ادفع عند الاستلام
            </span>
          </div>
        </section>

        <section className="spotlight">
          <div>
            <h2>رقبة، ظهر، ركب. ادهن وخلّص، بدون خلط في البيت</h2>
            <ul className="checks">
              <li>
                <span className="check">✓</span> تركيبة طبيعية وآمنة. سم النحل + عناية بالمفاصل
              </li>
              <li>
                <span className="check">✓</span> لآلام الرقبة، الظهر، الركب، الكوع والكاحل
              </li>
              <li>
                <span className="check">✓</span> سريع الامتصاص وسهل الدلك صباحاً ومساءً
              </li>
              <li>
                <span className="check">✓</span> جاهز من العلبة، بدون خلط في البيت
              </li>
            </ul>
            <a className="btn" href="#order">
              اطلب الآن
            </a>
          </div>
          <div className="photo-frame">
            <img src="/landing/product-xicamel.png" alt="كريم خلطة أجدادنا للمفاصل والعظام" />
          </div>
        </section>

        <section className="section">
          <div className="center">
            <h2>لمن هذا الدهان؟</h2>
            <p className="lede">إذا الألم في الرقبة أو الظهر أو الركب أو الكوع أو الكاحل فهذا مكانه.</p>
          </div>
          <div className="pains">
            <div className="pain">
              <b>رقبة</b>شدّ ويبوسة
            </div>
            <div className="pain">
              <b>ظهر</b>أسفل الظهر
            </div>
            <div className="pain">
              <b>ركب</b>بعد الدرج
            </div>
            <div className="pain">
              <b>كوع</b>مفصل اليد
            </div>
            <div className="pain">
              <b>كاحل</b>بعد المشي
            </div>
          </div>
        </section>
      </div>

      <section className="recipe" id="ingredients">
        <div className="wrap">
          <h2>وش داخل العلبة؟ تسعة مكوّنات… جاهزة ومتوازنة</h2>
          <p className="lede">نفس وصفة السنام والآلية والكولاجين. زدنا مستخلص سم النحل. تشتري علبة واحدة بدل تسعة أصناف بالمفرّق.</p>
          <div className="ing-grid">
            <div className="ing">
              <span>شحم سنام الجمل (طازج)</span>
              <b>100 غرام</b>
            </div>
            <div className="ing">
              <span>آلية شاه عربية</span>
              <b>100 غرام</b>
            </div>
            <div className="ing">
              <span>زيت حبة البركة</span>
              <b>ملعقة كبيرة</b>
            </div>
            <div className="ing">
              <span>كولاجين بودرة (بحري أو بقري)</span>
              <b>ملعقتان كبيرتان</b>
            </div>
            <div className="ing">
              <span>زنجبيل مطحون</span>
              <b>ملعقة صغيرة</b>
            </div>
            <div className="ing">
              <span>كركم مطحون</span>
              <b>ملعقة صغيرة</b>
            </div>
            <div className="ing">
              <span>زيت زيتون</span>
              <b>3 ملاعق كبيرة</b>
            </div>
            <div className="ing">
              <span>لبان ذكر مطحون (اختياري)</span>
              <b>ملعقة صغيرة</b>
            </div>
            <div className="ing star">
              <span>مستخلص سم النحل: الجرعة الجاهزة، مو مكوّن تشتريه من البقالة</span>
              <b>مضبوط في العلبة</b>
            </div>
          </div>

          <h2>لو تحضّرها في البيت: سوق، نار، ميزان، وباقي يتلف</h2>
          <ol className="prep">
            <li>
              <span className="num">١</span> ذوّب شحم السنام والآلية على نار هادئة أو حمام مائي حتى يصيران سائلين.
            </li>
            <li>
              <span className="num">٢</span> ارفعه عن النار، هدّه، ثم أضف زيت الزيتون وحبة البركة وقلّب.
            </li>
            <li>
              <span className="num">٣</span> أضف الكولاجين تدريجياً. ما يذوب بالكامل، وهذا طبيعي، بس يحتاج يد.
            </li>
            <li>
              <span className="num">٤</span> أضف الزنجبيل والكركم واللبان وقلّب حتى يتوحّد اللون والريحة.
            </li>
            <li>
              <span className="num">٥</span> سم النحل: في البيت صعب تلاقي مستخلص نقي وتوزّن الجرعة بدون هدر أو خطر.
            </li>
            <li>
              <span className="num">٦</span> اسكب، برّد، استنى يتماسك. بعدين دلك مرتين يومياً.
            </li>
          </ol>

          <div className="why">
            <div className="card">
              <h3>تحضير بنفسك</h3>
              <ul>
                <li>تشتري 9 أصناف بالمفرّق. غالباً أكياس وأحواض أكبر من وصفة واحدة، والباقي يتلف.</li>
                <li>شحم سنام طازج وآلية شاه مو في كل سوق، وتحتاج وقت بحث وثلاجة.</li>
                <li>مستخلص سم النحل غالي بالمفرّق وصعب تضبط نسبته في البيت.</li>
                <li>ساعات على النار + تبريد + تجربة الخلطة. الغلط = ضياع المكونات.</li>
              </ul>
            </div>
            <div className="card win">
              <h3>علبة جاهزة منّا</h3>
              <ul>
                <li>نفس الوصفة + مستخلص سم النحل، موزونة وجاهزة.</li>
                <li>من 179 ر.س للعلبة، أرخص من ما تدفعه وأنت تجمّع المفرّق وترمّي الزيادة.</li>
                <li>بدون نار، بدون ميزان، بدون بحث في السوق.</li>
                <li>شحن مجاني · ادفع عند الاستلام · ضمان 30 يوم.</li>
              </ul>
              <a className="btn btn-gold" href="#order" style={{ marginTop: 16, width: '100%' }}>
                خذ الخلطة جاهزة من 179 ر.س
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="guarantee">
            <h2>تحدي الضمان</h2>
            <p>جرّب الدهان. إذا ما نفع معك وما انتهت مشاكلك في أقل من ٣٠ يوم، نعوّضك بـ ١٠٠٠ ريال كاملة.</p>
          </div>
        </div>
      </section>

      <section className="order-band" id="order">
        <div className="wrap">
          <div className="center">
            <span className="order-kicker">اطلب الآن. هذا صندوق الطلب</span>
            <h2>اختر الكمية وأكمل بياناتك</h2>
            <p className="lede" style={{ marginBottom: 0 }}>
              العروض والاسم والجوال في مكان واحد. لازم تختار عرض قبل التأكيد.
            </p>
          </div>
          <div className="offers" role="radiogroup" aria-label="العروض">
            {OFFERS.map((o) => (
              <div
                key={o.qty}
                className="offer"
                role="radio"
                tabIndex={0}
                aria-checked={qty === o.qty}
                onClick={() => pickOffer(o.qty)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    pickOffer(o.qty)
                  }
                }}
              >
                {o.badge ? <span className={`badge ${o.badgeClass}`}>{o.badge}</span> : null}
                <div className="qty">{o.qtyLabel}</div>
                <div className="price">{o.priceLabel}</div>
                <div className="unit">{o.unit}</div>
                <div className="radio" />
              </div>
            ))}
          </div>

          <form className="cod" noValidate onSubmit={onSubmit}>
            <label>
              الاسم الكريم
              <input
                name="name"
                autoComplete="name"
                placeholder="اكتب اسمك"
                value={name}
                className={errs.name ? 'invalid' : ''}
                onChange={(e) => {
                  setName(e.target.value)
                  markForm()
                }}
              />
              <span className={`field-err${errs.name ? ' show' : ''}`}>اكتب الاسم الكريم حتى نقدر نوصّل الطلب.</span>
            </label>
            <label>
              رقم الجوال
              <input
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="05xxxxxxxx"
                value={phone}
                className={errs.phone ? 'invalid' : ''}
                onChange={(e) => {
                  setPhone(e.target.value)
                  markForm()
                }}
              />
              <span className={`field-err${errs.phone ? ' show' : ''}`}>أدخل رقم جوال سعودي يبدأ بـ 05 ويتكون من 10 أرقام.</span>
            </label>
            <label>
              المدينة
              <select
                name="city"
                value={city}
                className={errs.city ? 'invalid' : ''}
                onChange={(e) => {
                  setCity(e.target.value)
                  markForm()
                }}
              >
                <option value="">اختَر مدينتك</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className={`field-err${errs.city ? ' show' : ''}`}>اختَر المدينة حتى يوصلك المندوب.</span>
            </label>
            <div className="total-row">
              <span>الإجمالي</span>
              <span>{price == null ? 'اختر عرضاً' : `${price} ر.س`}</span>
            </div>
            <p className={`err${errs.pack ? ' show' : ''}`}>اختر الكمية أولاً حتى نقدر نكمّل طلبك.</p>
            {submitErr ? <p className="err show">{submitErr}</p> : null}
            <button className="btn btn-gold" type="submit" disabled={busy}>
              {busy ? 'جارٍ الإرسال…' : 'تأكيد الطلب. الدفع عند الاستلام'}
            </button>
          </form>
          <div className="ship">توصيل سريع لكل مناطق المملكة · الدفع كاش عند الاستلام · لا تحتاج بطاقة</div>
        </div>
      </section>

      <div className="wrap">
        <section className="section">
          <div className="center">
            <h2>ماذا يقول من جرّبوا الدهان</h2>
          </div>
          <div className="reviews">
            <article className="review">
              <div className="who">
                <img className="av" src="/landing/review-3.jpg" alt="أبو عبدالله" style={{ objectPosition: '50% 18%' }} />
                <div>
                  <strong>أبو عبدالله، الرياض</strong>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p>كنت أصحى والرقبة يابسة. بعد أسبوع دلك بالكريم خفّ الشد وصرت أتحرك أريح.</p>
            </article>
            <article className="review">
              <div className="who">
                <img className="av" src="/landing/review-woman2.jpg" alt="نورة" style={{ objectPosition: '50% 12%' }} />
                <div>
                  <strong>نورة، جدة</strong>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p>ركبتي بعد الدرج كانت توجعني. الرائحة خفيفة والامتصاص سريع، والطلب وصل ثاني يوم.</p>
            </article>
            <article className="review">
              <div className="who">
                <img className="av" src="/landing/review-2.jpg" alt="منى" style={{ objectPosition: '50% 20%' }} />
                <div>
                  <strong>منى، الخبر</strong>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p>أخذت ثلاث علب لأمي ولأخوي. الدفع عند الباب مرتّب، والتغليف نظيف.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="center">
            <h2>خلطة أجدادنا كاملة وجاهزة</h2>
          </div>
          <div className="facts">
            <div>
              <span>الاستخدام</span>
              <strong>مفاصل وعظام وعضلات</strong>
            </div>
            <div>
              <span>المكوّن البارز</span>
              <strong>سم النحل</strong>
            </div>
            <div>
              <span>التركيبة</span>
              <strong>طبيعية وآمنة للاستخدام الخارجي</strong>
            </div>
            <div>
              <span>الدفع</span>
              <strong>عند الاستلام</strong>
            </div>
            <div>
              <span>التوصيل</span>
              <strong>٢٤ إلى ٤٨ ساعة داخل المملكة</strong>
            </div>
            <div>
              <span>التحضير</span>
              <strong>جاهز من العلبة</strong>
            </div>
          </div>
          <h2 style={{ marginTop: 28, fontSize: 28 }}>طريقة الاستعمال</h2>
          <ol className="steps">
            <li>
              <span className="num">١</span> نظّف المنطقة وجفّفها.
            </li>
            <li>
              <span className="num">٢</span> خذ كمية مناسبة من الكريم.
            </li>
            <li>
              <span className="num">٣</span> دلك بلطف على مكان الألم حتى يمتص.
            </li>
            <li>
              <span className="num">٤</span> كرر صباحاً ومساءً أو حسب الحاجة.
            </li>
            <li>
              <span className="num">٥</span> اغسل يديك بعد الاستخدام.
            </li>
          </ol>
          <a className="btn" href="#order">
            اطلب الآن وسنصلك
          </a>
        </section>

        <section className="section">
          <div className="center">
            <h2>عندك سؤال؟</h2>
          </div>
          <div className="faq">
            {LANDING_FAQS.map(([q, a]) => (
              <div key={q} className={`item${openFaq === q ? ' open' : ''}`}>
                <button type="button" onClick={() => setOpenFaq(openFaq === q ? null : q)}>
                  {q} <span>+</span>
                </button>
                <div className="a">{a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="site">
        <div className="wrap">
          <p className="brand-foot">خلطة أجدادنا</p>
          <p className="copy">© 2026 خلطة أجدادنا. جميع الحقوق محفوظة.</p>
          <nav aria-label="صفحات العميل">
            <a href="#privacy">سياسة الخصوصية</a>
            <a href="#terms">الشروط والأحكام</a>
          </nav>
          <p style={{ marginTop: 14, fontWeight: 600, color: 'var(--green)' }}>الدفع عند الاستلام فقط</p>
          <section className="legal" id="privacy">
            <h3>سياسة الخصوصية</h3>
            <p>نستخدم اسمك ورقم جوالك ومدينتك فقط لإتمام طلبك والتواصل معك للتوصيل.</p>
          </section>
          <section className="legal" id="terms">
            <h3>الشروط والأحكام</h3>
            <p>
              الطلب يُدفع كاش عند الاستلام داخل المملكة. الشحن مجاني. ضمان استرجاع خلال 30 يوم من الاستلام إذا المنتج مغلق أو فيه عيب.
              الأسعار بالريال السعودي.
            </p>
          </section>
        </div>
      </footer>

      <div className="sticky">
        <a className="btn" href="#order">
          اطلب الآن. الدفع عند الاستلام
        </a>
      </div>

      {thanks ? (
        <div className="thanks show" role="dialog" aria-labelledby="thanks-title">
          <div className="thanks-inner">
            <div className="thanks-card">
              <div className="thanks-check" aria-hidden="true">
                ✓
              </div>
              <h1 id="thanks-title">تم استلام طلبك</h1>
              <p>
                عادةً يتصل عليك مندوبنا خلال <strong>أقل من ساعة</strong> على نفس رقم الجوال لتأكيد الطلب. خلّ الجوال قريب، وجاوب حتى لو
                الرقم جديد. الاتصال من داخل المملكة.
              </p>
              <div className="sum">
                رقم الطلب: {thanks.order}
                <br />
                الاسم: {thanks.name}
                <br />
                الجوال: {thanks.phone}
                <br />
                المدينة: {thanks.city}
                <br />
                الكمية: {thanks.qty} · {thanks.price} ر.س
              </div>
            </div>
            <div className="guarantee">
              <h2>تحدي الضمان</h2>
              <p>جرّب الدهان. إذا ما نفع معك وما انتهت مشاكلك في أقل من ٣٠ يوم، نعوّضك بـ ١٠٠٠ ريال كاملة.</p>
            </div>
            <div className="next-steps">
              <h2>عشان يوصلك الطلب</h2>
              <ol>
                <li>
                  <span className="num">١</span> جاوب اتصال التأكيد خلال الساعة. لا تغلق الخط.
                </li>
                <li>
                  <span className="num">٢</span> أكّد الاسم الكريم والمدينة. ما فيه دفع الآن.
                </li>
                <li>
                  <span className="num">٣</span> جهّز المبلغ كاش. المندوب يوصّل وتدفع عند الباب.
                </li>
              </ol>
            </div>
            <div className="next-steps" style={{ textAlign: 'center' }}>
              <h2>الطلب اللي في الطريق</h2>
              <div className="hero-photo">
                <img src="/landing/product-xicamel.png" alt="كريم خلطة أجدادنا" />
              </div>
            </div>
            <div className="next-steps">
              <h2>طريقة الاستعمال بعد ما يوصلك</h2>
              <ol>
                <li>
                  <span className="num">١</span> نظّف المنطقة وجفّفها.
                </li>
                <li>
                  <span className="num">٢</span> خذ كمية مناسبة من الكريم.
                </li>
                <li>
                  <span className="num">٣</span> دلك بلطف على مكان الألم حتى يمتص.
                </li>
                <li>
                  <span className="num">٤</span> كرر صباحاً ومساءً. يفضّل بعد الاستحمام.
                </li>
              </ol>
            </div>
            <div className="next-steps">
              <h2>أسئلة قبل الاتصال</h2>
              <div className="faq" style={{ textAlign: 'right' }}>
                {THANKS_FAQS.map(([q, a]) => (
                  <div key={q} className={`item${openFaq === `t-${q}` ? ' open' : ''}`}>
                    <button type="button" onClick={() => setOpenFaq(openFaq === `t-${q}` ? null : `t-${q}`)}>
                      {q} <span>+</span>
                    </button>
                    <div className="a">{a}</div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', paddingInline: 8 }}>
              خلطة أجدادنا · الدفع عند الاستلام فقط · لا تدفع شيئاً قبل ما يوصلك الطلب
            </p>
            <a
              className="btn"
              href="#order"
              onClick={(e) => {
                e.preventDefault()
                setThanks(null)
              }}
            >
              العودة للصفحة
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
