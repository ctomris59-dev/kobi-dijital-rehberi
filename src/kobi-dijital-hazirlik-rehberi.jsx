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

/* İHTİYAÇ TANIMLARI — önce ürün adı değil, işletmenin ihtiyacı olan sistem
   TÜRÜ söylenir. Örnek uygulamalar bu ihtiyacın altında, ücretsizden ücretliye
   doğru sıralanır. Amaç: "şu ürünü al" değil "bu tür bir sisteme ihtiyacınız
   var, örnekleri şunlar" algısı yaratmak. */
const NEED_STATEMENTS = {
  ik: "İhtiyacınız: başvuru, puantaj ve performans kayıtlarını dağınık kağıt/Excel yerine tek bir dijital sistemde tutmak.",
  pazarlama: "İhtiyacınız: içerik üretimini ve müşteri iletişimini plansız paylaşımlar yerine düzenli, ölçülebilir bir sisteme bağlamak.",
  stok: "İhtiyacınız: stok ve üretim planlamasını gözle/Excel takibi yerine gerçek zamanlı izlenebilir hale getirmek.",
  musteri: "İhtiyacınız: müşteri geçmişini ve talepleri dağınık not/hafıza yerine merkezi bir kayıt sisteminde tutmak.",
};

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

/* KAYNAKÇA — soru/boyut yapımızın ve puanlama mantığımızın dayandığı
   resmi çerçeveler. Her girişte kurum, açıklama ve kaynak adresi var;
   yeni kaynak eklenirse burada listelenmeli. */
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

/* Kaynak alanları: sourceUrl = üreticinin resmi kök alan adı (birincil kaynak).
   "örn." ile başlayan kategori örnekleri (tekil ürün olmayanlar) için sourceUrl
   boş bırakılır — kurul bu satırları somut bir ürüne bağlayıp doğrulamalı.
   verified = son doğrulama ayı/yılı; her çeyreklik incelemede güncellenmeli.
   origin = 'yerli' | 'uluslararası' | 'kategori örneği' — favoritizm algısını
   azaltmak için her seviyede en az 2 seçenek ve mümkün olduğunda karışık köken. */
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
  baslangic: { label: "Başlangıç", color: "#9C4A3C" },
  gelisen: { label: "Gelişen", color: "#C9A227" },
  ileri: { label: "İleri", color: "#4C7A63" },
};

/* Araç listesi sunumunda kullanılan sıra ve başlıklar — her zaman bu sırayla
   gösterilir: önce ücretsiz, sonra temel/gerekli, en son ücretli/kurumsal
   (tavsiye niteliğinde). "level" alanı hem olgunluk hem maliyet kademesini
   temsil ediyor. */
const TIER_PRESENTATION = {
  baslangic: { heading: "Ücretsiz seçenekler", badge: "Ücretsiz" },
  gelisen: { heading: "Temel / gerekli seçenekler", badge: "Temel" },
  ileri: { heading: "Kurumsal seçenekler (tavsiye niteliğinde)", badge: "Ücretli" },
};
const TIER_ORDER = ["baslangic", "gelisen", "ileri"];

function levelFromScore(avg) {
  if (avg < 2) return "baslangic";
  if (avg < 3) return "gelisen";
  return "ileri";
}

/* ---------------------------------------------------------
   GAUGE — imzalık görsel öğe: sanayi göstergesi (dial)
--------------------------------------------------------- */
function Gauge({ score, level, size = 128 }) {
  const angle = -90 + ((score - 1) / 3) * 180;
  const r = size / 2 - 14;
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
  const [nx, ny] = polar(angle, r - 8);
  return (
    <svg width={size} height={size * 0.64} viewBox={`0 0 ${size} ${size * 0.64}`}>
      {zones.map((z, i) => (
        <path key={i} d={arcPath(z.from, z.to, r)} stroke={z.color} strokeWidth="8" fill="none" strokeLinecap="butt" opacity="0.85" />
      ))}
      {[-90, -30, 30, 90].map((a, i) => {
        const [x1, y1] = polar(a, r - 6);
        const [x2, y2] = polar(a, r + 6);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="1" opacity="0.4" />;
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4.5" fill="var(--ink)" />
      <text x={cx} y={cy + 22} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="0.08em" fill="var(--ink)">
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
    <div style={{ background: "var(--paper)", minHeight: "100%", fontFamily: "Inter, sans-serif", color: "var(--ink)" }} className="w-full min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        :root {
          --ink: #1C2B39; --paper: #F3EEE3; --paper-dark: #E4DCC8; --line: #CBC0A3;
          --brass: #A9782E; --brass-light: #D8B463; --seal: #7A3B32; --moss: #55655A; --white: #FFFFFF;
        }
        .disp { font-family: 'Fraunces', serif; font-optical-sizing: auto; letter-spacing: -0.01em; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .eyebrow { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.14em; text-transform: uppercase; }
        .card { background: var(--white); border: 1px solid var(--line); box-shadow: 0 1px 0 rgba(28,43,57,0.03); }
        .btn-primary {
          background: var(--ink); color: var(--white); border: 1px solid var(--ink);
          transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
        }
        .btn-primary:hover:not(:disabled) { background: var(--seal); border-color: var(--seal); transform: translateY(-1px); box-shadow: 0 4px 0 rgba(0,0,0,0.08); }
        .btn-primary:disabled { opacity: 0.32; cursor: not-allowed; }
        .btn-ghost { background: transparent; color: var(--moss); border: 1px solid transparent; transition: all .15s ease; }
        .btn-ghost:hover { color: var(--ink); border-color: var(--line); }
        .opt-btn {
          border: 1px solid var(--line); background: var(--white); transition: all .12s ease;
          text-align: left; display: flex; align-items: flex-start; gap: 0.75rem;
        }
        .opt-btn:hover { border-color: var(--brass); background: #FBF6E9; }
        .opt-btn.selected { border-color: var(--brass); background: #FBF3DC; box-shadow: inset 0 0 0 1px var(--brass); }
        .radio-dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--line); flex-shrink: 0; margin-top: 2px; position: relative; transition: border-color .12s ease; }
        .opt-btn.selected .radio-dot { border-color: var(--brass); }
        .opt-btn.selected .radio-dot::after { content: ''; position: absolute; inset: 3px; border-radius: 50%; background: var(--brass); }
        .stepper-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; border: 1.5px solid var(--line); color: var(--moss); flex-shrink: 0; background: var(--white); }
        .stepper-dot.active { border-color: var(--ink); background: var(--ink); color: var(--white); }
        .stepper-dot.done { border-color: var(--brass); background: var(--brass); color: var(--white); }
        .stepper-line { height: 1.5px; background: var(--line); flex: 1; min-width: 12px; }
        .seal { border: 1.5px solid var(--seal); border-radius: 50%; color: var(--seal); display: flex; align-items: center; justify-content: center; }
        @media print {
          .no-print { display: none !important; }
          body, #root { background: white !important; }
          .card { border: 1px solid #ccc !important; box-shadow: none !important; break-inside: avoid; }
        }
      ` }} />

      <header className="px-6 md:px-12 pt-10 pb-7 border-b" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="seal" style={{ width: 40, height: 40, flexShrink: 0 }}>
            <span className="mono text-xs" style={{ fontWeight: 500 }}>TSO</span>
          </div>
          <div>
            <div className="eyebrow text-xs" style={{ color: "var(--moss)" }}>Çorlu Ticaret ve Sanayi Odası</div>
            <h1 className="disp text-2xl md:text-3xl" style={{ fontWeight: 600 }}>KOBİ Yapay Zeka Hazırlık &amp; Otomasyon Rehberi</h1>
          </div>
        </div>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        {step === "intro" && (
          <div>
            <div className="eyebrow text-xs mb-3" style={{ color: "var(--moss)" }}>Ön Tarama · 6 Adım · ~5 Dakika</div>
            <p className="text-base leading-relaxed mb-3" style={{ maxWidth: "56ch" }}>
              10–16 soruluk kısa bir keşifle işletmenizin İnsan Kaynakları, Pazarlama, Stok/Üretim
              ve Müşteri İlişkileri süreçlerindeki dijital olgunluğunu ölçüyor; her alan için
              somut, düşük maliyetli araç önerisi ve yol haritası çıkarıyoruz.
            </p>
            <div className="card mb-8 p-4 rounded-sm flex gap-3" style={{ borderLeft: "3px solid var(--brass)" }}>
              <span className="mono text-xs shrink-0" style={{ color: "var(--brass)" }}>METODOLOJİ</span>
              <p className="text-xs leading-relaxed" style={{ color: "var(--moss)" }}>
                Soru ve boyut yapımız AB EDIH ağının DMAT çerçevesi, TÜBİTAK TÜSSİDE'nin DDX/D3A
                modeli ve MEXT'in uyguladığı SIRI modeliyle hizalanmıştır. Bu bir ön tarama aracıdır —
                KOSGEB Dijital Dönüşüm Destek Programı başvurusu için yetkilendirilmiş bir
                danışmandan resmi DDX/SIRI raporu alınması gerekir.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {FUNCTIONS.map((f, i) => (
                <div key={f.id} className="card p-4 rounded-sm">
                  <div className="mono text-xs mb-2" style={{ color: "var(--brass)" }}>0{i + 1}</div>
                  <f.icon size={18} color="var(--ink)" className="mb-2" />
                  <div className="text-xs font-medium leading-snug">{f.label}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary disp px-6 py-3 rounded-sm flex items-center gap-2" onClick={goNext}>
              Keşfe Başla <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === "sector" && (
          <StepShell title="Adım 1 · Sektörünüz" onBack={goBack} onNext={goNext} canProceed={canProceed} stepNumber={1} totalSteps={6}>
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-sm card">
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
                style={{ background: sectorGroup === "all" ? "var(--ink)" : "var(--white)", color: sectorGroup === "all" ? "var(--white)" : "var(--ink)", border: "1px solid var(--line)" }}
                onClick={() => setSectorGroup("all")}
              >
                Tümü
              </button>
              {SECTOR_GROUPS.map((g) => (
                <button
                  key={g.id}
                  className="mono text-xs px-3 py-1.5 rounded-sm"
                  style={{ background: sectorGroup === g.id ? "var(--ink)" : "var(--white)", color: sectorGroup === g.id ? "var(--white)" : "var(--ink)", border: "1px solid var(--line)" }}
                  onClick={() => setSectorGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredSectors.map((s) => (
                <button key={s.id} className={`opt-btn p-4 rounded-sm ${sector === s.id ? "selected" : ""}`} onClick={() => setSector(s.id)}>
                  <div className="radio-dot" />
                  <span>
                    <span className="block text-sm font-medium">{s.label}</span>
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
          <StepShell title="Adım 2 · İşletme Ölçeği" onBack={goBack} onNext={goNext} canProceed={canProceed} stepNumber={2} totalSteps={6}>
            <div className="flex flex-col gap-3">
              {SIZES.map((s) => (
                <button key={s.id} className={`opt-btn p-4 rounded-sm ${size === s.id ? "selected" : ""}`} onClick={() => setSize(s.id)}>
                  <div className="radio-dot" />
                  <span>
                    <span className="block disp text-sm">{s.label}</span>
                    <span className="block mono text-xs mt-0.5" style={{ color: "var(--moss)" }}>{s.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {fnStepIdx >= 0 && (
          <StepShell
            title={`Adım ${3 + fnStepIdx} · ${FUNCTIONS[fnStepIdx].label}`}
            onBack={goBack}
            onNext={goNext}
            canProceed={canProceed}
            last={fnStepIdx === FUNCTIONS.length - 1}
            stepNumber={3 + fnStepIdx}
            totalSteps={6}
          >
            <div className="mono text-xs mb-5 px-3 py-2 rounded-sm inline-block" style={{ background: "var(--paper-dark)", color: "var(--moss)" }}>
              Resmi boyut karşılığı — DMAT: {FRAMEWORK_ALIGNMENT[step].dmat} · DDX: {FRAMEWORK_ALIGNMENT[step].ddx} · SIRI: {FRAMEWORK_ALIGNMENT[step].siri}
            </div>
            <div className="flex flex-col gap-8">
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx}>
                  <div className="mb-3 disp text-base" style={{ fontWeight: 600 }}>{q.text}</div>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        className={`opt-btn p-3 rounded-sm text-sm ${answers[step][qIdx] === oIdx + 1 ? "selected" : ""}`}
                        onClick={() => setAnswer(step, qIdx, oIdx + 1)}
                      >
                        <div className="radio-dot" />
                        <span>{opt}</span>
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
            <div className="card p-6 rounded-sm mb-8" style={{ borderLeft: "3px solid var(--seal)" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="eyebrow text-xs mb-2" style={{ color: "var(--seal)" }}>Resmi Ön Tarama Raporu</div>
                  <h2 className="disp text-2xl mb-1">Dijital Hazırlık Karnesi</h2>
                  <p className="text-sm" style={{ color: "var(--moss)" }}>
                    {SECTORS.find((s) => s.id === sector)?.label} · {SIZES.find((s) => s.id === size)?.label}
                  </p>
                  <p className="text-xs mono mt-1" style={{ color: "var(--moss)" }}>
                    Odak noktası: {SECTORS.find((s) => s.id === sector)?.note}
                  </p>
                </div>
                <div className="seal shrink-0" style={{ width: 56, height: 56 }}>
                  <Sparkles size={22} />
                </div>
              </div>
              <div className="mono text-xs mt-4 pt-4 flex flex-wrap gap-x-6 gap-y-1" style={{ borderTop: "1px solid var(--line)", color: "var(--moss)" }}>
                <span>Rapor Tarihi: {METHODOLOGY_LAST_UPDATED}</span>
                <span>Referans: ÇTSO-DHR-{sector?.toUpperCase().slice(0, 3)}-{size?.toUpperCase().slice(0, 3)}</span>
              </div>
            </div>
            {size === "mikro" && (
              <p className="text-xs mono mb-6 p-3 rounded-sm card" style={{ color: "var(--moss)" }}>
                Not: mikro ölçekli işletmeler için önce ücretsiz/düşük maliyetli araçlar önceliklendirildi.
              </p>
            )}

            <div className="flex flex-col gap-8 mt-4">
              {results.map((r) => (
                <div key={r.id} className="card p-5 rounded-sm" style={{ borderLeft: `3px solid ${LEVELS[r.level].color}` }}>
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

                  <div className="mt-4 p-3 rounded-sm text-sm font-medium" style={{ background: "var(--paper)" }}>
                    {NEED_STATEMENTS[r.id]}
                  </div>

                  {TIER_ORDER.map((tierKey) => (
                    <div key={tierKey} className="mt-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="disp text-sm">{TIER_PRESENTATION[tierKey].heading}</span>
                        {r.level === tierKey && (
                          <span className="mono text-xs px-2 py-0.5 rounded-sm" style={{ background: "var(--ink)", color: "var(--white)" }}>
                            Sizin seviyeniz
                          </span>
                        )}
                      </div>
                      <p className="mono text-xs mb-2" style={{ color: "var(--moss)" }}>
                        {tierKey === "ileri" ? "Örnek uygulamalar (tavsiye niteliğinde):" : "Örnek uygulamalar:"}
                      </p>
                      <div className="flex flex-col gap-3">
                        {TOOLS[r.id][tierKey].map((t, i) => (
                          <div key={i} className="p-3 rounded-sm" style={{ background: "var(--paper)", opacity: r.level === tierKey ? 1 : 0.75 }}>
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className="font-medium text-sm">{t.name}</span>
                              <div className="flex items-center gap-1">
                                <span className="mono text-xs px-2 py-0.5 rounded-sm" style={{ background: "var(--paper)", border: "1px solid var(--paper-dark)", color: "var(--moss)" }}>
                                  {t.origin === "yerli" ? "Yerli" : t.origin === "uluslararası" ? "Uluslararası" : "Kategori örneği"}
                                </span>
                                <span className="mono text-xs px-2 py-0.5 rounded-sm" style={{ background: "var(--brass)", color: "var(--ink)" }}>{TIER_PRESENTATION[tierKey].badge}</span>
                              </div>
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
              ))}
            </div>

            <div className="mt-10 card p-6 rounded-sm">
              <h3 className="disp text-lg mb-4">Metodoloji ve Kaynakça</h3>

              <div className="mb-5">
                <div className="disp text-sm mb-1" style={{ color: "var(--moss)" }}>Nasıl puanladık</div>
                <p className="text-sm leading-relaxed">{SCORING_METHOD_TEXT}</p>
              </div>

              <div className="mb-5">
                <div className="disp text-sm mb-2" style={{ color: "var(--moss)" }}>Soru ve boyutlarımızı neye göre hazırladık</div>
                <p className="text-sm leading-relaxed mb-3">
                  Kendi sorularımızı sıfırdan uydurmak yerine, aşağıdaki üç resmi çerçevenin boyutlarını
                  esas aldık ve 4 fonksiyonumuzu (İK, Pazarlama, Stok/Üretim, Müşteri İlişkileri) bu
                  boyutlara haritaladık. Bu sayede sorular, TSO'nun kendi görüşü değil, AB'nin ve
                  Türkiye'nin dijital olgunluk değerlendirmelerinde kullandığı ölçütlerle tutarlı hale geldi.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs mono" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--paper-dark)" }}>
                        <th className="text-left py-2 pr-3">Fonksiyon</th>
                        <th className="text-left py-2 pr-3">DMAT boyutu</th>
                        <th className="text-left py-2 pr-3">DDX/D3A boyutu</th>
                        <th className="text-left py-2 pr-3">SIRI yapı taşı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FUNCTIONS.map((f) => (
                        <tr key={f.id} style={{ borderBottom: "1px solid var(--paper-dark)" }}>
                          <td className="py-2 pr-3">{f.label}</td>
                          <td className="py-2 pr-3">{FRAMEWORK_ALIGNMENT[f.id].dmat}</td>
                          <td className="py-2 pr-3">{FRAMEWORK_ALIGNMENT[f.id].ddx}</td>
                          <td className="py-2 pr-3">{FRAMEWORK_ALIGNMENT[f.id].siri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-5">
                <div className="disp text-sm mb-1" style={{ color: "var(--moss)" }}>Araç önerileri için kaynak disiplini</div>
                <p className="text-sm leading-relaxed">
                  Her önerilen uygulama için üreticinin resmi sitesi birincil kaynak olarak işaretlenir
                  ve son doğrulama tarihi kart üzerinde gösterilir. Somut bir ürüne bağlanmamış kategori
                  örnekleri ayrıca belirtilir. Her maliyet kademesinde en az iki alternatif sunulur ve
                  kökeni (yerli/uluslararası) etiketlenir; Çorlu TSO hiçbir ürünü resmi olarak onaylamaz.
                  Liste 3 ayda bir kurul tarafından gözden geçirilir. Son güncelleme: {METHODOLOGY_LAST_UPDATED}.
                </p>
              </div>

              <div className="mb-5">
                <div className="disp text-sm mb-1" style={{ color: "var(--moss)" }}>Sınırlamalar</div>
                <p className="text-sm leading-relaxed">
                  Bu araç bir <strong>ön tarama</strong>dır. KOSGEB Dijital Dönüşüm Destek Programı
                  başvurusu için TÜBİTAK TÜSSİDE, MEXT veya İHKİB Dijital Dönüşüm Merkezi tarafından
                  yetkilendirilmiş bir danışmandan alınacak resmi DDX veya SIRI raporunun yerine geçmez.
                  Yüksek potansiyel gösteren işletmelere bu resmi rapor için yönlendirme yapılması önerilir.
                </p>
              </div>

              <div>
                <div className="disp text-sm mb-2" style={{ color: "var(--moss)" }}>Kaynakça</div>
                <ul className="text-xs flex flex-col gap-2">
                  {SOURCES.map((s, i) => (
                    <li key={i}>
                      <span className="font-medium">{s.org}</span> — {s.title}. {s.desc}{" "}
                      <span className="mono" style={{ color: "var(--moss)" }}>({s.url})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="btn-primary disp px-5 py-3 rounded-sm mt-6 flex items-center gap-2 no-print" onClick={() => window.print()}>
              <FileDown size={16} /> PDF olarak indir
            </button>
            <button className="btn-ghost disp px-5 py-3 rounded-sm mt-3 flex items-center gap-2 no-print" onClick={restart}>
              <RotateCcw size={16} /> Yeniden Başlat
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function StepShell({ title, children, onBack, onNext, canProceed, last, stepNumber, totalSteps }) {
  return (
    <div>
      {stepNumber && (
        <div className="flex items-center mb-6 no-print">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <React.Fragment key={i}>
              <div className={`stepper-dot ${i + 1 === stepNumber ? "active" : i + 1 < stepNumber ? "done" : ""}`}>
                {i + 1 < stepNumber ? "✓" : i + 1}
              </div>
              {i < totalSteps - 1 && <div className="stepper-line" />}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="eyebrow text-xs mb-3" style={{ color: "var(--moss)" }}>{title}</div>
      {children}
      <div className="flex items-center gap-3 mt-8">
        <button className="btn-ghost px-4 py-2 rounded-sm flex items-center gap-1 text-sm" onClick={onBack}>
          <ArrowLeft size={16} /> Geri
        </button>
        <button className="btn-primary disp px-6 py-3 rounded-sm flex items-center gap-2 ml-auto" onClick={onNext} disabled={!canProceed}>
          {last ? "Karneyi Gör" : "Devam Et"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
