import React, { useState, useMemo } from "react";
import {
  Shirt, Wheat, Cog, ShoppingCart, Users, Megaphone, Boxes, Headphones,
  FlaskConical, Car, Hammer, HardHat, Truck, Tractor, UtensilsCrossed,
  Laptop, Stethoscope, GraduationCap, Landmark, Recycle, Search,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, RotateCcw, FileDown,
  Award, ShieldCheck, BarChart3, Check, Info, Target, ExternalLink
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

const METHODOLOGY_LAST_UPDATED = "14 Ağustos 2026";

const SOURCES = [
  {
    org: "Avrupa Komisyonu JRC / EDIH Ağı",
    title: "Digital Maturity Assessment Tool (DMAT)",
    desc: "AB Dijital Avrupa Programı kapsamında EDIH'lerin kullandığı, KOBİ dijital olgunluğunu 6 ana boyutta değerlendiren uluslararası standart.",
    url: "european-digital-innovation-hubs.ec.europa.eu/dma-tool",
  },
  {
    org: "TÜBİTAK TÜSSİDE & Boğaziçi Üniversitesi",
    title: "DDX Dijital Dönüşüm Değerlendirme Modeli (D3A)",
    desc: "İşletmelerin dijital olgunluğunu 5 stratejik boyutta (Kurumsal Yönetim, Müşteri/Pazar, Ar-Ge, Tedarik, Üretim) ölçen ulusal model.",
    url: "ddxmodel.tubitak.gov.tr",
  },
  {
    org: "MEXT Teknoloji Merkezi & WEF",
    title: "SIRI — Smart Industry Readiness Index",
    desc: "Süreç, Teknoloji ve Organizasyon boyutlarında sanayi kuruluşlarının Endüstri 4.0 olgunluğunu ölçümleyen global indeks.",
    url: "mext.org.tr/siri",
  },
  {
    org: "KOSGEB Başkanlığı",
    title: "KOBİ Dijital Dönüşüm Destek Programı",
    desc: "Uygun teşvik ve hibe başvurularında resmi DDX/SIRI olgunluk raporu şartı arayan ulusal destek mekanizması.",
    url: "kosgeb.gov.tr",
  },
];

const SCORING_METHOD_TEXT =
  "Her fonksiyon için yöneltilen 3 soru, 4 aşamalı dijital olgunluk seviyesine (1: Manuel/Geleneksel, 2: Kısmi Dijital, 3: Entegre Dijital, 4: İleri Otomasyon/YZ) göre puanlanır. " +
  "Soruların aritmetik ortalaması <2.0 ise 'Başlangıç Seviyesi', 2.0–2.99 arası 'Gelişen Seviye', ≥3.0 ise 'İleri Seviye' olarak derecelendirilir.";

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
      { name: "Google Forms & Sheets İK Paketi", tier: "Ücretsiz", why: "Kodlama gerektirmeden başvuru formları oluşturur ve verileri otomatik tablolandırır.", alt: "Microsoft Forms", sourceUrl: "workspace.google.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Kariyer.net Kurumsal Ücretsiz İlan", tier: "Ücretsiz", why: "Elden başvuru toplama yerine dijital havuz oluşturmayı sağlar.", alt: "LinkedIn İş İlanları", sourceUrl: "kariyer.net", verified: "Ağu 2026", origin: "yerli" },
    ],
    gelisen: [
      { name: "Manatal No-Code ATS", tier: "Düşük Abonelik", why: "Aday CV'lerini otomatik ayrıştırır, puanlar ve kurul değerlendirmesine sunar.", alt: "Recruitee", sourceUrl: "manatal.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Kolay İK Bulut Platformu", tier: "KOBİ Abonelik", why: "İzin, puantaj, masraf ve özlük dosyalarını KVKK uyumlu tek merkezde toplar.", alt: "Mikro İK", sourceUrl: "kolayik.com", verified: "Ağu 2026", origin: "yerli" },
    ],
    ileri: [
      { name: "Bordro.io Entegre İK", tier: "Kurumsal", why: "Bordro, dijital imza, vardiya ve mevzuat süreçlerini tek bulutta birleştirir.", alt: "Logo HR", sourceUrl: "bordro.io", verified: "Ağu 2026", origin: "yerli" },
      { name: "SAP SuccessFactors", tier: "Kurumsal", why: "Uluslararası ölçekte yetenek yönetimi, performans ve analitik sunar.", alt: "Workday", sourceUrl: "sap.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  pazarlama: {
    baslangic: [
      { name: "Canva Pro KOBİ Tasarım", tier: "Ücretsiz / Düşük", why: "Tasarımcı ihtiyacı olmadan kurumsal broşür ve sosyal medya içeriği üretir.", alt: "Adobe Express", sourceUrl: "canva.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Meta Business Suite", tier: "Ücretsiz", why: "Instagram ve Facebook paylaşımlarını tek panelden takvime bağlar.", alt: "Buffer", sourceUrl: "business.facebook.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Brevo (Sendinblue) E-Pazarlama", tier: "Düşük Abonelik", why: "Müşteri segmentasyonuna göre otomatik e-posta ve SMS kampanyaları atar.", alt: "Mailchimp", sourceUrl: "brevo.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Google & Meta Ads Manager", tier: "Esnek Bütçe", why: "Hedef kitleye yönelik arama ve sosyal medya reklamlarını ölçülebilir kılar.", alt: "TikTok Ads Manager", sourceUrl: "ads.google.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    ileri: [
      { name: "Insider Omnichannel AI", tier: "Kurumsal", why: "Çoklu kanalda kişiselleştirilmiş müşteri deneyimi ve pazarlama otomasyonu sağlar.", alt: "HubSpot Marketing", sourceUrl: "useinsider.com", verified: "Ağu 2026", origin: "yerli" },
      { name: "HubSpot Marketing Hub", tier: "Kurumsal", why: "Inbound pazarlama, lead skorlama ve satış dönüşüm analitiğini entegre eder.", alt: "ActiveCampaign", sourceUrl: "hubspot.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  stok: {
    baslangic: [
      { name: "Barkod Destekli Excel Şablonu", tier: "Ücretsiz", why: "Manuel sayım hatalarını azaltarak temel stok giriş-çıkış kontrolü sağlar.", alt: "Google Sheets Stok", sourceUrl: "", verified: "N/A — Şablon", origin: "kategori örneği" },
      { name: "inFlow Inventory Mobile", tier: "Ücretsiz / Düşük", why: "Akıllı telefon kamerası ile barkod okutarak mobil stok takibi yaptırır.", alt: "Stockin", sourceUrl: "inflowinventory.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Odoo ERP Community", tier: "Açık Kaynak", why: "Stok, satın alma, imalat ve faturalamayı modüler yapıda bağlar.", alt: "Zoho Inventory", sourceUrl: "odoo.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Mikro Run / Jump ERP", tier: "KOBİ Lisans", why: "Yerli e-fatura/e-arşiv ve mevzuata tam uyumlu stok ve sipariş yönetimi.", alt: "Paraşüt Ticari", sourceUrl: "mikro.com.tr", verified: "Ağu 2026", origin: "yerli" },
    ],
    ileri: [
      { name: "Logo Tiger 3 Enterprise", tier: "Kurumsal", why: "Gelişmiş üretim planlama, MRP-II, tedarik ve finans entegrasyonu.", alt: "SAP Business One", sourceUrl: "logo.com.tr", verified: "Ağu 2026", origin: "yerli" },
      { name: "SAP Business One", tier: "Kurumsal", why: "Global standartlarda depo, üretim, kalite kontrol ve tedarik zinciri.", alt: "Dynamics 365 Business Central", sourceUrl: "sap.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  musteri: {
    baslangic: [
      { name: "WhatsApp Business Kurumsal", tier: "Ücretsiz", why: "Otomatik karşılama, katalog ve hızlı yanıtlarla müşteri iletişimini düzenler.", alt: "Telegram Business", sourceUrl: "business.whatsapp.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Notion Müşteri Veritabanı", tier: "Ücretsiz", why: "Dağınık müşteri notlarını şık ve aranabilir bir panoya taşır.", alt: "Trello CRM", sourceUrl: "notion.so", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "HubSpot Free / Starter CRM", tier: "Düşük Abonelik", why: "Satış fırsatlarını (pipeline), teklifleri ve e-posta geçmişini tek ekranda toplar.", alt: "Zoho CRM", sourceUrl: "hubspot.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Zoho CRM KOBİ Paketi", tier: "Düşük Abonelik", why: "Satış ekibi görev takibi, müşteri kartı ve e-posta entegrasyonu sunar.", alt: "Pipedrive", sourceUrl: "zoho.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    ileri: [
      { name: "Salesforce Sales Cloud", tier: "Kurumsal", why: "Dünya standardı satış gücü otomasyonu, tahminleme ve müşteri analitiği.", alt: "Dynamics 365 CRM", sourceUrl: "salesforce.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Zoho One Kurumsal Süit", tier: "Kurumsal", why: "40+ entegre uygulama ile satış, pazarlama, destek ve muhasebeyi birleştirir.", alt: "Bitrix24", sourceUrl: "zoho.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
};

const LEVELS = {
  baslangic: { label: "Başlangıç Seviyesi", color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
  gelisen: { label: "Gelişen Seviye", color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
  ileri: { label: "İleri Seviye", color: "#10B981", bg: "#ECFDF5", border: "#6EE7B7" },
};

const TIER_PRESENTATION = {
  baslangic: { heading: "1. Aşama: Temel Dijitalleşme Çözümleri", sub: "Mevcut kaynaklarla hızlı başlanabilecek, sıfır veya düşük maliyetli araçlar.", badge: "Sıfır / Düşük Maliyet" },
  gelisen: { heading: "2. Aşama: Süreç İyileştirme & Otomasyon", sub: "Departman ölçeğinde verimlilik sağlayan abonelik tabanlı profesyonel yazılımlar.", badge: "KOBİ Standardı" },
  ileri: { heading: "3. Aşama: Kurumsal Dönüşüm & ERP/YZ", sub: "Tüm sistemleri entegre eden, veri odaklı karar almayı sağlayan üst düzey platformlar.", badge: "Kurumsal Entegrasyon" },
};
const TIER_ORDER = ["baslangic", "gelisen", "ileri"];

function levelFromScore(avg) {
  if (avg < 2) return "baslangic";
  if (avg < 3) return "gelisen";
  return "ileri";
}

/* ---------------------------------------------------------
   GAUGE COMPONENT — Modern Radial Meter
--------------------------------------------------------- */
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
   MAIN APPLICATION
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
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", color: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* GLOBAL STYLES & PRINT OVERRIDES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { background: white !important; color: black !important; border: 1px solid #CBD5E1 !important; box-shadow: none !important; }
        }
      ` }} />

      {/* HEADER BAR */}
      <header style={{ backgroundColor: "#1E293B", borderBottom: "1px solid #334155", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1150px", margin: "0 auto", padding: "0 24px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#2563EB", display: "flex", alignItems: "center", justifyCenter: "center", fontWeight: "900", fontSize: "20px", color: "#FFF", lineHeight: "40px", textAlign: "center" }}>
              Ç
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: "800", fontSize: "16px", color: "#FFF", letterSpacing: "-0.3px" }}>ÇORLU TSO</span>
                <span style={{ backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", border: "1px solid rgba(96, 165, 250, 0.3)", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>
                  DİJİTAL DÖNÜŞÜM MERKEZİ
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0 }}>KOBİ Dijital Hazırlık & Yapay Zeka Rehberi</p>
            </div>
          </div>

          {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#0F172A", padding: "8px 16px", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8" }}>İlerleme:</span>
              <div style={{ width: "120px", backgroundColor: "#334155", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ backgroundColor: "#2563EB", height: "100%", width: `${(stepIdx / (STEPS.length - 1)) * 100}%`, transition: "all 0.3s" }} />
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
              <FileDown size={16} /> Raporu İndir / Yazdır
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION FOR INTRO */}
      {step === "intro" && (
        <div style={{ background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)", borderBottom: "1px solid #334155", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(37, 99, 235, 0.15)", border: "1px solid rgba(96, 165, 250, 0.3)", padding: "6px 14px", borderRadius: "20px", color: "#60A5FA", fontSize: "12px", fontWeight: "700", marginBottom: "24px" }}>
              <Sparkles size={14} /> EU DMAT · TÜBİTAK DDX · MEXT SIRI UYUMLU METODOLOJİ
            </div>
            <h1 style={{ fontSize: "40px", fontWeight: "900", letterSpacing: "-1px", lineHeight: "1.2", marginBottom: "20px", color: "#FFF" }}>
              İşletmenizin Dijital Olgunluğunu Ölçün,<br />
              <span style={{ background: "linear-gradient(90deg, #60A5FA 0%, #93C5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Size Özel Dijital Yol Haritasını Edinin
              </span>
            </h1>
            <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: "1.6", marginBottom: "32px" }}>
              10 dakikalık hızlı değerlendirme ile İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizdeki 
              dijitalleşme seviyenizi öğrenin; bütçenize uygun somut araç ve yazılım önerilerini hemen inceleyin.
            </p>
            <button
              onClick={goNext}
              style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)" }}
            >
              Analize Başla <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>

        {/* INTRO CONTENT */}
        {step === "intro" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "12px", fontWeight: "800", color: "#64748B", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
                DEĞERLENDİRİLEN 4 TEMEL OPERASYONEL ALAN
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {FUNCTIONS.map((f) => (
                  <div key={f.id} style={{ backgroundColor: "#1E293B", padding: "24px", borderRadius: "16px", border: "1px solid #334155", textAlign: "left" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                      <f.icon size={22} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "6px", color: "#FFF" }}>{f.label}</h3>
                    <p style={{ fontSize: "12px", color: "#94A3B8", margin: 0, lineHeight: "1.5" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: "#1E293B", padding: "28px", borderRadius: "16px", border: "1px solid #334155", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#FFF", marginBottom: "6px" }}>Resmi Çerçevelerle Hizalanmış Metodoloji</h3>
                <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: "1.6", margin: 0 }}>
                  Soru ve puanlama yapımız; AB Dijital Avrupa Programı <strong>DMAT</strong>, TÜBİTAK TÜSSİDE <strong>DDX (D3A)</strong> ve MEXT <strong>SIRI</strong> standartlarına dayanmaktadır. 
                  Bu araç KOBİ'lerin resmi danışmanlık öncesinde durum tespiti yapmasını sağlayan <strong>ön tarama rehberidir</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: SECTOR */}
        {step === "sector" && (
          <StepContainer title="Sektör Seçimi" subtitle="İşletmenizin ana faaliyet alanını seçin." onBack={goBack} onNext={goNext} canProceed={canProceed} stepNumber={1}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <Search size={18} style={{ position: "absolute", left: "14px", top: "14px", color: "#64748B" }} />
                <input
                  type="text"
                  value={sectorQuery}
                  onChange={(e) => setSectorQuery(e.target.value)}
                  placeholder="Sektörünüzü arayın (Tekstil, Metal, Otomotiv, Gıda)..."
                  style={{ width: "100%", padding: "12px 14px 12px 42px", backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "10px", color: "#FFF", fontSize: "14px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
                <button
                  onClick={() => setSectorGroup("all")}
                  style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === "all" ? "#2563EB" : "#334155", color: "#FFF" }}
                >
                  Tüm Sektörler
                </button>
                {SECTOR_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSectorGroup(g.id)}
                    style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === g.id ? "#2563EB" : "#334155", color: "#FFF", whiteSpace: "nowrap" }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px", maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }}>
              {filteredSectors.map((s) => {
                const isSelected = sector === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSector(s.id)}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "rgba(37, 99, 235, 0.2)" : "#0F172A",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #334155",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "start",
                      gap: "12px",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: isSelected ? "#2563EB" : "#1E293B", color: isSelected ? "#FFF" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", shrink: 0 }}>
                      <s.icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", fontSize: "14px", color: "#FFF", marginBottom: "2px" }}>{s.label}</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", lineHeight: "1.4" }}>{s.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </StepContainer>
        )}

        {/* STEP 2: SIZE */}
        {step === "size" && (
          <StepContainer title="İşletme Ölçeği" subtitle="Çalışan sayınıza uygun ölçeği seçin." onBack={goBack} onNext={goNext} canProceed={canProceed} stepNumber={2}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    style={{
                      padding: "24px",
                      borderRadius: "16px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "rgba(37, 99, 235, 0.2)" : "#0F172A",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #334155",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifySpace: "between"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "800", backgroundColor: isSelected ? "#2563EB" : "#334155", color: "#FFF", padding: "4px 8px", borderRadius: "4px", display: "inline-block", marginBottom: "12px" }}>
                        {s.sub}
                      </span>
                      <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#FFF", marginBottom: "8px", margin: 0 }}>{s.label}</h4>
                      <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: "1.5", margin: 0 }}>{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </StepContainer>
        )}

        {/* STEPS 3-6: QUESTIONS */}
        {fnStepIdx >= 0 && (
          <StepContainer
            title={`${FUNCTIONS[fnStepIdx].label} Değerlendirmesi`}
            subtitle="Mevcut durumunuzu en doğru yansıtan seçeneği işaretleyin."
            onBack={goBack}
            onNext={goNext}
            canProceed={canProceed}
            stepNumber={3 + fnStepIdx}
            last={fnStepIdx === FUNCTIONS.length - 1}
          >
            <div style={{ backgroundColor: "#0F172A", border: "1px solid #334155", padding: "12px 16px", borderRadius: "10px", fontSize: "12px", color: "#94A3B8", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Info size={16} color="#60A5FA" />
              <span>
                <strong>Resmi Model Hizalaması:</strong> EU DMAT: <em>{FRAMEWORK_ALIGNMENT[step].dmat}</em> · TÜBİTAK DDX: <em>{FRAMEWORK_ALIGNMENT[step].ddx}</em>
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx} style={{ backgroundColor: "#0F172A", padding: "20px", borderRadius: "14px", border: "1px solid #334155" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#FFF", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", fontSize: "12px", fontWeight: "800", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      {qIdx + 1}
                    </span>
                    {q.text}
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[step][qIdx] === oIdx + 1;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setAnswer(step, qIdx, oIdx + 1)}
                          style={{
                            padding: "14px",
                            borderRadius: "10px",
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: isSelected ? "#2563EB" : "#1E293B",
                            color: isSelected ? "#FFF" : "#CBD5E1",
                            border: isSelected ? "1px solid #60A5FA" : "1px solid #334155",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px"
                          }}
                        >
                          <span style={{ fontWeight: "800", fontSize: "11px", opacity: 0.7 }}>{oIdx + 1}.</span>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* OVERALL HEADER */}
            <div className="print-card" style={{ backgroundColor: "#1E293B", padding: "36px", borderRadius: "24px", border: "1px solid #334155", display: "flex", flexWrap: "wrap", alignItems: "center", justifyBetween: "space-between", gap: "24px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#60A5FA", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "800", marginBottom: "12px" }}>
                  <Award size={14} /> DİJİTAL DÖNÜŞÜM KARNESİ
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#FFF", margin: 0 }}>
                  Genel Olgunluk: <span style={{ color: LEVELS[overallLevel].color }}>{LEVELS[overallLevel].label}</span>
                </h2>
                <p style={{ fontSize: "14px", color: "#94A3B8", marginTop: "8px", margin: 0 }}>
                  <strong>{selectedSectorObj?.label}</strong> · <strong>{selectedSizeObj?.label}</strong>
                </p>
              </div>

              <div style={{ backgroundColor: "#0F172A", padding: "20px 28px", borderRadius: "16px", border: "1px solid #334155", textAlign: "center", minWidth: "180px" }}>
                <ScoreGauge score={overallAvg} level={overallLevel} />
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#94A3B8", marginTop: "8px" }}>DİJİTAL SKOR ORTALAMASI</div>
              </div>
            </div>

            {/* DETAILED CARDS */}
            {results.map((r) => {
              const levelObj = LEVELS[r.level];
              return (
                <div key={r.id} className="print-card" style={{ backgroundColor: "#1E293B", borderRadius: "20px", border: "1px solid #334155", padding: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", flexWrap: "wrap", gap: "16px", paddingBottom: "20px", borderBottom: "1px solid #334155" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: "#2563EB", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <r.icon size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#FFF", margin: 0 }}>{r.label}</h3>
                        <span style={{ fontSize: "12px", color: levelObj.color, fontWeight: "700" }}>
                          {levelObj.label} ({r.avg.toFixed(1)} / 4.0)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#0F172A", padding: "16px", borderRadius: "12px", border: "1px solid #334155", margin: "20px 0", fontSize: "13px", color: "#E2E8F0", display: "flex", gap: "10px", alignItems: "center" }}>
                    <Target size={18} color="#60A5FA" />
                    <span>{NEED_STATEMENTS[r.id]}</span>
                  </div>

                  {/* TOOLS */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {TIER_ORDER.map((tierKey) => {
                      const tierInfo = TIER_PRESENTATION[tierKey];
                      const isCurrentLevelTier = r.level === tierKey;
                      const toolsList = TOOLS[r.id][tierKey];

                      return (
                        <div key={tierKey} style={{ backgroundColor: "#0F172A", padding: "16px", borderRadius: "12px", border: isCurrentLevelTier ? "2px solid #F59E0B" : "1px solid #334155" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "#FFF" }}>{tierInfo.heading}</div>
                            {isCurrentLevelTier && (
                              <span style={{ backgroundColor: "#F59E0B", color: "#000", fontSize: "10px", fontWeight: "900", padding: "2px 8px", borderRadius: "4px" }}>
                                MEVCUT SEVİYENİZ
                              </span>
                            )}
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                            {toolsList.map((tool, tIdx) => (
                              <div key={tIdx} style={{ backgroundColor: "#1E293B", padding: "14px", borderRadius: "10px", border: "1px solid #334155" }}>
                                <div style={{ fontSize: "13px", fontWeight: "700", color: "#60A5FA", marginBottom: "4px" }}>{tool.name}</div>
                                <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0, lineHeight: "1.4" }}>{tool.why}</p>
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
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", paddingTop: "16px" }}>
              <button onClick={restart} style={{ backgroundColor: "transparent", color: "#94A3B8", border: "1px solid #334155", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <RotateCcw size={16} /> Yeniden Başlat
              </button>
              <button onClick={() => window.print()} style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "14px 28px", borderRadius: "10px", fontSize: "14px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileDown size={18} /> Raporu Yazdır / Kaydet
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

/* ---------------------------------------------------------
   REUSABLE STEP SHELL
--------------------------------------------------------- */
function StepContainer({ title, subtitle, children, onBack, onNext, canProceed, stepNumber, last }) {
  return (
    <div style={{ backgroundColor: "#1E293B", borderRadius: "24px", border: "1px solid #334155", padding: "36px" }}>
      <div style={{ borderBottom: "1px solid #334155", paddingBottom: "20px", marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", fontWeight: "800", color: "#60A5FA", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>
          AŞAMA {stepNumber} / 6
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#FFF", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px", margin: 0 }}>{subtitle}</p>
      </div>

      <div>{children}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #334155" }} className="no-print">
        <button onClick={onBack} style={{ backgroundColor: "transparent", color: "#94A3B8", border: "1px solid #334155", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={16} /> Geri
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            backgroundColor: canProceed ? "#2563EB" : "#334155",
            color: canProceed ? "#FFF" : "#64748B",
            border: "none",
            padding: "12px 28px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "800",
            cursor: canProceed ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>{last ? "Karnemi Oluştur" : "Devam Et"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
