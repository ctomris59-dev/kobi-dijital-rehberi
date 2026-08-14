import React, { useState, useMemo } from "react";
import {
  Shirt, Wheat, Cog, ShoppingCart, Users, Megaphone, Boxes, Headphones,
  FlaskConical, Car, Hammer, HardHat, Truck, Tractor, UtensilsCrossed,
  Laptop, Stethoscope, GraduationCap, Landmark, Recycle, Search,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, RotateCcw
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

/* ---------------------------------------------------------
   METODOLOJİ HİZALAMASI — her fonksiyonun hangi resmi
   dijital olgunluk çerçevesindeki boyuta karşılık geldiği.
   Kaynaklar: DMAT (EDIH ağı / AB Komisyonu JRC),
   DDX-D3A (TÜBİTAK TÜSSİDE + Boğaziçi Üniversitesi),
   SIRI (MEXT / Smart Industry Readiness Index).
   Bu eşleme özgün soru setimizi geçerli kılan referans
   noktasıdır; resmi rapor yerine geçmez.
--------------------------------------------------------- */
const FRAMEWORK_ALIGNMENT = {
  ik: { dmat: "İnsan-merkezli dijitalleşme", ddx: "Kurumsal Yönetim", siri: "Organizasyon" },
  pazarlama: { dmat: "Dijital iş stratejisi", ddx: "Müşteri ve Pazar Yönetimi", siri: "Süreç" },
  stok: { dmat: "Otomasyon & YZ / Veri yönetimi", ddx: "Üretim Yönetimi / Tedarik Yönetimi", siri: "Süreç / Teknoloji" },
  musteri: { dmat: "Veri yönetimi", ddx: "Müşteri ve Pazar Yönetimi", siri: "Süreç" },
};

const METHODOLOGY_LAST_UPDATED = "14 Ağustos 2026";

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

/* Kaynak alanları: sourceUrl = üreticinin resmi kök alan adı (birincil kaynak).
   "örn." ile başlayan kategori örnekleri (tekil ürün olmayanlar) için sourceUrl
   boş bırakılır — kurul bu satırları somut bir ürüne bağlayıp doğrulamalı.
   verified = son doğrulama ayı/yılı; her çeyreklik incelemede güncellenmeli. */
const TOOLS = {
  ik: {
    baslangic: [
      { name: "Kariyer.net / Yenibiriş ücretsiz ilan modülü", tier: "Ücretsiz", why: "Elden/kağıt başvuru takibini tek dijital listeye taşır.", alt: "LinkedIn ücretsiz ilan", sourceUrl: "kariyer.net", verified: "Ağu 2026" },
      { name: "Google Forms + Sheets başvuru formu", tier: "Ücretsiz", why: "Kod yazmadan başvuru formu kurup otomatik tabloya aktarır.", alt: "Microsoft Forms", sourceUrl: "workspace.google.com", verified: "Ağu 2026" },
    ],
    gelisen: [
      { name: "Manatal (no-code ATS)", tier: "Düşük maliyetli, aylık abonelik", why: "CV'leri otomatik puanlar, ekip içi ortak değerlendirmeyi hızlandırır.", alt: "Recruitee", sourceUrl: "manatal.com", verified: "Ağu 2026" },
      { name: "Bulut bordro/puantaj yazılımı (Logo, Zirve vb.)", tier: "Düşük-orta maliyetli", why: "Excel'deki puantaj hatasını azaltır, izin taleplerini otomatikleştirir.", alt: "Kolay Bordro", sourceUrl: "", verified: "Doğrulanmadı — kurul tekil ürün seçmeli" },
    ],
    ileri: [
      { name: "Kurumsal İK bilgi sistemi (örn. Bordro.io, SAP SuccessFactors)", tier: "Kurumsal", why: "İşe alım, bordro ve performansı tek platformda birleştirip raporlar.", alt: "Workday (büyük ölçek)", sourceUrl: "", verified: "Doğrulanmadı — kurul tekil ürün seçmeli" },
    ],
  },
  pazarlama: {
    baslangic: [
      { name: "Canva (ücretsiz plan)", tier: "Ücretsiz", why: "Tasarım bilgisi gerektirmeden sosyal medya görseli/broşür üretir.", alt: "Adobe Express", sourceUrl: "canva.com", verified: "Ağu 2026" },
      { name: "Meta Business Suite", tier: "Ücretsiz", why: "Instagram/Facebook paylaşımlarını tek panelden planlar.", alt: "Buffer ücretsiz plan", sourceUrl: "business.facebook.com", verified: "Ağu 2026" },
    ],
    gelisen: [
      { name: "Mailchimp (başlangıç planı)", tier: "Düşük maliyetli", why: "Müşteri e-posta listesiyle otomatik bülten/kampanya gönderir.", alt: "Brevo (Sendinblue)", sourceUrl: "mailchimp.com", verified: "Ağu 2026" },
      { name: "Meta / Google reklam yöneticisi", tier: "Kullanım bazlı bütçe", why: "Hedefli reklamla yeni müşteri kazanımını ölçülebilir hale getirir.", alt: "TikTok Ads Manager", sourceUrl: "ads.google.com", verified: "Ağu 2026" },
    ],
    ileri: [
      { name: "HubSpot Marketing Hub", tier: "Orta-kurumsal", why: "Pazarlama otomasyonu, aday skorlama ve raporlamayı birleştirir.", alt: "ActiveCampaign", sourceUrl: "hubspot.com", verified: "Ağu 2026" },
    ],
  },
  stok: {
    baslangic: [
      { name: "Excel şablon + barkod etiketleme", tier: "Ücretsiz / çok düşük", why: "Elle sayım hatasını azaltıp temel stok kaydı sağlar.", alt: "Google Sheets stok şablonu", sourceUrl: "", verified: "N/A — tekil ürün değil" },
      { name: "Basit mobil stok takip uygulaması", tier: "Ücretsiz-düşük", why: "Telefonla barkod okutup anlık stok güncellemesi yapar.", alt: "inFlow ücretsiz plan", sourceUrl: "inflowinventory.com", verified: "Ağu 2026" },
    ],
    gelisen: [
      { name: "Odoo Community (açık kaynak)", tier: "Kurulum/bakım hariç ücretsiz", why: "Stok, satın alma ve üretimi tek sistemde birbirine bağlar.", alt: "Zoho Inventory", sourceUrl: "odoo.com", verified: "Ağu 2026" },
    ],
    ileri: [
      { name: "Kurumsal ERP/MES (örn. Logo Tiger, SAP Business One)", tier: "Kurumsal", why: "Üretim planlama, stok ve muhasebeyi gerçek zamanlı entegre eder.", alt: "Microsoft Dynamics 365", sourceUrl: "", verified: "Doğrulanmadı — kurul tekil ürün seçmeli" },
    ],
  },
  musteri: {
    baslangic: [
      { name: "WhatsApp Business (ücretsiz)", tier: "Ücretsiz", why: "Otomatik karşılama mesajı ve katalogla iletişimi düzenler.", alt: "Telegram Business", sourceUrl: "business.whatsapp.com", verified: "Ağu 2026" },
      { name: "Google Sheets müşteri listesi", tier: "Ücretsiz", why: "Dağınık not defterlerini tek merkezi listeye taşır.", alt: "Notion ücretsiz plan", sourceUrl: "workspace.google.com", verified: "Ağu 2026" },
    ],
    gelisen: [
      { name: "HubSpot Free CRM", tier: "Ücretsiz-düşük maliyetli", why: "Müşteri geçmişi, teklif ve takip görevlerini tek ekranda tutar.", alt: "Zoho CRM ücretsiz plan", sourceUrl: "hubspot.com", verified: "Ağu 2026" },
    ],
    ileri: [
      { name: "Kurumsal CRM (örn. Zoho One, Salesforce)", tier: "Kurumsal", why: "Satış, hizmet ve pazarlamayı tek veri tabanında birleştirir.", alt: "Microsoft Dynamics CRM", sourceUrl: "", verified: "Doğrulanmadı — kurul tekil ürün seçmeli" },
    ],
  },
};

const LEVELS = {
  baslangic: { label: "Başlangıç", color: "#9C4A3C" },
  gelisen: { label: "Gelişen", color: "#C9A227" },
  ileri: { label: "İleri", color: "#4C7A63" },
};

function levelFromScore(avg) {
  if (avg < 2) return "baslangic";
  if (avg < 3) return "gelisen";
  return "ileri";
}

/* ---------------------------------------------------------
   GAUGE — imzalık görsel öğe: sanayi göstergesi (dial)
--------------------------------------------------------- */
function Gauge({ score, level, size = 132 }) {
  const angle = -90 + ((score - 1) / 3) * 180;
  const r = size / 2 - 10;
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
  const [nx, ny] = polar(angle, r - 6);
  return (
    <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.62}`}>
      {zones.map((z, i) => (
        <path key={i} d={arcPath(z.from, z.to, r)} stroke={z.color} strokeWidth="10" fill="none" strokeLinecap="butt" />
      ))}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1B2A41" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#1B2A41" />
      <text x={cx} y={cy + 22} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#1B2A41">
        {LEVELS[level].label.toUpperCase()}
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------
   ANA UYGULAMA
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
      const tools = (TOOLS[f.id][level] || []);
      return { ...f, avg, level, tools };
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
    <div style={{ background: "var(--paper)", minHeight: "100%", fontFamily: "Inter, sans-serif", color: "var(--ink)" }} className="w-full min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        :root {
          --ink: #1B2A41; --paper: #EAE6DC; --paper-dark: #DDD7C8;
          --brass: #C9A227; --brass-dark: #967616; --moss: #5C6F68; --white: #FAF8F3;
        }
        .disp { font-family: 'Oswald', sans-serif; letter-spacing: 0.02em; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .card { background: var(--white); border: 1px solid var(--paper-dark); }
        .btn-primary { background: var(--ink); color: var(--white); transition: transform .15s ease, background .15s ease; }
        .btn-primary:hover:not(:disabled) { background: var(--brass-dark); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
        .opt-btn { border: 1px solid var(--paper-dark); background: var(--white); transition: all .12s ease; text-align: left; }
        .opt-btn:hover { border-color: var(--brass); }
        .opt-btn.selected { border-color: var(--brass); background: #FBF3DC; }
      ` }} />

      <header className="px-6 md:px-12 pt-10 pb-6 border-b" style={{ borderColor: "var(--paper-dark)" }}>
        <div className="mono text-xs tracking-widest" style={{ color: "var(--moss)" }}>ÇORLU TSO · DİJİTAL HAZIRLIK ATÖLYESİ</div>
        <h1 className="disp text-2xl md:text-3xl mt-1" style={{ fontWeight: 600 }}>KOBİ Yapay Zeka Hazırlık &amp; Otomasyon Rehberi</h1>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        {step === "intro" && (
          <div>
            <p className="text-base leading-relaxed mb-3">
              10–16 soruluk kısa bir keşifle işletmenizin İnsan Kaynakları, Pazarlama, Stok/Üretim
              ve Müşteri İlişkileri süreçlerindeki dijital olgunluğunu ölçüyor; her alan için
              somut, düşük maliyetli araç önerisi ve yol haritası çıkarıyoruz.
            </p>
            <p className="mono text-xs mb-6 p-3 rounded-sm" style={{ background: "var(--paper-dark)", color: "var(--moss)" }}>
              Soru ve boyut yapımız; AB EDIH ağının kullandığı DMAT çerçevesi, TÜBİTAK TÜSSİDE'nin
              DDX/D3A modeli ve MEXT'in uyguladığı SIRI modeliyle hizalanmıştır. Bu bir ön tarama
              aracıdır — KOSGEB Dijital Dönüşüm Destek Programı başvurusu için yetkilendirilmiş bir
              danışmandan resmi DDX/SIRI raporu alınması gerekir.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {FUNCTIONS.map((f) => (
                <div key={f.id} className="card p-4 flex flex-col items-center gap-2 text-center">
                  <f.icon size={22} color="var(--moss)" />
                  <span className="text-xs mono">{f.label}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary disp px-6 py-3 flex items-center gap-2" onClick={goNext}>
              Keşfe Başla <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === "sector" && (
          <StepShell title="1 · Sektörünüz" onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-sm card">
              <Search size={16} color="var(--moss)" />
              <input
                value={sectorQuery}
                onChange={(e) => setSectorQuery(e.target.value)}
                placeholder="Sektör ara..."
                className="text-sm w-full outline-none"
                style={{ background: "transparent" }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                className="mono text-xs px-3 py-1.5 rounded-sm"
                style={{ background: sectorGroup === "all" ? "var(--ink)" : "var(--paper-dark)", color: sectorGroup === "all" ? "var(--white)" : "var(--ink)" }}
                onClick={() => setSectorGroup("all")}
              >
                Tümü
              </button>
              {SECTOR_GROUPS.map((g) => (
                <button
                  key={g.id}
                  className="mono text-xs px-3 py-1.5 rounded-sm"
                  style={{ background: sectorGroup === g.id ? "var(--ink)" : "var(--paper-dark)", color: sectorGroup === g.id ? "var(--white)" : "var(--ink)" }}
                  onClick={() => setSectorGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredSectors.map((s) => (
                <button key={s.id} className={`opt-btn p-4 rounded-sm flex items-start gap-3 ${sector === s.id ? "selected" : ""}`} onClick={() => setSector(s.id)}>
                  <s.icon size={20} color="var(--ink)" className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block">{s.label}</span>
                    <span className="block mono text-xs mt-0.5" style={{ color: "var(--moss)" }}>{s.note}</span>
                  </span>
                </button>
              ))}
              {filteredSectors.length === 0 && (
                <div className="text-sm mono col-span-2" style={{ color: "var(--moss)" }}>Eşleşen sektör bulunamadı.</div>
              )}
            </div>
          </StepShell>
        )}

        {step === "size" && (
          <StepShell title="2 · İşletme Ölçeği" onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div className="flex flex-col gap-3">
              {SIZES.map((s) => (
                <button key={s.id} className={`opt-btn p-4 rounded-sm ${size === s.id ? "selected" : ""}`} onClick={() => setSize(s.id)}>
                  <div className="disp text-sm">{s.label}</div>
                  <div className="mono text-xs" style={{ color: "var(--moss)" }}>{s.sub}</div>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {fnStepIdx >= 0 && (
          <StepShell
            title={`${3 + fnStepIdx} · ${FUNCTIONS[fnStepIdx].label}`}
            onBack={goBack}
            onNext={goNext}
            canProceed={canProceed}
            last={fnStepIdx === FUNCTIONS.length - 1}
          >
            <div className="mono text-xs mb-5 px-3 py-2 rounded-sm inline-block" style={{ background: "var(--paper-dark)", color: "var(--moss)" }}>
              Resmi boyut karşılığı — DMAT: {FRAMEWORK_ALIGNMENT[step].dmat} · DDX: {FRAMEWORK_ALIGNMENT[step].ddx} · SIRI: {FRAMEWORK_ALIGNMENT[step].siri}
            </div>
            <div className="flex flex-col gap-8">
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx}>
                  <div className="mb-3 font-medium">{q.text}</div>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        className={`opt-btn p-3 rounded-sm text-sm ${answers[step][qIdx] === oIdx + 1 ? "selected" : ""}`}
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
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} color="var(--brass)" />
              <h2 className="disp text-xl">Dijital Hazırlık Karneniz</h2>
            </div>
            <p className="text-sm mb-2" style={{ color: "var(--moss)" }}>
              {SECTORS.find((s) => s.id === sector)?.label} · {SIZES.find((s) => s.id === size)?.label}
            </p>
            <p className="text-xs mono mb-4" style={{ color: "var(--moss)" }}>
              Odak noktası: {SECTORS.find((s) => s.id === sector)?.note}
            </p>
            {size === "mikro" && (
              <p className="text-xs mono mb-6 p-2" style={{ background: "var(--paper-dark)" }}>
                Not: mikro ölçekli işletmeler için önce ücretsiz/düşük maliyetli araçlar önceliklendirildi.
              </p>
            )}

            <div className="flex flex-col gap-8 mt-4">
              {results.map((r) => (
                <div key={r.id} className="card p-5 rounded-sm">
                  <div className="flex items-center gap-4">
                    <Gauge score={r.avg} level={r.level} />
                    <div>
                      <div className="disp text-lg flex items-center gap-2">
                        <r.icon size={18} color="var(--moss)" /> {r.label}
                      </div>
                      <div className="mono text-xs" style={{ color: LEVELS[r.level].color }}>
                        Seviye: {LEVELS[r.level].label}
                      </div>
                    </div>
                  </div>
                  <div className="mono text-xs mt-3 pt-3" style={{ color: "var(--moss)", borderTop: "1px solid var(--paper-dark)" }}>
                    Resmi boyut karşılığı — DMAT: {FRAMEWORK_ALIGNMENT[r.id].dmat} · DDX: {FRAMEWORK_ALIGNMENT[r.id].ddx} · SIRI: {FRAMEWORK_ALIGNMENT[r.id].siri}
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    {r.tools.map((t, i) => (
                      <div key={i} className="p-3 rounded-sm" style={{ background: "var(--paper)" }}>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-medium text-sm">{t.name}</span>
                          <span className="mono text-xs px-2 py-0.5 rounded-sm" style={{ background: "var(--brass)", color: "var(--ink)" }}>{t.tier}</span>
                        </div>
                        <p className="text-sm mt-1">{t.why}</p>
                        <p className="text-xs mt-1" style={{ color: "var(--moss)" }}>Alternatif: {t.alt}</p>
                        <p className="text-xs mt-1 mono" style={{ color: t.sourceUrl ? "var(--moss)" : "#9C4A3C" }}>
                          Kaynak: {t.sourceUrl || "belirlenmedi"} · Son doğrulama: {t.verified}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-sm text-xs mono flex flex-col gap-2" style={{ background: "var(--paper-dark)", color: "var(--moss)" }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} /> Araç listesi örnek/ilüstratiftir — 3 ayda bir gözden geçirilir. Son güncelleme: {METHODOLOGY_LAST_UPDATED}.
              </div>
              <div>
                Metodoloji kaynakları: AB EDIH Ağı — Digital Maturity Assessment Tool (DMAT, JRC) ·
                TÜBİTAK TÜSSİDE — DDX/D3A (Boğaziçi Üniversitesi) · MEXT — SIRI (Smart Industry Readiness Index).
                Bu değerlendirme bir ön taramadır; KOSGEB Dijital Dönüşüm Destek Programı başvurusu için
                yetkilendirilmiş danışmandan alınacak resmi DDX/SIRI raporunun yerine geçmez.
              </div>
            </div>

            <button className="btn-primary disp px-5 py-3 mt-6 flex items-center gap-2" onClick={restart}>
              <RotateCcw size={16} /> Yeniden Başlat
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function StepShell({ title, children, onBack, onNext, canProceed, last }) {
  return (
    <div>
      <div className="mono text-xs mb-4" style={{ color: "var(--moss)" }}>{title}</div>
      {children}
      <div className="flex items-center gap-3 mt-8">
        <button className="px-4 py-2 flex items-center gap-1 text-sm" onClick={onBack} style={{ color: "var(--moss)" }}>
          <ArrowLeft size={16} /> Geri
        </button>
        <button className="btn-primary disp px-6 py-3 flex items-center gap-2 ml-auto" onClick={onNext} disabled={!canProceed}>
          {last ? "Karneyi Gör" : "Devam Et"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
