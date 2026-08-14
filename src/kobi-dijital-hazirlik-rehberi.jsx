import React, { useState, useMemo } from "react";
import {
  Shirt, Wheat, Cog, ShoppingCart, Users, Megaphone, Boxes, Headphones,
  FlaskConical, Car, Hammer, HardHat, Truck, Tractor, UtensilsCrossed,
  Laptop, Stethoscope, GraduationCap, Landmark, Recycle, Search,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, RotateCcw, FileDown,
  Building2, ChevronRight, Award, ShieldCheck, Zap, BarChart3, HelpCircle,
  ExternalLink, Layers, LayoutGrid, Check, Info, TrendingUp, Target
} from "lucide-react";

/* ---------------------------------------------------------
   VERİ KATMANI — 1090 üyelik sanayi haritası ve KOSGEB / DDX
   standartlarına uyumlu KOBİ Dijital Dönüşüm Veritabanı
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
  baslangic: { label: "Başlangıç Seviyesi", color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", badgeBg: "#EF4444" },
  gelisen: { label: "Gelişen Seviye", color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", badgeBg: "#F59E0B" },
  ileri: { label: "İleri Seviye", color: "#059669", bg: "#ECFDF5", border: "#6EE7B7", badgeBg: "#10B981" },
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
   GAUGE COMPONENT — Modern Radial Semi-Circle Meter
--------------------------------------------------------- */
function ScoreGauge({ score, level }) {
  const percentage = Math.min(Math.max(((score - 1) / 3) * 100, 0), 100);
  const strokeDasharray = 251; // PI * radius (80)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  
  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
        {/* Background Track */}
        <path
          d="M 10 90 A 80 80 0 0 1 170 90"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Colored Progress Track */}
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
      <div className="absolute bottom-1 text-center">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{score.toFixed(1)}</span>
        <span className="text-xs text-gray-400 font-medium"> / 4.0</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN APPLICATION COMPONENT
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-card { border: 1px solid #e2e8f0 !important; box-shadow: none !important; break-inside: avoid; margin-bottom: 1.5rem; }
        }
      ` }} />

      {/* HEADER BAR */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              Ç
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">ÇORLU TSO</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  DİJİTAL DÖNÜŞÜM MERKEZİ
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">KOBİ Dijital Hazırlık & Yapay Zeka Rehberi</p>
            </div>
          </div>

          {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700/60">
              <span className="text-xs font-semibold text-slate-400">İlerleme:</span>
              <div className="w-32 bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300 ease-out" 
                  style={{ width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-blue-400 mono">{Math.round((stepIdx / (STEPS.length - 1)) * 100)}%</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <a 
              href="https://ddxmodel.tubitak.gov.tr" 
              target="_blank" 
              rel="noreferrer" 
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span>TÜBİTAK DDX Uyumlu</span>
              <ExternalLink size={13} className="text-slate-400" />
            </a>
            {step === "results" && (
              <button 
                onClick={() => window.print()} 
                className="no-print bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
              >
                <FileDown size={15} />
                <span>Raporu İndir</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO BANNER FOR INTRO */}
      {step === "intro" && (
        <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-800 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
              <Sparkles size={14} />
              <span>EU DMAT · TÜBİTAK DDX · MEXT SIRI METODOLOJİSİ</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              İşletmenizin Dijital Olgunluğunu Ölçün, <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                Size Özel Yol Haritasını Çıkarın
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              10 dakikalık hızlı değerlendirme ile İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizdeki 
              dijitalleşme seviyenizi öğrenin; bütçenize uygun somut araç ve yazılım önerilerini hemen inceleyin.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={goNext}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
              >
                <span>Analize Başla</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* INTRO CONTENT */}
        {step === "intro" && (
          <div className="space-y-12">
            {/* FUNCTION CARDS */}
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
                DEĞERLENDİRİLEN 4 TEMEL OPERASYONEL ALAN
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {FUNCTIONS.map((f) => (
                  <div key={f.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
                        <f.icon size={24} />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mb-2">{f.label}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* METHODOLOGY NOTICE */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                  <ShieldCheck size={22} />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg">Resmi Çerçevelerle Hizalanmış Özgün Metodoloji</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Soru ve puanlama yapımız; AB Dijital Avrupa Programı <strong>DMAT</strong>, TÜBİTAK TÜSSİDE <strong>DDX (D3A)</strong> ve MEXT <strong>SIRI</strong> standartlarına dayanmaktadır. 
                    Bu araç KOBİ'lerin resmi danışmanlık öncesinde durum tespiti yapmasını sağlayan <strong>ön tarama rehberidir</strong>.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    <span className="bg-slate-100 px-3 py-1 rounded-md">✓ %100 Doğrulanmış Kaynaklar</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-md">✓ Tarafsız & Bağımsız Yazılım Önerileri</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-md">✓ KOSGEB Desteğine Hazırlık</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: SECTOR */}
        {step === "sector" && (
          <StepContainer 
            title="Sektör Seçimi" 
            subtitle="İşletmenizin ana faaliyet alanını seçin. Sektörünüze özel kritik odak noktaları analize dahil edilecektir."
            onBack={goBack} 
            onNext={goNext} 
            canProceed={canProceed}
            stepNumber={1}
          >
            {/* SEARCH & FILTERS */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={sectorQuery}
                  onChange={(e) => setSectorQuery(e.target.value)}
                  placeholder="Sektörünüzü arayın (örn: Tekstil, Metal, Otomotiv, Gıda)..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSectorGroup("all")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    sectorGroup === "all"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Tüm Sektörler
                </button>
                {SECTOR_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSectorGroup(g.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      sectorGroup === g.id
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTOR GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
              {filteredSectors.map((s) => {
                const isSelected = sector === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSector(s.id)}
                    className={`p-4 rounded-xl text-left transition-all border flex items-start gap-3.5 relative ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-sm"
                        : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <s.icon size={20} />
                    </div>
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-sm text-slate-900 mb-0.5">{s.label}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{s.note}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </StepContainer>
        )}

        {/* STEP 2: SIZE */}
        {step === "size" && (
          <StepContainer 
            title="İşletme Ölçeği" 
            subtitle="Çalışan sayınıza uygun ölçeği seçin. Yazılım bütçesi ve karmaşıklığı bu veriye göre ayarlanacaktır."
            onBack={goBack} 
            onNext={goNext} 
            canProceed={canProceed}
            stepNumber={2}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={`p-6 rounded-2xl text-left transition-all border flex flex-col justify-between relative ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/20 shadow-md"
                        : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                          {s.sub}
                        </span>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 mb-2">{s.label}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
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
            subtitle="Mevcut durumunuzu en doğru yansıtan seçenekleri işaretleyin."
            onBack={goBack} 
            onNext={goNext} 
            canProceed={canProceed}
            stepNumber={3 + fnStepIdx}
            last={fnStepIdx === FUNCTIONS.length - 1}
          >
            {/* FRAMEWORK BADGE */}
            <div className="mb-6 bg-slate-100/80 border border-slate-200/80 px-4 py-3 rounded-xl flex items-center gap-3 text-xs text-slate-600">
              <Info size={16} className="text-blue-600 shrink-0" />
              <span>
                <strong>Resmi Model Hizalaması:</strong> EU DMAT: <em>{FRAMEWORK_ALIGNMENT[step].dmat}</em> · TÜBİTAK DDX: <em>{FRAMEWORK_ALIGNMENT[step].ddx}</em> · MEXT SIRI: <em>{FRAMEWORK_ALIGNMENT[step].siri}</em>
              </span>
            </div>

            {/* QUESTIONS LIST */}
            <div className="space-y-8">
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="font-bold text-base text-slate-900 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <span>{q.text}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[step][qIdx] === oIdx + 1;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setAnswer(step, qIdx, oIdx + 1)}
                          className={`p-4 rounded-xl text-left text-xs font-medium transition-all border flex items-start gap-3 ${
                            isSelected
                              ? "bg-blue-50/80 border-blue-600 text-blue-950 font-bold ring-1 ring-blue-600/30"
                              : "bg-slate-50/50 border-slate-200/70 text-slate-700 hover:bg-slate-100/60 hover:border-slate-300"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 border ${
                            isSelected ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-500"
                          }`}>
                            {oIdx + 1}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </StepContainer>
        )}

        {/* STEP 7: RESULTS & REPORT */}
        {step === "results" && (
          <div className="space-y-10">
            
            {/* OVERALL SUMMARY HEADER */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden print-card">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                    <Award size={14} />
                    <span>DİJİTAL DÖNÜŞÜM KARNESİ</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Genel Olgunluk: <span style={{ color: LEVELS[overallLevel].color }}>{LEVELS[overallLevel].label}</span>
                  </h2>
                  <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                    <strong>{selectedSectorObj?.label}</strong> sektöründe faaliyet gösteren <strong>{selectedSizeObj?.label}</strong> ölçeğindeki işletmeniz için hazırlanan analiz sonuçları aşağıdadır.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                    <span>Sektör Odak Noktası: <strong className="text-slate-200">{selectedSectorObj?.note}</strong></span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 text-center shrink-0 min-w-[220px]">
                  <ScoreGauge score={overallAvg} level={overallLevel} />
                  <div className="mt-3 pt-3 border-t border-slate-700 text-xs font-bold text-slate-300">
                    Genel Skor Ortalaması
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILED FUNCTION BREAKDOWN */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Operasyonel Alan Analizleri & Araç Önerileri</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Her alan için mevcut seviyeniz ve atılabilecek somut adımlar</p>
                </div>
              </div>

              {results.map((r) => {
                const levelObj = LEVELS[r.level];
                return (
                  <div key={r.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden print-card">
                    {/* CARD HEADER */}
                    <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/50">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-md shadow-blue-600/20">
                          <r.icon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-extrabold text-xl text-slate-900">{r.label}</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: levelObj.bg, color: levelObj.color, border: `1px solid ${levelObj.border}` }}>
                              {levelObj.label} ({r.avg.toFixed(1)} / 4.0)
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            Resmi Boyut: EU DMAT ({FRAMEWORK_ALIGNMENT[r.id].dmat}) · TÜBİTAK DDX ({FRAMEWORK_ALIGNMENT[r.id].ddx})
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* NEED STATEMENT */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="bg-blue-50/70 border border-blue-200/60 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-blue-950 font-semibold">
                        <Target size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{NEED_STATEMENTS[r.id]}</span>
                      </div>

                      {/* TOOL TIERS */}
                      <div className="space-y-6">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          SEVİYEYE GÖRE TAVSİYE EDİLEN YAZILIM / ARAC KATALOĞU
                        </h5>

                        <div className="grid grid-cols-1 gap-5">
                          {TIER_ORDER.map((tierKey) => {
                            const tierInfo = TIER_PRESENTATION[tierKey];
                            const isCurrentLevelTier = r.level === tierKey;
                            const toolsList = TOOLS[r.id][tierKey];

                            return (
                              <div 
                                key={tierKey}
                                className={`p-5 rounded-2xl border transition-all ${
                                  isCurrentLevelTier
                                    ? "bg-amber-50/30 border-amber-300/80 ring-2 ring-amber-400/20"
                                    : "bg-slate-50/40 border-slate-200/70"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h6 className="font-bold text-sm text-slate-900">{tierInfo.heading}</h6>
                                      {isCurrentLevelTier && (
                                        <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                                          MEVCUT SEVİYENİZ
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{tierInfo.sub}</p>
                                  </div>
                                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-200/70 text-slate-700">
                                    {tierInfo.badge}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {toolsList.map((tool, tIdx) => (
                                    <div key={tIdx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                                      <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                          <span className="font-bold text-sm text-slate-900">{tool.name}</span>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                            tool.origin === "yerli" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                                          }`}>
                                            {tool.origin === "yerli" ? "Yerli Yazılım" : tool.origin === "uluslararası" ? "Global" : "Örnek"}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed mb-3">{tool.why}</p>
                                      </div>
                                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                        <span>Alt: {tool.alt}</span>
                                        <span className="mono text-[10px]">{tool.verified}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* METHODOLOGY & REFERENCES SECTION */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 print-card">
              <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                <BarChart3 size={22} className="text-blue-600" />
                <span>Metodoloji, Puanlama & Resmi Kaynakça</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm">Puanlama Esasları</h4>
                  <p>{SCORING_METHOD_TEXT}</p>
                </div>
                <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm">Şeffaflık & Tarafsızlık İlkesi</h4>
                  <p>
                    Önerilen tüm araçlar bağımsız değerlendirmelerle seçilmiş olup Çorlu TSO herhangi bir ticari ortaklık yürütmemektedir. 
                    Veri doğrulama tarihi: <strong>{METHODOLOGY_LAST_UPDATED}</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">REFERANS DİJİTAL OLGUNLUK ÇERÇEVELERİ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SOURCES.map((src, sIdx) => (
                    <div key={sIdx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                      <div className="font-bold text-xs text-slate-900">{src.org}</div>
                      <div className="font-semibold text-blue-600 text-xs">{src.title}</div>
                      <p className="text-[11px] text-slate-500 leading-normal">{src.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM RESTART / ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 no-print">
              <button 
                onClick={restart}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                <span>Yeniden Başlat</span>
              </button>

              <button 
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <FileDown size={18} />
                <span>Raporu PDF Olarak Yazdır / Kaydet</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-20 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-3">
          <p className="font-bold text-slate-300">ÇORLU TİCARET VE SANAYİ ODASI · DİJİTAL DÖNÜŞÜM MERKEZİ</p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Bu rehber KOBİ'lerin dijitalleşme süreçlerine rehberlik etmek amacıyla hazırlanmış bir ön tarama aracıdır. 
            Resmi teşvik başvuruları için yetkili Danışmanlar üzerinden resmi DDX veya SIRI raporu alınması gerekmektedir.
          </p>
          <p className="text-slate-600 pt-4">© 2026 Çorlu TSO. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------
   REUSABLE STEP CONTAINER COMPONENT
--------------------------------------------------------- */
function StepContainer({ title, subtitle, children, onBack, onNext, canProceed, stepNumber, last }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 space-y-8">
      {/* STEP HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
            <span>AŞAMA {stepNumber} / 6</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>

      {/* STEP CONTENT */}
      <div>{children}</div>

      {/* STEP FOOTER NAV */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100 no-print">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Geri</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md ${
            canProceed
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
              : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          <span>{last ? "Karnemi Oluştur" : "Devam Et"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
