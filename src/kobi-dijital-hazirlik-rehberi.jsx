import React, { useState, useMemo } from "react";
import {
  Shirt, Wheat, Cog, ShoppingCart, Users, Megaphone, Boxes, Headphones,
  FlaskConical, Car, Hammer, HardHat, Truck, Tractor, UtensilsCrossed,
  Laptop, Stethoscope, GraduationCap, Landmark, Recycle, Search,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, RotateCcw, FileDown
} from "lucide-react";

/* ---------------------------------------------------------
   VERİ KATMANI — bu bölüm ayrı bir Supabase tablosuna
   taşınabilir (tools, questions, sectors), 3 ayda bir
   güncellenmeli. Sektör listesi 1090 üyelik sanayi haritası
   veri tabanındaki kırılımla hizalanacak şekilde genişletildi.
--------------------------------------------------------- */

const SECTOR_GROUPS = [
  { id: "imalat", label: "İmalat Sanayi" },
  { id: "tarimgida", label: "Tarım & Gıda" },
  { id: "ticaretlojistik", label: "Ticaret & Lojistik" },
  { id: "hizmet", label: "Profesyonel Hizmetler" },
];

const SECTORS = [
  { id: "tekstil", label: "Tekstil / Konfeksiyon", icon: Shirt, group: "imalat", note: "sezonluk koleksiyon ve stok döngüsü" },
  { id: "metal", label: "Metal / Makine İmalatı", icon: Cog, group: "imalat", note: "sipariş bazlı üretim planlama" },
  { id: "plastik", label: "Plastik / Kimya Sanayi", icon: FlaskConical, group: "imalat", note: "reçete/parti ve kalite kaydı" },
  { id: "otomotiv", label: "Otomotiv Yan Sanayi", icon: Car, group: "imalat", note: "ana sanayi teslim takvimine bağlılık" },
  { id: "mobilya", label: "Mobilya / Ahşap İşleme", icon: Hammer, group: "imalat", note: "sipariş özelleştirme ve atölye planlama" },
  { id: "insaat", label: "İnşaat / Yapı Malzemeleri", icon: HardHat, group: "imalat", note: "proje bazlı maliyet ve saha takibi" },
  { id: "ambalaj", label: "Ambalaj / Geri Dönüşüm", icon: Recycle, group: "imalat", note: "hacimli sipariş ve sevkiyat planlama" },
  { id: "gida", label: "Gıda İmalatı ve İşleme", icon: Wheat, group: "tarimgida", note: "raf ömrü ve parti (lot) takibi" },
  { id: "tarim", label: "Tarım / Hayvancılık", icon: Tractor, group: "tarimgida", note: "mevsimsellik ve hasat/verim takibi" },
  { id: "ticaret", label: "Ticaret / Toptan-Perakende", icon: ShoppingCart, group: "ticaretlojistik", note: "çoklu kanal satış ve tahsilat" },
  { id: "lojistik", label: "Lojistik / Nakliye", icon: Truck, group: "ticaretlojistik", note: "filo, rota ve sevkiyat takibi" },
  { id: "turizm", label: "Turizm / Konaklama ve Yeme-İçme", icon: UtensilsCrossed, group: "hizmet", note: "rezervasyon ve doluluk yönetimi" },
  { id: "bilisim", label: "Bilişim / Yazılım Hizmetleri", icon: Laptop, group: "hizmet", note: "proje/ekip verimliliği ve müşteri desteği" },
  { id: "saglik", label: "Sağlık Hizmetleri", icon: Stethoscope, group: "hizmet", note: "randevu ve hasta kaydı yönetimi" },
  { id: "egitim", label: "Eğitim Hizmetleri", icon: GraduationCap, group: "hizmet", note: "öğrenci/kursiyer takibi ve iletişim" },
  { id: "finans", label: "Finans / Sigorta Aracılık", icon: Landmark, group: "hizmet", note: "portföy ve poliçe/dosya takibi" },
];

const SIZES = [
  { id: "mikro", label: "Mikro işletme", sub: "1–9 çalışan" },
  { id: "kucuk", label: "Küçük işletme", sub: "10–49 çalışan" },
  { id: "orta", label: "Orta ölçekli işletme", sub: "50–249 çalışan" },
];

const FUNCTIONS = [
  { id: "ik", label: "İnsan Kaynakları", icon: Users },
  { id: "pazarlama", label: "Pazarlama", icon: Megaphone },
  { id: "stok", label: "Stok / Üretim", icon: Boxes },
  { id: "musteri", label: "Müşteri İlişkileri", icon: Headphones },
];

const NEED_STATEMENTS = {
  ik: "İhtiyacınız: başvuru, puantaj ve performans kayıtlarını dağınık kağıt/Excel yerine tek bir dijital sistemde tutmak.",
  pazarlama: "İhtiyacınız: içerik üretimini ve müşteri iletişimini plansız paylaşımlar yerine düzenli, ölçülebilir bir sisteme bağlamak.",
  stok: "İhtiyacınız: stok ve üretim planlamasını gözle/Excel takibi yerine gerçek zamanlı izlenebilir hale getirmek.",
  musteri: "İhtiyacınız: müşteri geçmişini ve talepleri dağınık not/hafıza yerine merkezi bir kayıt sisteminde tutmak.",
};

const FRAMEWORK_ALIGNMENT = {
  ik: { dmat: "İnsan-merkezli dijitalleşme", ddx: "Kurumsal Yönetim", siri: "Organizasyon" },
  pazarlama: { dmat: "Dijital iş stratejisi", ddx: "Müşteri ve Pazar Yönetimi", siri: "Süreç" },
  stok: { dmat: "Otomasyon & YZ / Veri yönetimi", ddx: "Üretim Yönetimi / Tedarik Yönetimi", siri: "Süreç / Teknoloji" },
  musteri: { dmat: "Veri yönetimi", ddx: "Müşteri ve Pazar Yönetimi", siri: "Süreç" },
};

const METHODOLOGY_LAST_UPDATED = "14 Ağustos 2026";

const SOURCES = [
  {
    org: "Avrupa Komisyonu JRC / EDIH Ağı",
    title: "Digital Maturity Assessment Tool (DMAT)",
    desc: "AB Dijital Avrupa Programı kapsamında EDIH'lerin kullandığı, KOBİ dijital olgunluğunu 6 boyutta ölçen resmi AB çerçevesi.",
    url: "european-digital-innovation-hubs.ec.europa.eu/dma-tool",
  },
  {
    org: "TÜBİTAK TÜSSİDE (Boğaziçi Üniversitesi işbirliğiyle)",
    title: "DDX Dijital Dönüşüm Değerlendirme Modeli / D3A",
    desc: "İşletmelerin dijital dönüşüm olgunluğunu 5 boyutta (Kurumsal Yönetim, Müşteri ve Pazar, Ar-Ge ve Ürün, Tedarik, Üretim Yönetimi) değerlendiren, KOSGEB'in tanıdığı ulusal model.",
    url: "ddxmodel.tubitak.gov.tr",
  },
  {
    org: "MEXT Teknoloji Merkezi",
    title: "SIRI — Smart Industry Readiness Index",
    desc: "Singapur kökenli, Süreç / Teknoloji / Organizasyon olmak üzere 3 yapı taşına dayanan; MEXT tarafından Türkiye'de uygulanan, KOSGEB'in de tanıdığı dijital olgunluk modeli.",
    url: "mext.org.tr/siri",
  },
  {
    org: "KOSGEB",
    title: "KOBİ Dijital Dönüşüm Destek Programı",
    desc: "Destek başvurusu için DDX veya SIRI formatında resmi dijital olgunluk raporu şartı koşan program; bu araç o resmi rapor değil, ona hazırlık amaçlı bir ön taramadır.",
    url: "kosgeb.gov.tr",
  },
];

const SCORING_METHOD_TEXT =
  "Her fonksiyon için 3 soru, 4'lü Likert ölçeğinde (1=en düşük dijital olgunluk, 4=en yüksek) puanlanır. " +
  "Sorunun ortalaması 2'nin altındaysa Başlangıç, 2–3 arasıysa Gelişen, 3 ve üzeriyse İleri seviye olarak sınıflandırılır. " +
  "Bu eşik değerleri sabit ve tüm kullanıcılar için aynı şekilde uygulanır; sektöre veya ölçeğe göre ağırlıklandırma yapılmaz.";

const QUESTIONS = {
  ik: [
    { text: "İşe alım başvurularını nasıl değerlendiriyorsunuz?", options: [
      "Elden veya tanıdık yoluyla, kayıt tutmuyoruz",
      "Kağıt / Excel üzerinden takip ediyoruz",
      "Online ilan sitesi kullanıyoruz (Kariyer.net vb.)",
      "Otomatik CV eleme / ATS sistemi kullanıyoruz",
    ]},
    { text: "Puantaj ve izin takibini nasıl yapıyorsunuz?", options: [
      "Kağıt kayıt / sözlü onay",
      "Excel tablosu",
      "Muhasebe programının puantaj modülü",
      "Ayrı bulut İK / puantaj yazılımı",
    ]},
    { text: "Personel performansını nasıl değerlendiriyorsunuz?", options: [
      "Değerlendirmiyoruz",
      "Yılda bir sözlü / kağıt üzerinden",
      "Excel şablonu ile düzenli değerlendirme",
      "Dijital performans/hedef takip sistemi",
    ]},
  ],
  pazarlama: [
    { text: "Ürün / hizmet tanıtımını nasıl yapıyorsunuz?", options: [
      "Ağızdan ağıza, referans",
      "Zaman zaman sosyal medya paylaşımı",
      "Düzenli içerik takvimi ve tasarım aracı kullanıyoruz",
      "Planlı reklam kampanyaları yürütüyoruz",
    ]},
    { text: "Müşteri/potansiyel müşteri iletişim listesi tutuyor musunuz?", options: [
      "Hayır",
      "Dağınık not / telefon rehberi",
      "Excel / Google Sheets listesi",
      "E-posta pazarlama aracıyla segmentli liste",
    ]},
    { text: "Reklam ve kampanya sonuçlarını ölçüyor musunuz?", options: [
      "Ölçmüyoruz",
      "Satış rakamlarına genel bakış",
      "Sosyal medya istatistiklerini takip ediyoruz",
      "Reklam yöneticisi üzerinden dönüşüm/ROI takibi yapıyoruz",
    ]},
  ],
  stok: [
    { text: "Stok/hammadde takibini nasıl yapıyorsunuz?", options: [
      "Gözle / tecrübeyle",
      "Kağıt / Excel sayım",
      "Barkod destekli basit stok programı",
      "Entegre stok-üretim yazılımı (ERP modülü)",
    ]},
    { text: "Üretim / sipariş planlamasını nasıl yapıyorsunuz?", options: [
      "Anlık, plansız",
      "Kağıt üzerinde haftalık plan",
      "Excel bazlı üretim takvimi",
      "Dijital üretim planlama / MES sistemi",
    ]},
    { text: "Tedarikçi siparişlerini nasıl takip ediyorsunuz?", options: [
      "Telefon / hafızayla",
      "Not defteri",
      "Excel sipariş takip tablosu",
      "Otomatik yeniden sipariş / satın alma modülü",
    ]},
  ],
  musteri: [
    { text: "Müşteri talep ve şikayetlerini nasıl kayıt altına alıyorsunuz?", options: [
      "Kayıt tutmuyoruz",
      "Sözlü / hafıza ile",
      "WhatsApp veya e-posta üzerinden dağınık",
      "CRM / talep takip sisteminde merkezi kayıt",
    ]},
    { text: "Müşteri geçmişine (sipariş, teklif, iletişim) ne kadar hızlı ulaşabiliyorsunuz?", options: [
      "Ulaşamıyoruz",
      "Eski faturalara/deftere bakarak",
      "Excel tablosundan",
      "CRM ekranından anında",
    ]},
    { text: "Tekrar satış / müşteri sadakati için ne yapıyorsunuz?", options: [
      "Bir şey yapmıyoruz",
      "Zaman zaman arayıp hatırlatıyoruz",
      "Periyodik e-posta/WhatsApp bilgilendirmesi",
      "Otomatik hatırlatma ve teklif akışı kuruyoruz",
    ]},
  ],
};

const TOOLS = {
  ik: {
    baslangic: [
      { name: "Kariyer.net / Yenibiriş ücretsiz ilan modülü", tier: "Ücretsiz", why: "Elden/kağıt başvuru takibini tek dijital listeye taşır.", alt: "LinkedIn ücretsiz ilan", sourceUrl: "kariyer.net", verified: "Ağu 2026", origin: "yerli" },
      { name: "Google Forms + Sheets başvuru formu", tier: "Ücretsiz", why: "Kod yazmadan başvuru formu kurup otomatik tabloya aktarır.", alt: "Microsoft Forms", sourceUrl: "workspace.google.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Manatal (no-code ATS)", tier: "Düşük maliyetli, aylık abonelik", why: "CV'leri otomatik puanlar, ekip içi ortak değerlendirmeyi hızlandırır.", alt: "Recruitee", sourceUrl: "manatal.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Bulut bordro/puantaj yazılımı (Logo, Zirve vb.)", tier: "Düşük-orta maliyetli", why: "Excel'deki puantaj hatasını azaltır, izin taleplerini otomatikleştirir.", alt: "Kolay Bordro", sourceUrl: "", verified: "Doğrulanmadı — kurul tekil ürün seçmeli", origin: "yerli" },
    ],
    ileri: [
      { name: "Bordro.io", tier: "Kurumsal", why: "Bordro, izin ve özlük süreçlerini tek bulut platformda birleştirir, Türkiye mevzuatına göre çalışır.", alt: "Logo HR", sourceUrl: "bordro.io", verified: "Ağu 2026", origin: "yerli" },
      { name: "SAP SuccessFactors", tier: "Kurumsal", why: "İşe alım, bordro ve performansı tek platformda birleştirip uluslararası raporlama sağlar.", alt: "Workday (büyük ölçek)", sourceUrl: "sap.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  pazarlama: {
    baslangic: [
      { name: "Canva (ücretsiz plan)", tier: "Ücretsiz", why: "Tasarım bilgisi gerektirmeden sosyal medya görseli/broşür üretir.", alt: "Adobe Express", sourceUrl: "canva.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Meta Business Suite", tier: "Ücretsiz", why: "Instagram/Facebook paylaşımlarını tek panelden planlar.", alt: "Buffer ücretsiz plan", sourceUrl: "business.facebook.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Mailchimp (başlangıç planı)", tier: "Düşük maliyetli", why: "Müşteri e-posta listesiyle otomatik bülten/kampanya gönderir.", alt: "Brevo (Sendinblue)", sourceUrl: "mailchimp.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Meta / Google reklam yöneticisi", tier: "Kullanım bazlı bütçe", why: "Hedefli reklamla yeni müşteri kazanımını ölçülebilir hale getirir.", alt: "TikTok Ads Manager", sourceUrl: "ads.google.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    ileri: [
      { name: "HubSpot Marketing Hub", tier: "Orta-kurumsal", why: "Pazarlama otomasyonu, aday skorlama ve raporlamayı birleştirir.", alt: "ActiveCampaign", sourceUrl: "hubspot.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Insider", tier: "Orta-kurumsal", why: "Çoklu kanal (web, e-posta, WhatsApp, SMS) pazarlama otomasyonu ve müşteri segmentasyonu sunar.", alt: "HubSpot Marketing Hub", sourceUrl: "useinsider.com", verified: "Ağu 2026", origin: "yerli" },
    ],
  },
  stok: {
    baslangic: [
      { name: "Excel şablon + barkod etiketleme", tier: "Ücretsiz / çok düşük", why: "Elle sayım hatasını azaltıp temel stok kaydı sağlar.", alt: "Google Sheets stok şablonu", sourceUrl: "", verified: "N/A — tekil ürün değil", origin: "kategori örneği" },
      { name: "Basit mobil stok takip uygulaması", tier: "Ücretsiz-düşük", why: "Telefonla barkod okutup anlık stok güncellemesi yapar.", alt: "inFlow ücretsiz plan", sourceUrl: "inflowinventory.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Odoo Community (açık kaynak)", tier: "Kurulum/bakım hariç ücretsiz", why: "Stok, satın alma ve üretimi tek sistemde birbirine bağlar.", alt: "Zoho Inventory", sourceUrl: "odoo.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Mikro Yazılım ERP", tier: "Düşük-orta maliyetli", why: "Türkiye muhasebe/e-fatura mevzuatına uyumlu stok ve satış modülleri sunar.", alt: "Odoo Community", sourceUrl: "mikro.com.tr", verified: "Ağu 2026", origin: "yerli" },
    ],
    ileri: [
      { name: "Logo Tiger 3 Enterprise", tier: "Kurumsal", why: "Üretim planlama, stok ve muhasebeyi Türkiye mevzuatına uyumlu şekilde entegre eder.", alt: "SAP Business One", sourceUrl: "logo.com.tr", verified: "Ağu 2026", origin: "yerli" },
      { name: "SAP Business One", tier: "Kurumsal", why: "Üretim, stok ve finansı uluslararası standartlarda tek sistemde birleştirir.", alt: "Microsoft Dynamics 365", sourceUrl: "sap.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  musteri: {
    baslangic: [
      { name: "WhatsApp Business (ücretsiz)", tier: "Ücretsiz", why: "Otomatik karşılama mesajı ve katalogla iletişimi düzenler.", alt: "Telegram Business", sourceUrl: "business.whatsapp.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Google Sheets müşteri listesi", tier: "Ücretsiz", why: "Dağınık not defterlerini tek merkezi listeye taşır.", alt: "Notion ücretsiz plan", sourceUrl: "workspace.google.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "HubSpot Free CRM", tier: "Ücretsiz-düşük maliyetli", why: "Müşteri geçmişi, teklif ve takip görevlerini tek ekranda tutar.", alt: "Zoho CRM ücretsiz plan", sourceUrl: "hubspot.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Zoho CRM (ücretsiz plan)", tier: "Ücretsiz-düşük maliyetli", why: "Küçük ekipler için temel satış hunisi ve iletişim geçmişi takibi sağlar.", alt: "HubSpot Free CRM", sourceUrl: "zoho.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    ileri: [
      { name: "Zoho One", tier: "Kurumsal", why: "Satış, hizmet ve pazarlamayı tek veri tabanında birleştirir, göreceli düşük maliyetli kurumsal seçenektir.", alt: "Salesforce", sourceUrl: "zoho.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Salesforce", tier: "Kurumsal", why: "Büyük ölçekli satış/servis operasyonları için sektör standardı CRM altyapısı sunar.", alt: "Microsoft Dynamics CRM", sourceUrl: "salesforce.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
};

const LEVELS = {
  baslangic: { label: "Başlangıç", color: "#6F4B3C" },
  gelisen: { label: "Gelişen", color: "#AC8E27" },
  ileri: { label: "İleri", color: "#3C6F58" },
};

const TIER_PRESENTATION = {
  baslangic: { heading: "Dijitalleşmeye Başlangıç: Temel Adımlar", badge: "Ücretsiz", accent: LEVELS.baslangic.color },
  gelisen: { heading: "İşinizi Geliştiren Çözümler", badge: "Önerilir", accent: LEVELS.gelisen.color },
  ileri: { heading: "Kurumsal Verimlilik Odaklı Sistemler", badge: "Kapsamlı", accent: LEVELS.ileri.color },
};
const TIER_ORDER = ["baslangic", "gelisen", "ileri"];

function levelFromScore(avg) {
  if (avg < 2) return "baslangic";
  if (avg < 3) return "gelisen";
  return "ileri";
}

/* ---------------------------------------------------------
   GAUGE — sanayi göstergesi (dial)
--------------------------------------------------------- */
function Gauge({ score, level, size = 100 }) {
  const angle = -90 + ((score - 1) / 3) * 180;
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  const zones = [
    { from: -90, to: -30, color: LEVELS.baslangic.color },
    { from: -30, to: 30, color: LEVELS.gelisen.color },
    { from: 30, to: 90, color: LEVELS.ileri.color },
  ];
  const polar = (a, radius) => {
    const rad = (a * Math.PI) / 180;
    return [cx + radius * Math.sin(rad), cy - radius * Math.cos(rad)];
  };
  const arcPath = (from, to, radius) => {
    const [x1, y1] = polar(from, radius);
    const [x2, y2] = polar(to, radius);
    const large = to - from > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };
  const [nx, ny] = polar(angle, r - 5);
  return (
    <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`} className="mx-auto block">
      {zones.map((z, i) => (
        <path key={i} d={arcPath(z.from, z.to, r)} stroke={z.color} strokeWidth="6" fill="none" strokeLinecap="round" />
      ))}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1A1F2B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3" fill="#1A1F2B" />
      <text x={cx} y={cy + 18} textAnchor="middle" fontWeight="500" fontSize="11" fill="#1A1F2B" style={{ fontFamily: "Sora, sans-serif" }}>
        {LEVELS[level].label.toUpperCase()}
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------
   MAIN APP
--------------------------------------------------------- */
const STEPS = ["intro", "sector", "size", "ik", "pazarlama", "stok", "musteri", "results"];

export default function App() {
  const [stepIdx, setStepIdx] = useState(0);
  const [sector, setSector] = useState(null);
  const [sectorGroup, setSectorGroup] = useState("all");
  const [sectorQuery, setSectorQuery] = useState("");
  const [size, setSize] = useState(null);
  const [answers, setAnswers] = useState({ ik: [], pazarlama: [], stok: [], musteri: [] });

  const step = STEPS[stepIdx];
  const fnStepIdx = FUNCTIONS.findIndex((f) => f.id === step);

  const goNext = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIdx((i) => Math.max(i - 1, 0));

  const canProceed = useMemo(() => {
    if (step === "sector") return !!sector;
    if (step === "size") return !!size;
    if (fnStepIdx >= 0) return (answers[step] || []).length === QUESTIONS[step].length;
    return true;
  }, [step, sector, size, answers, fnStepIdx]);

  const setAnswer = (fnId, qIdx, score) => {
    setAnswers((prev) => {
      const arr = [...(prev[fnId] || [])];
      arr[qIdx] = score;
      return { ...prev, [fnId]: arr };
    });
  };

  const results = useMemo(() => {
    return FUNCTIONS.map((f) => {
      const arr = answers[f.id] || [];
      const avg = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 1;
      const level = levelFromScore(avg);
      return { ...f, avg, level };
    });
  }, [answers]);

  const restart = () => {
    setStepIdx(0);
    setSector(null);
    setSectorGroup("all");
    setSectorQuery("");
    setSize(null);
    setAnswers({ ik: [], pazarlama: [], stok: [], musteri: [] });
  };

  const filteredSectors = useMemo(() => {
    return SECTORS.filter((s) => {
      const groupOk = sectorGroup === "all" || s.group === sectorGroup;
      const queryOk = s.label.toLocaleLowerCase("tr").includes(sectorQuery.toLocaleLowerCase("tr"));
      return groupOk && queryOk;
    });
  }, [sectorGroup, sectorQuery]);

  return (
    <div style={{ background: "#F5F6F8", minHeight: "100%", color: "#1A1F2B" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=IBM+Plex+Mono&display=swap');
        body { font-family: 'Sora', sans-serif; -webkit-font-smoothing: antialiased; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .card { background: #FFFFFF; border: 1px solid #E8EBF1; box-shadow: 0 1px 3px rgba(26,31,43,0.03); }
        .btn-primary { background: #1A1F2B; color: #FFFFFF; transition: all .15s ease; border-radius: 6px; }
        .btn-primary:hover:not(:disabled) { background: #3C6F58; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
        .opt-btn { border: 1px solid #E8EBF1; background: #FFFFFF; transition: all .12s ease; border-radius: 8px; cursor: pointer; text-align: left; }
        .opt-btn:hover { border-color: #3C6F58; background: #F8FAF9; }
        .opt-btn.selected { border-color: #3C6F58; background: #EDF3F1; box-shadow: 0 0 0 1px #3C6F58; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; font-size: 11pt; }
          .card { border: 1px solid #DDD !important; box-shadow: none !important; break-inside: avoid; margin-bottom: 20px; }
        }
      ` }} />

      <header className="px-6 md:px-10 py-6 card rounded-none border-t-0 border-x-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mono text-xs tracking-tight uppercase" style={{ color: "#727B8A" }}>Çorlu TSO · Dijitalleşme Destek Araçları</div>
            <h1 className="text-2xl md:text-3xl mt-1.5 font-bold tracking-tight">KOBİ Dijital Olgunluk Ön Tarama Rehberi</h1>
          </div>
          <img src="https://via.placeholder.com/60/FFFFFF/727B8A?text=TSO" alt="TSO Logo" className="shrink-0" />
        </div>
      </header>

      <main className="px-6 md:px-10 py-10 max-w-5xl mx-auto">
        {step === "intro" && (
          <div>
            <p className="text-lg leading-relaxed text-gray-800 max-w-3xl">
              10 dakika süren kısa bir öz değerlendirme ile işletmenizin 4 temel fonksiyondaki dijitalleşme seviyesini ölçün,
              size özel hazırlanmış düşük maliyetli araç yol haritasını hemen edinin.
            </p>
            <div className="card p-6 rounded-lg my-8 flex items-start gap-4" style={{ background: "#F1F3F6" }}>
              <Sparkles size={24} className="text-gray-500 mt-1 shrink-0" />
              <div>
                <p className="font-medium text-sm text-gray-900">Kurumsal Altyapı Desteği</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  Bu aracın metodolojisi; AB EDIH ağının kullandığı <strong>DMAT</strong> çerçevesi, TÜBİTAK TÜSSİDE'nin <strong>DDX/D3A</strong> modeli ve MEXT'in uyguladığı <strong>SIRI</strong> modeliyle hizalanmıştır.
                  Bu bir ön tarama aracıdır; KOSGEB Dijital Dönüşüm Destek Programı başvurusu için yetkilendirilmiş bir danışmandan resmi DDX/SIRI raporu alınması gerekir.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {FUNCTIONS.map((f) => (
                <div key={f.id} className="card p-5 rounded-lg text-center flex flex-col items-center gap-3">
                  <div className="p-2.5 rounded-md" style={{ background: "#E8EBF1" }}>
                    <f.icon size={22} color="#1A1F2B" />
                  </div>
                  <span className="font-semibold text-sm">{f.label}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary text-base px-10 py-3.5 flex items-center gap-2.5 font-semibold" onClick={goNext}>
              Keşfe Başla <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === "sector" && (
          <StepShell title="Adım 1: Sektörünüz" onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-md card">
              <Search size={18} color="#727B8A" />
              <input
                value={sectorQuery}
                onChange={(e) => setSectorQuery(e.target.value)}
                placeholder="Sektörünüzü arayın (ör: metal, tekstil)..."
                className="text-sm w-full outline-none"
                style={{ background: "transparent" }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                className="mono text-xs px-3 py-1.5 rounded-full"
                style={{ background: sectorGroup === "all" ? "#1A1F2B" : "#E8EBF1", color: sectorGroup === "all" ? "#FFFFFF" : "#1A1F2B" }}
                onClick={() => setSectorGroup("all")}
              >
                Tümü
              </button>
              {SECTOR_GROUPS.map((g) => (
                <button
                  key={g.id}
                  className="mono text-xs px-3 py-1.5 rounded-full"
                  style={{ background: sectorGroup === g.id ? "#1A1F2B" : "#E8EBF1", color: sectorGroup === g.id ? "#FFFFFF" : "#1A1F2B" }}
                  onClick={() => setSectorGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredSectors.map((s) => (
                <button key={s.id} className={`opt-btn p-4 rounded-md flex items-start gap-4 ${sector === s.id ? "selected" : ""}`} onClick={() => setSector(s.id)}>
                  <div className="p-2.5 rounded-full shrink-0" style={{ background: sector === s.id ? "#3C6F58" : "#E8EBF1" }}>
                    <s.icon size={20} color={sector === s.id ? "#FFFFFF" : "#1A1F2B"} className="mt-0.5" />
                  </div>
                  <div>
                    <span className="block font-semibold text-base">{s.label}</span>
                    <span className="block text-sm mt-0.5" style={{ color: sector === s.id ? "#3C6F58" : "#727B8A" }}>Kritik odak: {s.note}</span>
                  </div>
                </button>
              ))}
              {filteredSectors.length === 0 && (
                <div className="text-sm font-medium col-span-2 text-center p-10 bg-white rounded-lg border border-gray-200" style={{ color: "#727B8A" }}>Eşleşen sektör bulunamadı.</div>
              )}
            </div>
          </StepShell>
        )}

        {step === "size" && (
          <StepShell title="Adım 2: İşletme Ölçeği" onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div className="flex flex-col gap-4">
              {SIZES.map((s) => (
                <button key={s.id} className={`opt-btn p-5 rounded-md ${size === s.id ? "selected" : ""}`} onClick={() => setSize(s.id)}>
                  <div className="font-semibold text-lg">{s.label}</div>
                  <div className="text-sm" style={{ color: size === s.id ? "#3C6F58" : "#727B8A" }}>{s.sub}</div>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {fnStepIdx >= 0 && (
          <StepShell
            title={`Adım ${3 + fnStepIdx}: ${FUNCTIONS[fnStepIdx].label}`}
            onBack={goBack}
            onNext={goNext}
            canProceed={canProceed}
            last={fnStepIdx === FUNCTIONS.length - 1}
          >
            <div className="mono text-xs mb-6 px-4 py-2.5 rounded-md inline-flex items-center gap-2" style={{ background: "#E8EBF1", color: "#1A1F2B" }}>
              <CheckCircle2 size={15} /> Resmi Model Karşılıkları — DMAT: {FRAMEWORK_ALIGNMENT[step].dmat} · DDX: {FRAMEWORK_ALIGNMENT[step].ddx} · SIRI: {FRAMEWORK_ALIGNMENT[step].siri}
            </div>
            <div className="flex flex-col gap-8">
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx}>
                  <div className="mb-4 font-semibold text-base text-gray-950">{q.text}</div>
                  <div className="flex flex-col gap-3">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        className={`opt-btn p-4 rounded-md text-sm font-medium ${answers[step][qIdx] === oIdx + 1 ? "selected" : ""}`}
                        onClick={() => setAnswer(step, qIdx, oIdx + 1)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </StepShell>
        )}

        {step === "results" && (
          <div>
            <header className="card p-8 mb-10 rounded-lg" style={{ background: "#EDF3F1", border: "1px solid #3C6F58", position: "relative" }}>
              <div className="flex items-center gap-4">
                <Sparkles size={32} style={{ color: "#3C6F58" }} className="shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Dijitalleşme Hazırlık Karneniz Tamamlandı</h2>
                  <p className="text-gray-800 mt-1 max-w-3xl">
                    Aşağıda işletmenizin mevcut dijitalleşme seviyesini, sektörünüz için kritik odak noktalarını ve size özel hazırladığımız yol haritasını görebilirsiniz.
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 text-xs mono px-3 py-1 rounded-full text-white" style={{ background: "#3C6F58" }}>ÖN TARAMA</div>
            </header>
            <p className="text-sm mb-8 font-semibold flex items-center gap-2" style={{ color: "#727B8A" }}>
               {SIZES.find((s) => s.id === size)?.label}  <span style={{ color: "#B1B8C1" }}>/</span> {SECTORS.find((s) => s.id === sector)?.label} <span style={{ color: "#B1B8C1" }}>/</span> <span style={{ color: "#3C6F58" }}>{SECTORS.find((s) => s.id === sector)?.note}</span>
            </p>

            <div className="flex flex-col gap-8 mt-4">
              {results.map((r) => (
                <div key={r.id} className="card p-7 rounded-xl border-gray-100 shadow-sm">
                  <header className="flex items-start gap-5 justify-between flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full shrink-0 mt-1" style={{ background: "#F1F3F6" }}>
                        <r.icon size={22} color="#1A1F2B" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl tracking-tight text-gray-950">{r.label} Seviyesi</h3>
                        <p className="text-sm font-medium mt-0.5" style={{ color: LEVELS[r.level].color }}>Dijital Olgunluk: {LEVELS[r.level].label}</p>
                      </div>
                    </div>
                    <Gauge score={r.avg} level={r.level} />
                  </header>

                  <div className="mt-6 p-4 rounded-md text-sm font-medium bg-gray-50 border border-gray-100 max-w-3xl">
                    <span className="text-gray-600">Öncelikli Hedefiniz:</span> <span className="text-gray-950">{NEED_STATEMENTS[r.id]}</span>
                  </div>

                  <div className="mono text-[11px] mt-6 pt-3" style={{ color: "#727B8A", borderTop: "1px solid #E8EBF1" }}>
                    Resmi Model Karşılıkları — DMAT: {FRAMEWORK_ALIGNMENT[r.id].dmat} · DDX: {FRAMEWORK_ALIGNMENT[r.id].ddx} · SIRI: {FRAMEWORK_ALIGNMENT[r.id].siri}
                  </div>

                  {TIER_ORDER.map((tierKey) => (
                    <div key={tierKey} className="mt-8 border border-gray-100 rounded-lg p-5" style={{ opacity: r.level === tierKey ? 1 : 0.6 }}>
                      <header className="flex items-center justify-between gap-3 mb-5 pb-2.5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-base text-gray-900">{TIER_PRESENTATION[tierKey].heading}</h4>
                          <span className="mono text-[11px] font-medium px-2.5 py-1 rounded-full text-white" style={{ background: TIER_PRESENTATION[tierKey].accent }}>{TIER_PRESENTATION[tierKey].badge}</span>
                        </div>
                        {r.level === tierKey && (
                          <span className="mono text-xs font-semibold px-3 py-1 rounded-md" style={{ background: "#EDF3F1", color: "#3C6F58" }}>
                            Sizin Seviyeniz
                          </span>
                        )}
                      </header>

                      <div className="flex flex-col gap-4">
                        {TOOLS[r.id][tierKey].map((t, i) => (
                          <div key={i} className="p-4 rounded-lg bg-gray-50 border border-gray-100 relative">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-semibold text-base text-gray-950">{t.name}</span>
                              <span className="mono text-[11px] font-medium px-2.5 py-1 rounded-full text-white" style={{ background: t.origin === "yerli" ? "#B1B8C1" : "#1A1F2B" }}>
                                {t.origin === "yerli" ? "Yerli" : t.origin === "uluslararası" ? "Global" : "Kategori Örneği"}
                              </span>
                            </div>
                            <p className="text-sm mt-1.5 text-gray-800 leading-relaxed">{t.why}</p>
                            <p className="text-xs mt-2 text-gray-600 font-medium">Alternatif: {t.alt}</p>
                            <p className="text-xs mt-1 mono" style={{ color: t.sourceUrl ? "#727B8A" : "#B05C4F" }}>
                              {t.sourceUrl ? `Üretici: ${t.sourceUrl} ` : "Somut bir ürüne bağlanmadı "} · Doğrulama: {t.verified}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-12 card p-8 rounded-xl no-print">
              <h3 className="font-bold text-xl tracking-tight mb-5">Metodoloji ve Resmi Kaynaklar</h3>

              <section className="mb-6">
                <h4 className="font-semibold text-sm mb-1.5" style={{ color: "#727B8A" }}>Nasıl Puanlıyoruz?</h4>
                <p className="text-sm leading-relaxed text-gray-800">{SCORING_METHOD_TEXT}</p>
              </section>

              <section className="mb-6">
                <h4 className="font-semibold text-sm mb-2" style={{ color: "#727B8A" }}>Kurumsal Model Hizalaması</h4>
                <p className="text-sm leading-relaxed text-gray-800 mb-4">
                  Değerlendirme sorularımız ve boyut yapımız, AB ve Türkiye'deki resmi dijital olgunluk ölçme çerçevelerinin boyutları esas alınarak hazırlanmıştır.
                  Fonksiyonlarımızı (İK, Pazarlama, Stok/Üretim, Müşteri İlişkileri) bu boyutlara haritalayarak, TSO'nun kendi görüşü değil, resmi ölçütlerle tutarlı bir ön tarama yapmanızı sağlıyoruz.
                </p>
                <div className="overflow-x-auto card rounded-md border-gray-200 shadow-none p-1">
                  <table className="w-full text-xs mono text-gray-800" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                    <thead style={{ background: "#F9FAFB" }}>
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">Değerlendirilen Fonksiyon</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">AB DMAT Boyutu</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">TÜBİTAK DDX Boyutu</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">SIRI Yapı Taşı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FUNCTIONS.map((f, i) => (
                        <tr key={f.id} style={{ borderBottom: i === FUNCTIONS.length - 1 ? "none" : "1px solid #E8EBF1" }}>
                          <td className="py-3 px-4 font-medium text-gray-950">{f.label}</td>
                          <td className="py-3 px-4">{FRAMEWORK_ALIGNMENT[f.id].dmat}</td>
                          <td className="py-3 px-4">{FRAMEWORK_ALIGNMENT[f.id].ddx}</td>
                          <td className="py-3 px-4">{FRAMEWORK_ALIGNMENT[f.id].siri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-6">
                <h4 className="font-semibold text-sm mb-1.5" style={{ color: "#727B8A" }}>Araç Önerileri ve Şeffaflık</h4>
                <p className="text-sm leading-relaxed text-gray-800">
                  Her önerilen uygulama için üreticinin resmi sitesi birincil kaynak olarak işaretlenir ve son doğrulama tarihi kart üzerinde gösterilir.
                  Maliyet kademelerinde en az iki alternatif sunulur ve kökeni (Yerli/Global) etiketlenir. Çorlu TSO hiçbir ürünü resmi olarak onaylamaz.
                  Liste 3 ayda bir kurul tarafından gözden geçirilir. Son güncelleme: {METHODOLOGY_LAST_UPDATED}.
                </p>
              </section>

              <section className="mb-6">
                <h4 className="font-semibold text-sm mb-1.5" style={{ color: "#727B8A" }}>Sınırlamalar ve Resmi Danışmanlık</h4>
                <p className="text-sm leading-relaxed text-gray-800 bg-amber-50 p-4 rounded-lg border border-amber-100">
                  Bu araç bir <strong>ön tarama</strong>dır. KOSGEB Dijital Dönüşüm Destek Programı başvurusu için TÜBİTAK TÜSSİDE, MEXT veya İHKİB Dijital Dönüşüm Merkezi tarafından yetkilendirilmiş bir danışmandan alınacak resmi DDX veya SIRI raporunun yerine geçmez.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-sm mb-2.5" style={{ color: "#727B8A" }}>Kaynakça</h4>
                <ul className="text-xs flex flex-col gap-2.5 text-gray-700 mono">
                  {SOURCES.map((s, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <span className="font-semibold text-gray-900 shrink-0">{s.org}:</span>
                      <span>{s.title}. {s.desc} <span className="text-gray-600">({s.url})</span></span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="mt-10 flex items-center gap-4 no-print">
              <button className="btn-primary text-base px-10 py-3.5 flex items-center gap-2.5 font-semibold" onClick={() => window.print()}>
                <FileDown size={20} /> Karneyi Yazdır / Kaydet
              </button>
              <button className="px-6 py-3.5 flex items-center gap-2.5 font-semibold" style={{ color: "#727B8A" }} onClick={restart}>
                <RotateCcw size={18} /> Yeniden Başlat
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="card mt-16 px-6 py-6 rounded-none border-b-0 border-x-0 text-center text-xs text-gray-500">
        Çorlu TSO Dijital Hazırlık Atölyesi © 2026. Bu bir ön tarama aracıdır.
      </footer>
    </div>
  );
}

function StepShell({ title, children, onBack, onNext, canProceed, last }) {
  return (
    <div>
      <div className="text-gray-500 text-xs font-semibold mono mb-2 uppercase tracking-tight">{title}</div>
      {children}
      <div className="flex items-center gap-4 mt-10 no-print">
        <button className="px-5 py-3 flex items-center gap-2 text-sm font-semibold border border-gray-200 rounded-md bg-white hover:bg-gray-50" onClick={onBack}>
          <ArrowLeft size={18} /> Geri
        </button>
        <button className="btn-primary text-sm px-7 py-3 flex items-center gap-2 font-semibold ml-auto" onClick={onNext} disabled={!canProceed}>
          {last ? "Karneyi Gör" : "Devam Et"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
