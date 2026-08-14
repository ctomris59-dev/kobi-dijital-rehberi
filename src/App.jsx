import React, { useState, useMemo } from "react";
import {
  Shirt, Wheat, Cog, ShoppingCart, Users, Megaphone, Boxes, Headphones,
  FlaskConical, Car, Hammer, HardHat, Truck, Tractor, UtensilsCrossed,
  Laptop, Stethoscope, GraduationCap, Landmark, Recycle, Search,
  ArrowRight, ArrowLeft, Sparkles, RotateCcw, FileDown,
  Award, ShieldCheck, Info, Target
} from "lucide-react";

/* ---------------------------------------------------------
   VERİ KATMANI — KOBİ Dijital Dönüşüm Veritabanı
--------------------------------------------------------- */

const SECTOR_GROUPS = [
  { id: "imalat", label: "İmalat Sanayi" },
  { id: "tarimgida", label: "Tarım & Gıda" },
  { id: "ticaretlojistik", label: "Ticaret & Lojistik" },
  { id: "hizmet", label: "Profesyonel Hizmetler" },
];

const SECTORS = [
  { id: "tekstil", label: "Tekstil / Konfeksiyon", icon: Shirt, group: "imalat", note: "Sezonluk koleksiyon, varyant ve stok döngüsü yönetimi" },
  { id: "metal", label: "Metal / Makine İmalatı", icon: Cog, group: "imalat", note: "Sipariş bazlı (MTO) üretim planlama ve iş emri takibi" },
  { id: "plastik", label: "Plastik / Kimya Sanayi", icon: FlaskConical, group: "imalat", note: "Reçete, parti (lot) izlenebilirliği ve kalite kaydı" },
  { id: "otomotiv", label: "Otomotiv Yan Sanayi", icon: Car, group: "imalat", note: "Ana sanayi EDI entegrasyonu ve teslimat takvimi" },
  { id: "mobilya", label: "Mobilya / Ahşap İşleme", icon: Hammer, group: "imalat", note: "Kişiselleştirilmiş sipariş ve atölye planlama" },
  { id: "insaat", label: "İnşaat / Yapı Malzemeleri", icon: HardHat, group: "imalat", note: "Proje bazlı hakediş, şantiye ve maliyet takibi" },
  { id: "ambalaj", label: "Ambalaj / Geri Dönüşüm", icon: Recycle, group: "imalat", note: "Hacimli sipariş, fire ve sevkiyat optimizasyonu" },
  { id: "gida", label: "Gıda İmalatı ve İşleme", icon: Wheat, group: "tarimgida", note: "Soğuk zincir, SKT, lot takibi ve HACCP standartları" },
  { id: "tarim", label: "Tarım / Hayvancılık", icon: Tractor, group: "tarimgida", note: "Mevsimsel rekolte, verim ve tedarikçi zinciri" },
  { id: "ticaret", label: "Ticaret / Toptan-Perakende", icon: ShoppingCart, group: "ticaretlojistik", note: "Çoklu kanal (omnichannel) satış ve B2B tahsilat" },
  { id: "lojistik", label: "Lojistik / Nakliye", icon: Truck, group: "ticaretlojistik", note: "Filo, navlun, rota ve anlık kargo izleme" },
  { id: "turizm", label: "Turizm / Konaklama ve Yeme-İçme", icon: UtensilsCrossed, group: "hizmet", note: "Kanal yönetimi, rezervasyon ve misafir ilişkileri" },
  { id: "bilisim", label: "Bilişim / Yazılım Hizmetleri", icon: Laptop, group: "hizmet", note: "Agile proje yönetimi, SLA ve efor takibi" },
  { id: "saglik", label: "Sağlık Hizmetleri", icon: Stethoscope, group: "hizmet", note: "Hasta kabul, randevu ve KVKK uyumlu medikal veri" },
  { id: "egitim", label: "Eğitim Hizmetleri", icon: GraduationCap, group: "hizmet", note: "Öğrenci otomasyonu, içerik ve veli iletişimi" },
  { id: "finans", label: "Finans / Sigorta Aracılık", icon: Landmark, group: "hizmet", note: "Portföy, poliçe yenileme ve komisyon takibi" },
];

const SIZES = [
  { id: "mikro", label: "Mikro İşletme", sub: "1–9 Çalışan", desc: "Esnek yapı, hızlı karar alma; düşük bütçeli ve hızlı devreye alınan bulut çözümlere odaklı." },
  { id: "kucuk", label: "Küçük İşletme", sub: "10–49 Çalışan", desc: "Departmanlaşma süreci; departmanlar arası veri entegrasyonu ve standart süreç ihtiyacı." },
  { id: "orta", label: "Orta Ölçekli İşletme", sub: "50–249 Çalışan", desc: "Kurumsallaşmış yapı; entegre ERP/CRM, veri güvenliği ve gelişmiş iş zekası ihtiyacı." },
];

const FUNCTIONS = [
  { id: "ik", label: "İnsan Kaynakları", icon: Users, desc: "İşe alım, bordro, izin, performans ve organizasyon yönetimi." },
  { id: "pazarlama", label: "Pazarlama & Satış", icon: Megaphone, desc: "Dijital pazarlama, lead toplama, reklam ve pazar analizi." },
  { id: "stok", label: "Stok & Üretim", icon: Boxes, desc: "Depo, satın alma, üretim planlama ve tedarik zinciri izleme." },
  { id: "musteri", label: "Müşteri İlişkileri", icon: Headphones, desc: "CRM, satış sonrası destek, talep ve sadakat yönetimi." },
];

const NEED_STATEMENTS = {
  ik: "Öncelikli Odak: Başvuru, puantaj ve performans kayıtlarını dağınık yapılar yerine KVKK uyumlu, merkezi bir bulut İK sisteminde toplamak.",
  pazarlama: "Öncelikli Odak: Müşteri kazanım süreçlerini ve içerik üretimini planlı, veri bazlı ve ölçülebilir bir pazarlama hunisine bağlamak.",
  stok: "Öncelikli Odak: Stok hareketlerini, hammadde ihtiyacını ve üretim aşamalarını Excel yerine anlık izlenebilir dijital sisteme geçirmek.",
  musteri: "Öncelikli Odak: Müşteri geçmişini, teklifleri ve şikayetleri hafızaya dayalı yapıdan kurumsal CRM veri tabanına dönüştürmek.",
};

const FRAMEWORK_ALIGNMENT = {
  ik: { dmat: "İnsan-Merkezli Dijitalleşme", ddx: "Kurumsal Yönetim", siri: "Organizasyon & Kültür" },
  pazarlama: { dmat: "Dijital İş Stratejisi", ddx: "Müşteri ve Pazar Yönetimi", siri: "Süreç Dönüşümü" },
  stok: { dmat: "Otomasyon & Veri Analitiği", ddx: "Üretim ve Tedarik Yönetimi", siri: "Teknoloji & Operasyon" },
  musteri: { dmat: "Müşteri Deneyimi & Veri", ddx: "Müşteri ve Pazar Yönetimi", siri: "Süreç Entegrasyonu" },
};

const QUESTIONS = {
  ik: [
    { text: "İşe alım ve aday başvuru süreçlerini nasıl yürütüyorsunuz?", options: [
      "Elden başvuru veya telefonla, herhangi bir kayıt tutulmuyor.",
      "Kağıt formlar veya basit Excel tabloları ile takip ediliyor.",
      "Kariyer siteleri ve e-posta üzerinden düzenli alım yapılıyor.",
      "Otomatik aday takip (ATS) ve YZ destekli eleme sistemi kullanılıyor."
    ]},
    { text: "Personel puantaj, izin ve özlük işlemlerini nasıl yönetiyorsunuz?", options: [
      "Fiziki imza defteri veya sözlü bildirimle.",
      "Excel tablosu ve manuel kontrol süreçleriyle.",
      "Muhasebe/ERP programının temel puantaj modülüyle.",
      "Bulut tabanlı, mobil erişimli entegre İK yazılımıyla."
    ]},
    { text: "Çalışan performansını ve hedef takibini nasıl yapıyorsunuz?", options: [
      "Herhangi bir performans takibi yapılmıyor.",
      "Yılda bir kez sözlü veya kağıt üzeri değerlendirmeyle.",
      "Excel KPI şablonları ile periyodik dönemlerde.",
      "Dijital OKR/KPI takip platformu ve anlık geri bildirimle."
    ]}
  ],
  pazarlama: [
    { text: "Ürün ve hizmet tanıtımlarınızı dijital kanallarda nasıl yönetiyorsunuz?", options: [
      "Sadece kulaktan kulağa veya geleneksel referanslarla.",
      "Düzensiz ve plansız sosyal medya paylaşımlarıyla.",
      "Düzenli içerik takvimi ve grafik tasarım araçları kullanarak.",
      "Çoklu kanalda bütçelendirilmiş, hedefli dijital reklam kampanyalarıyla."
    ]},
    { text: "Müşteri ve potansiyel müşteri iletişim veritabanını nasıl tutuyorsunuz?", options: [
      "Herhangi bir müşteri veritabanı tutulmuyor.",
      "Kişisel telefon rehberi veya dağınık not kağıtlarında.",
      "Paylaşımlı Excel / Google Sheets listelerinde.",
      "E-posta pazarlama ve segmentasyon altyapısına bağlı veri tabanında."
    ]},
    { text: "Pazarlama ve reklam harcamalarınızın dönüşümünü (ROI) ölçüyor musunuz?", options: [
      "Herhangi bir ölçüm yapılmıyor.",
      "Sadece genel ciro artışına bakılarak hissi yorumlanıyor.",
      "Sosyal medya beğeni ve erişim istatistikleri takip ediliyor.",
      "Google/Meta Analytics üzerinden dönüşüm ve müşteri kazanım maliyeti (CAC) anlık izleniyor."
    ]}
  ],
  stok: [
    { text: "Hammadde, yarı mamul ve mamul stok takibini nasıl gerçekleştiriyorsunuz?", options: [
      "Görsel fiziki kontrol ve tecrübeye dayalı tahminle.",
      "Kağıt üzeri stok kartları veya Excel sayım dosyalarıyla.",
      "Barkod/QR okuyucu destekli ticari stok yazılımıyla.",
      "ERP entegreli, anlık depo ve konum takip sistemiyle."
    ]},
    { text: "Üretim ve sipariş planlama süreçlerini nasıl yönetiyorsunuz?", options: [
      "Sipariş geldikçe anlık ve plansız müdahalelerle.",
      "Haftalık kağıt üzeri veya pano üzeri üretim programıyla.",
      "Excel tabanlı detaylı üretim ve kapasite planlama dosyalarıyla.",
      "Dijital Üretim Takip (MES/APS) ve ERP entegre yazılımlarla."
    ]},
    { text: "Tedarikçi siparişleri ve satın alma süreçlerini nasıl izliyorsunuz?", options: [
      "Sözlü iletişim veya WhatsApp mesajlarıyla.",
      "Not defterleri ve manuel sipariş fişleriyle.",
      "Excel sipariş takip ve kontrol çizelgeleriyle.",
      "Otomatik kritik stok uyarısı veren ERP satın alma modülüyle."
    ]}
  ],
  musteri: [
    { text: "Müşteri talep, destek ve şikayet kayıtlarnı nasıl topluyorsunuz?", options: [
      "Herhangi bir kayıt mekanizması bulunmuyor.",
      "Sözlü talepler hatırlandığı kadarıyla takip ediliyor.",
      "E-posta veya WhatsApp yazışmaları üzerinden dağınık halde.",
      "Merkezi CRM / Destek Masası (Ticketing) sistemi üzerinden kayıtlı."
    ]},
    { text: "Müşteri geçmişine (eski teklifler, faturalar, görüşmeler) ne kadar sürede ulaşıyorsunuz?", options: [
      "Müşteri geçmişine ulaşmak mümkün olmuyor.",
      "Fiziki klasörler ve arşiv faturaları taranarak uzun sürede.",
      "Excel arşiv dosyaları ve bilgisayar klasörlerinden aratarak.",
      "CRM ekranından müşteri kartına tıklayarak saniyeler içinde."
    ]},
    { text: "Mevcut müşterilere tekrar satış ve teklif takibini nasıl yapıyorsunuz?", options: [
      "Tekrar satış için sistemsel bir çalışma yapılmıyor.",
      "Hatırlandıkça telefonla aranarak hatır soruluyor.",
      "Toplu e-posta veya WhatsApp duyuruları gönderilerek.",
      "CRM otomasyonu ile yaklaşan bakım/yenileme tarihlerinde otomatik teklif çıkararak."
    ]}
  ]
};

const TOOLS = {
  ik: {
    baslangic: [
      { name: "Google Forms & Sheets İK Paketi", why: "Kodlama gerektirmeden başvuru formları oluşturur ve verileri otomatik tablolandırır." },
      { name: "Kariyer.net Kurumsal Ücretsiz İlan", why: "Elden başvuru toplama yerine dijital havuz oluşturmayı sağlar." },
    ],
    gelisen: [
      { name: "Manatal No-Code ATS", why: "Aday CV'lerini otomatik ayrıştırır, puanlar ve kurul değerlendirmesine sunar." },
      { name: "Kolay İK Bulut Platformu", why: "İzin, puantaj, masraf ve özlük dosyalarını KVKK uyumlu tek merkezde toplar." },
    ],
    ileri: [
      { name: "Bordro.io Entegre İK", why: "Bordro, dijital imza, vardiya ve mevzuat süreçlerini tek bulutta birleştirir." },
      { name: "SAP SuccessFactors", why: "Uluslararası ölçekte yetenek yönetimi, performans ve analitik sunar." },
    ],
  },
  pazarlama: {
    baslangic: [
      { name: "Canva Pro KOBİ Tasarım", why: "Tasarımcı ihtiyacı olmadan kurumsal broşür ve sosyal medya içeriği üretir." },
      { name: "Meta Business Suite", why: "Instagram ve Facebook paylaşımlarını tek panelden takvime bağlar." },
    ],
    gelisen: [
      { name: "Brevo (Sendinblue) E-Pazarlama", why: "Müşteri segmentasyonuna göre otomatik e-posta ve SMS kampanyaları atar." },
      { name: "Google & Meta Ads Manager", why: "Hedef kitleye yönelik arama ve sosyal medya reklamlarını ölçülebilir kılar." },
    ],
    ileri: [
      { name: "Insider Omnichannel AI", why: "Çoklu kanalda kişiselleştirilmiş müşteri deneyimi ve pazarlama otomasyonu sağlar." },
      { name: "HubSpot Marketing Hub", why: "Inbound pazarlama, lead skorlama ve satış dönüşüm analitiğini entegre eder." },
    ],
  },
  stok: {
    baslangic: [
      { name: "Barkod Destekli Excel Şablonu", why: "Manuel sayım hatalarını azaltarak temel stok giriş-çıkış kontrolü sağlar." },
      { name: "inFlow Inventory Mobile", why: "Akıllı telefon kamerası ile barkod okutarak mobil stok takibi yaptırır." },
    ],
    gelisen: [
      { name: "Odoo ERP Community", why: "Stok, satın alma, imalat ve faturalamayı modüler yapıda bağlar." },
      { name: "Mikro Run / Jump ERP", why: "Yerli e-fatura/e-arşiv ve mevzuata tam uyumlu stok ve sipariş yönetimi." },
    ],
    ileri: [
      { name: "Logo Tiger 3 Enterprise", why: "Gelişmiş üretim planlama, MRP-II, tedarik ve finans entegrasyonu." },
      { name: "SAP Business One", why: "Global standartlarda depo, üretim, kalite kontrol ve tedarik zinciri." },
    ],
  },
  musteri: {
    baslangic: [
      { name: "WhatsApp Business Kurumsal", why: "Otomatik karşılama, katalog ve hızlı yanıtlarla müşteri iletişimini düzenler." },
      { name: "Notion Müşteri Veritabanı", why: "Dağınık müşteri notlarını şık ve aranabilir bir panoya taşır." },
    ],
    gelisen: [
      { name: "HubSpot Free / Starter CRM", why: "Satış fırsatlarını (pipeline), teklifleri ve e-posta geçmişini tek ekranda toplar." },
      { name: "Zoho CRM KOBİ Paketi", why: "Satış ekibi görev takibi, müşteri kartı ve e-posta entegrasyonu sunar." },
    ],
    ileri: [
      { name: "Salesforce Sales Cloud", why: "Dünya standardı satış gücü otomasyonu, tahminleme ve müşteri analitiği." },
      { name: "Zoho One Kurumsal Süit", why: "40+ entegre uygulama ile satış, pazarlama, destek ve muhasebeyi birleştirir." },
    ],
  },
};

const LEVELS = {
  baslangic: { label: "Başlangıç Seviyesi", color: "#EF4444" },
  gelisen: { label: "Gelişen Seviye", color: "#F59E0B" },
  ileri: { label: "İleri Seviye", color: "#10B981" },
};

const TIER_PRESENTATION = {
  baslangic: { heading: "1. Aşama: Temel Çözümler" },
  gelisen: { heading: "2. Aşama: Otomasyon & Süreç İyileştirme" },
  ileri: { heading: "3. Aşama: Kurumsal Entegrasyon & ERP" },
};
const TIER_ORDER = ["baslangic", "gelisen", "ileri"];

function levelFromScore(avg) {
  if (avg < 2) return "baslangic";
  if (avg < 3) return "gelisen";
  return "ileri";
}

function ScoreGauge({ score, level }) {
  const percentage = Math.min(Math.max(((score - 1) / 3) * 100, 0), 100);
  const strokeDasharray = 251;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke={LEVELS[level].color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      <div style={{ position: "absolute", bottom: "4px", textAlign: "center" }}>
        <span style={{ fontSize: "28px", fontWeight: "800", color: "#FFFFFF" }}>{score.toFixed(1)}</span>
        <span style={{ fontSize: "12px", color: "#94A3B8" }}> / 4.0</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN APPLICATION (ABSOLUTE OVERRIDE VIEWPORT)
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

  const overallAvg = useMemo(() => {
    if (results.length === 0) return 1;
    return results.reduce((acc, curr) => acc + curr.avg, 0) / results.length;
  }, [results]);

  const overallLevel = levelFromScore(overallAvg);

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

  const selectedSectorObj = useMemo(() => SECTORS.find((s) => s.id === sector), [sector]);
  const selectedSizeObj = useMemo(() => SIZES.find((s) => s.id === size), [size]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100vw",
      height: "100vh",
      overflowY: "auto",
      backgroundColor: "#0F172A",
      color: "#F8FAFC",
      fontFamily: "system-ui, -apple-system, sans-serif",
      zIndex: 999999,
      boxSizing: "border-box"
    }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          div { background: white !important; color: black !important; position: static !important; }
          .print-card { background: white !important; color: black !important; border: 1px solid #CBD5E1 !important; }
        }
      ` }} />

      {/* HEADER */}
      <header style={{ backgroundColor: "#1E293B", borderBottom: "1px solid #334155", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#2563EB", color: "#FFF", fontWeight: "900", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Ç
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: "800", fontSize: "16px", color: "#FFF" }}>ÇORLU TSO</span>
                <span style={{ backgroundColor: "rgba(37, 99, 235, 0.25)", color: "#60A5FA", border: "1px solid rgba(96, 165, 250, 0.4)", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>
                  DİJİTAL DÖNÜŞÜM MERKEZİ
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>KOBİ Dijital Hazırlık & Yapay Zeka Rehberi</p>
            </div>
          </div>

          {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#0F172A", padding: "6px 14px", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8" }}>İlerleme:</span>
              <div style={{ width: "100px", backgroundColor: "#334155", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#2563EB", height: "100%", width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#60A5FA" }}>%{Math.round((stepIdx / (STEPS.length - 1)) * 100)}</span>
            </div>
          )}

          {step === "results" && (
            <button
              onClick={() => window.print()}
              className="no-print"
              style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FileDown size={16} /> Raporu İndir
            </button>
          )}
        </div>
      </header>

      {/* HERO / INTRO */}
      {step === "intro" && (
        <div style={{ background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)", borderBottom: "1px solid #334155", padding: "56px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(37, 99, 235, 0.15)", border: "1px solid rgba(96, 165, 250, 0.3)", padding: "6px 14px", borderRadius: "20px", color: "#60A5FA", fontSize: "12px", fontWeight: "700", marginBottom: "20px" }}>
              <Sparkles size={14} /> EU DMAT · TÜBİTAK DDX · MEXT SIRI METODOLOJİSİ
            </div>
            <h1 style={{ fontSize: "38px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1.25", marginBottom: "18px", color: "#FFF" }}>
              İşletmenizin Dijital Olgunluğunu Ölçün,<br />
              <span style={{ color: "#60A5FA" }}>Size Özel Dijital Yol Haritasını Çıkarın</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: "1.6", marginBottom: "32px" }}>
              10 dakikalık hızlı keşifle İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizdeki 
              dijitalleşme seviyenizi ölçün; bütçenize uygun somut araç ve yazılım önerilerini hemen edin.
            </p>
            <button
              onClick={goNext}
              style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)" }}
            >
              Keşfe Başla <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* MAIN BODY */}
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "36px 24px" }}>

        {/* INTRO CONTENT */}
        {step === "intro" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "12px", fontWeight: "800", color: "#64748B", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>
                DEĞERLENDİRİLEN 4 TEMEL OPERASYONEL ALAN
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                {FUNCTIONS.map((f) => (
                  <div key={f.id} style={{ backgroundColor: "#1E293B", padding: "20px", borderRadius: "14px", border: "1px solid #334155", textAlign: "left" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                      <f.icon size={20} />
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: "800", marginBottom: "4px", color: "#FFF" }}>{f.label}</h3>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, lineHeight: "1.4" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: "#1E293B", padding: "24px", borderRadius: "14px", border: "1px solid #334155", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#FFF", marginBottom: "4px" }}>Resmi Çerçevelerle Hizalanmış Metodoloji</h3>
                <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: "1.6", margin: 0 }}>
                  Soru ve puanlama yapımız; AB Dijital Avrupa Programı <strong>DMAT</strong>, TÜBİTAK TÜSSİDE <strong>DDX (D3A)</strong> ve MEXT <strong>SIRI</strong> standartlarına dayanmaktadır. 
                  Bu araç KOBİ'lerin resmi danışmanlık öncesinde durum tespiti yapmasını sağlayan <strong>ön tarama rehberidir</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: SECTOR */}
        {step === "sector" && (
          <StepContainer title="1 · Sektörünüz" subtitle="İşletmenizin ana faaliyet alanını seçin." onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ position: "relative", marginBottom: "12px" }}>
                <Search size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "#64748B" }} />
                <input
                  type="text"
                  value={sectorQuery}
                  onChange={(e) => setSectorQuery(e.target.value)}
                  placeholder="Sektör ara..."
                  style={{ width: "100%", padding: "10px 14px 10px 42px", backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "8px", color: "#FFF", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                <button
                  onClick={() => setSectorGroup("all")}
                  style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === "all" ? "#2563EB" : "#334155", color: "#FFF" }}
                >
                  Tümü
                </button>
                {SECTOR_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSectorGroup(g.id)}
                    style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === g.id ? "#2563EB" : "#334155", color: "#FFF", whiteSpace: "nowrap" }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
              {filteredSectors.map((s) => {
                const isSelected = sector === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSector(s.id)}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "rgba(37, 99, 235, 0.2)" : "#0F172A",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #334155",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <div style={{ width: "32px", height: "32px", borderRadius: "6px", backgroundColor: isSelected ? "#2563EB" : "#1E293B", color: isSelected ? "#FFF" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <s.icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "13px", color: "#FFF" }}>{s.label}</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: "1.3", marginTop: "2px" }}>{s.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </StepContainer>
        )}

        {/* STEP 2: SIZE */}
        {step === "size" && (
          <StepContainer title="2 · İşletme Ölçeği" subtitle="Çalışan sayınıza uygun ölçeği seçin." onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    style={{
                      padding: "20px",
                      borderRadius: "12px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "rgba(37, 99, 235, 0.2)" : "#0F172A",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #334155",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: "800", backgroundColor: isSelected ? "#2563EB" : "#334155", color: "#FFF", padding: "3px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "10px" }}>
                      {s.sub}
                    </span>
                    <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#FFF", margin: "0 0 6px 0" }}>{s.label}</h4>
                    <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: "1.4", margin: 0 }}>{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </StepContainer>
        )}

        {/* STEPS 3-6: QUESTIONS */}
        {fnStepIdx >= 0 && (
          <StepContainer
            title={`${3 + fnStepIdx} · ${FUNCTIONS[fnStepIdx].label}`}
            subtitle="Mevcut durumunuzu en doğru yansıtan seçeneği işaretleyin."
            onBack={goBack}
            onNext={goNext}
            canProceed={canProceed}
            last={fnStepIdx === FUNCTIONS.length - 1}
          >
            <div style={{ backgroundColor: "#0F172A", border: "1px solid #334155", padding: "10px 14px", borderRadius: "8px", fontSize: "12px", color: "#94A3B8", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Info size={16} color="#60A5FA" />
              <span>Resmi boyut karşılığı — DMAT: {FRAMEWORK_ALIGNMENT[step].dmat} · DDX: {FRAMEWORK_ALIGNMENT[step].ddx} · SIRI: {FRAMEWORK_ALIGNMENT[step].siri}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx} style={{ backgroundColor: "#0F172A", padding: "18px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#FFF", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", fontSize: "11px", fontWeight: "800", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      {qIdx + 1}
                    </span>
                    {q.text}
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "8px" }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[step][qIdx] === oIdx + 1;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setAnswer(step, qIdx, oIdx + 1)}
                          style={{
                            padding: "12px",
                            borderRadius: "8px",
                            textAlign: "left",
                            fontSize: "12px",
                            backgroundColor: isSelected ? "#2563EB" : "#1E293B",
                            color: isSelected ? "#FFF" : "#CBD5E1",
                            border: isSelected ? "1px solid #60A5FA" : "1px solid #334155",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px"
                          }}
                        >
                          <span style={{ fontWeight: "800", opacity: 0.7 }}>{oIdx + 1}.</span>
                          <span style={{ lineHeight: "1.4" }}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </StepContainer>
        )}

        {/* STEP 7: RESULTS */}
        {step === "results" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* OVERALL SUMMARY */}
            <div className="print-card" style={{ backgroundColor: "#1E293B", padding: "32px", borderRadius: "20px", border: "1px solid #334155", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", padding: "4px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", marginBottom: "10px" }}>
                  <Award size={14} /> DİJİTAL HAZIRLIK KARNENİZ
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#FFF", margin: 0 }}>
                  Genel Seviye: <span style={{ color: LEVELS[overallLevel].color }}>{LEVELS[overallLevel].label}</span>
                </h2>
                <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "6px", margin: 0 }}>
                  {selectedSectorObj?.label} · {selectedSizeObj?.label}
                </p>
              </div>

              <div style={{ backgroundColor: "#0F172A", padding: "16px 24px", borderRadius: "14px", border: "1px solid #334155", textAlign: "center", minWidth: "160px" }}>
                <ScoreGauge score={overallAvg} level={overallLevel} />
                <div style={{ fontSize: "10px", fontWeight: "800", color: "#94A3B8", marginTop: "6px" }}>GENEL SKOR ORTALAMASI</div>
              </div>
            </div>

            {/* DETAILED RESULTS */}
            {results.map((r) => {
              const levelObj = LEVELS[r.level];
              return (
                <div key={r.id} className="print-card" style={{ backgroundColor: "#1E293B", borderRadius: "16px", border: "1px solid #334155", padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", paddingBottom: "16px", borderBottom: "1px solid #334155" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: "#2563EB", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <r.icon size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#FFF", margin: 0 }}>{r.label}</h3>
                        <span style={{ fontSize: "12px", color: levelObj.color, fontWeight: "700" }}>
                          Seviye: {levelObj.label} ({r.avg.toFixed(1)} / 4.0)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: "10px", border: "1px solid #334155", margin: "16px 0", fontSize: "12px", color: "#E2E8F0", display: "flex", gap: "8px", alignItems: "center" }}>
                    <Target size={16} color="#60A5FA" />
                    <span>{NEED_STATEMENTS[r.id]}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {TIER_ORDER.map((tierKey) => {
                      const tierInfo = TIER_PRESENTATION[tierKey];
                      const isCurrentLevelTier = r.level === tierKey;
                      const toolsList = TOOLS[r.id][tierKey];

                      return (
                        <div key={tierKey} style={{ backgroundColor: "#0F172A", padding: "14px", borderRadius: "10px", border: isCurrentLevelTier ? "2px solid #F59E0B" : "1px solid #334155" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <div style={{ fontSize: "12px", fontWeight: "800", color: "#FFF" }}>{tierInfo.heading}</div>
                            {isCurrentLevelTier && (
                              <span style={{ backgroundColor: "#F59E0B", color: "#000", fontSize: "10px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px" }}>
                                SİZİN SEVİYENİZ
                              </span>
                            )}
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                            {toolsList.map((tool, tIdx) => (
                              <div key={tIdx} style={{ backgroundColor: "#1E293B", padding: "12px", borderRadius: "8px", border: "1px solid #334155" }}>
                                <div style={{ fontSize: "12px", fontWeight: "700", color: "#60A5FA", marginBottom: "3px" }}>{tool.name}</div>
                                <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0, lineHeight: "1.3" }}>{tool.why}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* ACTION BUTTONS */}
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <button onClick={restart} style={{ backgroundColor: "transparent", color: "#94A3B8", border: "1px solid #334155", padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <RotateCcw size={16} /> Yeniden Başlat
              </button>
              <button onClick={() => window.print()} style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "12px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileDown size={16} /> PDF Olarak İndir / Yazdır
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

/* REUSABLE SHELL */
function StepContainer({ title, subtitle, children, onBack, onNext, canProceed, last }) {
  return (
    <div style={{ backgroundColor: "#1E293B", borderRadius: "18px", border: "1px solid #334155", padding: "28px" }}>
      <div style={{ borderBottom: "1px solid #334155", paddingBottom: "16px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#FFF", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px", margin: 0 }}>{subtitle}</p>
      </div>

      <div>{children}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #334155" }} className="no-print">
        <button onClick={onBack} style={{ backgroundColor: "transparent", color: "#94A3B8", border: "1px solid #334155", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={16} /> Geri
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            backgroundColor: canProceed ? "#2563EB" : "#334155",
            color: canProceed ? "#FFF" : "#64748B",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "800",
            cursor: canProceed ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>{last ? "Karneyi Gör" : "Devam Et"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
