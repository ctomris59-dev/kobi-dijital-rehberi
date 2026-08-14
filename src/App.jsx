import React, { useState, useMemo } from "react";
import {
  Shirt, Wheat, Cog, ShoppingCart, Users, Megaphone, Boxes, Headphones,
  FlaskConical, Car, Hammer, HardHat, Truck, Tractor, UtensilsCrossed,
  Laptop, Stethoscope, GraduationCap, Landmark, Recycle, Search,
  ArrowRight, ArrowLeft, Sparkles, RotateCcw, FileDown,
  Award, ShieldCheck, Info, Target, Bot, Cpu
} from "lucide-react";

/* ---------------------------------------------------------
   VERİ KATMANI — KOBİ YZ & Otomasyon Araç Veritabanı
--------------------------------------------------------- */

const SECTOR_GROUPS = [
  { id: "imalat", label: "İmalat Sanayi" },
  { id: "tarimgida", label: "Tarım & Gıda" },
  { id: "ticaretlojistik", label: "Ticaret & Lojistik" },
  { id: "hizmet", label: "Hizmet Sanayi" },
];

const SECTORS = [
  { id: "tekstil", label: "Tekstil / Konfeksiyon", icon: Shirt, group: "imalat", note: "Sezonluk koleksiyon & stok döngüsü" },
  { id: "metal", label: "Metal / Makine İmalatı", icon: Cog, group: "imalat", note: "Sipariş bazlı üretim ve iş emri" },
  { id: "plastik", label: "Plastik / Kimya Sanayi", icon: FlaskConical, group: "imalat", note: "Reçete & parti (lot) takibi" },
  { id: "otomotiv", label: "Otomotiv Yan Sanayi", icon: Car, group: "imalat", note: "Ana sanayi EDI teslimat takvimi" },
  { id: "mobilya", label: "Mobilya / Ahşap İşleme", icon: Hammer, group: "imalat", note: "Atölye planlama ve özelleştirme" },
  { id: "insaat", label: "İnşaat / Yapı Malzemeleri", icon: HardHat, group: "imalat", note: "Proje & şantiye maliyet takibi" },
  { id: "ambalaj", label: "Ambalaj / Geri Dönüşüm", icon: Recycle, group: "imalat", note: "Fire & sevkiyat optimizasyonu" },
  { id: "gida", label: "Gıda İmalatı ve İşleme", icon: Wheat, group: "tarimgida", note: "Soğuk zincir, SKT & HACCP" },
  { id: "tarim", label: "Tarım / Hayvancılık", icon: Tractor, group: "tarimgida", note: "Mevsimsel rekolte & verim takibi" },
  { id: "ticaret", label: "Ticaret / Toptan-Perakende", icon: ShoppingCart, group: "ticaretlojistik", note: "Çoklu kanal satış & B2B tahsilat" },
  { id: "lojistik", label: "Lojistik / Nakliye", icon: Truck, group: "ticaretlojistik", note: "Filo, navlun & rota takibi" },
  { id: "turizm", label: "Turizm / Konaklama", icon: UtensilsCrossed, group: "hizmet", note: "Rezervasyon & misafir ilişkileri" },
  { id: "bilisim", label: "Bilişim / Yazılım", icon: Laptop, group: "hizmet", note: "Agile proje & ekip verimliliği" },
  { id: "saglik", label: "Sağlık Hizmetleri", icon: Stethoscope, group: "hizmet", note: "Randevu & KVKK medikal veri" },
  { id: "egitim", label: "Eğitim Hizmetleri", icon: GraduationCap, group: "hizmet", note: "Öğrenci otomasyonu & iletişim" },
  { id: "finans", label: "Finans / Sigorta", icon: Landmark, group: "hizmet", note: "Poliçe yenileme & dosya takibi" },
];

const SIZES = [
  { id: "mikro", label: "Mikro İşletme", sub: "1–9 Çalışan", desc: "Hızlı devreye alınan, düşük bütçeli veya ücretsiz YZ & bulut otomasyon araçlarına odaklı." },
  { id: "kucuk", label: "Küçük İşletme", sub: "10–49 Çalışan", desc: "Departmanlar arası veri akışını otomatikleştiren tak-çalıştır YZ yazılımları." },
  { id: "orta", label: "Orta Ölçekli İşletme", sub: "50–249 Çalışan", desc: "Mevcut ERP/CRM altyapılarına entegre olabilen gelişmiş YZ ve analitik platformları." },
];

const FUNCTIONS = [
  { id: "ik", label: "İnsan Kaynakları", icon: Users, desc: "Aday tarama, YZ destekli mülakat, puantaj ve özlük otomasyonu." },
  { id: "pazarlama", label: "Pazarlama & Satış", icon: Megaphone, desc: "Görsel/metin YZ üretimi, otomatik reklam ve müşteri segmentasyonu." },
  { id: "stok", label: "Stok & Üretim", icon: Boxes, desc: "Tahminleme algoritmaları, otomatik yeniden sipariş ve akıllı depo." },
  { id: "musteri", label: "Müşteri İlişkileri", icon: Headphones, desc: "YZ Chatbotlar, sesli asistanlar, talep otomasyonu ve CRM entegrasyonu." },
];

const NEED_STATEMENTS = {
  ik: "Öncelikli YZ Odağı: Başvuru ve CV değerlendirmede metin analiz YZ araçları kullanmak, rutin puantaj ve izin onaylarını otomatikleştirmek.",
  pazarlama: "Öncelikli YZ Odağı: İçerik ve tasarım süreçlerinde üretken YZ (Generative AI) araçlarını devreye alarak pazarlama hunisini otomatikleştirmek.",
  stok: "Öncelikli YZ Odağı: Stok ihtiyaçlarını ve satış tahminlerini yapay zeka modellerine bağlayarak reorder (sipariş) süreçlerini otomatik kılmak.",
  musteri: "Öncelikli YZ Odağı: Müşteri taleplerini 7/24 karşılayan doğal dil işleme (NLP) destekli YZ asistanları ve akıllı CRM kurguları oluşturmak.",
};

const FRAMEWORK_ALIGNMENT = {
  ik: { dmat: "İnsan-Merkezli YZ Uyum", ddx: "Yönetim Otomasyonu", siri: "Organizasyonel Dijitalleşme" },
  pazarlama: { dmat: "Üretken YZ Stratejisi", ddx: "Müşteri Odaklı Otomasyon", siri: "Süreç Verimliliği" },
  stok: { dmat: "Veri Analitiği & Tahminleme", ddx: "Üretim ve Tedarik YZ", siri: "Akıllı Operasyonlar" },
  musteri: { dmat: "Akıllı Müşteri Deneyimi", ddx: "CRM ve YZ Desteği", siri: "Süreç Entegrasyonu" },
};

/* ---------------------------------------------------------
   METODOLOJİ VE KAYNAKÇA — bu rehberin dayandığı akademik ve
   kurumsal çerçeveler. Sorularımızı sıfırdan uydurmuyoruz;
   AB'nin ve Türkiye'nin resmi dijital olgunluk modellerinin
   boyutlarına haritalıyoruz (yukarıdaki FRAMEWORK_ALIGNMENT).
--------------------------------------------------------- */
const METHODOLOGY_LAST_UPDATED = "14 Ağustos 2026";

const SOURCES = [
  {
    org: "Avrupa Komisyonu JRC / EDIH Ağı",
    title: "Digital Maturity Assessment Tool (DMAT)",
    desc: "AB Dijital Avrupa Programı kapsamında Avrupa Dijital İnovasyon Merkezlerinin (EDIH) kullandığı, KOBİ dijital olgunluğunu 6 boyutta (dijital strateji, dijital hazırlık, insan-merkezli dijitalleşme, veri yönetimi, otomasyon & YZ, yeşil dijitalleşme) ölçen resmi AB çerçevesi.",
    url: "european-digital-innovation-hubs.ec.europa.eu/dma-tool",
  },
  {
    org: "TÜBİTAK TÜSSİDE (Boğaziçi Üniversitesi işbirliğiyle)",
    title: "DDX Dijital Dönüşüm Değerlendirme Modeli / D3A",
    desc: "İşletmelerin dijital dönüşüm olgunluğunu 5 boyutta (Kurumsal Yönetim, Müşteri ve Pazar Yönetimi, Ar-Ge ve Ürün Yönetimi, Tedarik Yönetimi, Üretim Yönetimi) değerlendiren, KOSGEB'in resmi olarak tanıdığı ulusal akademik model.",
    url: "ddxmodel.tubitak.gov.tr",
  },
  {
    org: "MEXT Teknoloji Merkezi",
    title: "SIRI — Smart Industry Readiness Index",
    desc: "Singapur Ekonomik Kalkınma Ajansı'nın McKinsey, Siemens, SAP ve TÜV SÜD işbirliğiyle geliştirdiği; Süreç / Teknoloji / Organizasyon olmak üzere 3 yapı taşına dayanan, MEXT tarafından Türkiye'de uygulanan uluslararası ölçüm standardı.",
    url: "mext.org.tr/siri",
  },
  {
    org: "KOSGEB",
    title: "KOBİ Dijital Dönüşüm Destek Programı",
    desc: "Destek başvurusu için DDX veya SIRI formatında resmi dijital olgunluk raporu şartı koşan program. Bu rehber o resmi raporun yerine geçmez; ona hazırlık amaçlı bir ön taramadır.",
    url: "kosgeb.gov.tr",
  },
];

const SCORING_METHOD_TEXT =
  "Her fonksiyon için 3 soru, 4'lü Likert ölçeğinde (1 = tamamen manuel, 4 = YZ destekli tam otomasyon) puanlanır. " +
  "Sorunun ortalaması 2'nin altındaysa Temel Seviye, 2–3 arasıysa Gelişen Seviye, 3 ve üzeriyse İleri Seviye olarak sınıflandırılır. " +
  "Bu eşik değerleri sabittir ve tüm kullanıcılara aynı şekilde uygulanır; sektöre veya ölçeğe göre ağırlıklandırma yapılmaz.";

const TIER_PRESENTATION = {
  baslangic: { heading: "Ücretsiz / başlangıç seçenekleri", badge: "Ücretsiz" },
  gelisen: { heading: "Temel / gerekli seçenekler", badge: "Temel" },
  ileri: { heading: "Kurumsal seçenekler (tavsiye niteliğinde)", badge: "Kurumsal" },
};
const TIER_ORDER = ["baslangic", "gelisen", "ileri"];

const QUESTIONS = {
  ik: [
    { text: "İşe alımda yapay zeka veya otomasyon araçları kullanıyor musunuz?", options: [
      "Hayır, tamamen manuel yürütüyoruz",
      "Kısmen; e-posta ve Excel tabloları aktif",
      "Aday takip yazılımları (ATS) kullanıyoruz",
      "YZ destekli otomatik aday eleme araçları aktif"
    ]},
    { text: "Puantaj, izin ve özlük süreçleriniz otomasyona bağlı mı?", options: [
      "Sözlü veya kağıt imza defteri ile manuel",
      "Excel üzerinde manuel kayıt takibi",
      "Muhasebe/ERP temel puantaj modülü",
      "Bulut tabanlı, mobil onaylı İK yazılımı"
    ]},
    { text: "Personel performans değerlendirme ve hedef takibi nasıl yapılıyor?", options: [
      "Performans takibi yapılmıyor",
      "Yılda bir sözlü veya kağıt üzerinden",
      "Excel KPI şablonları ile periyodik",
      "Dijital OKR/KPI platformu ve YZ analitiği"
    ]}
  ],
  pazarlama: [
    { text: "İçerik/görsel üretiminde Yapay Zeka (ChatGPT, Canva AI vb.) kullanıyor musunuz?", options: [
      "Hayır, yapay zeka kullanılmıyor",
      "Çalışanlar bireysel olarak nadiren deniyor",
      "Düzenli içerik takvimi ve YZ tasarım araçları aktif",
      "Tüm içerik ve reklam kurguları YZ ile yönetiliyor"
    ]},
    { text: "Müşteri iletişim listelerine yönelik otomatik pazarlama kurgularınız var mı?", options: [
      "Toplu iletişim yapılmıyor",
      "Manuel notlar ve telefon rehberi üzerinden",
      "Toplu e-posta / WhatsApp araçları manuel",
      "Müşteri davranışına göre otomatik tetiklenen YZ e-posta/SMS"
    ]},
    { text: "Pazarlama harcamalarınızın dönüşümü (ROI) otomasyonla izleniyor mu?", options: [
      "Ölçüm yapılmıyor",
      "Genel satış rakamlarına göre hissi",
      "Sosyal medya platformlarının temel analitiği",
      "Google/Meta Analytics ve YZ panelleri ile anlık"
    ]}
  ],
  stok: [
    { text: "Stok ihtiyacını tahminlemede yapay zeka/yazılım kullanıyor musunuz?", options: [
      "Gözle kontrol ve tecrübeye dayalı",
      "Manuel Excel kayıtları ile izleniyor",
      "Stok yazılımındaki sabit uyarılara bakılıyor",
      "Gelecek ihtiyacı tahmin eden YZ/ERP algoritmaları aktif"
    ]},
    { text: "Üretim ve sipariş planlamasında dijital otomasyon var mı?", options: [
      "Sipariş geldikçe anlık/plansız",
      "Haftalık kağıt/pano üzeri planlama",
      "Excel bazlı kapasite takip dosyaları",
      "MES/APS veya ERP entegreli otomatik planlama"
    ]},
    { text: "Tedarikçi sipariş süreçleri otomatikleştirilmiş mi?", options: [
      "Sözlü / WhatsApp mesajları ile",
      "Not defteri veya manuel fişlerle",
      "Excel sipariş takip dosyaları ile",
      "Kritik stoğa düşen ürünü ERP otomatik sipariş veriyor"
    ]}
  ],
  musteri: [
    { text: "Müşteri sorularına yanıt veren YZ Chatbot veya Asistanınız var mı?", options: [
      "Tüm sorulara insan çalışanlar manuel yanıt veriyor",
      "Sadece WhatsApp Business otomatik karşılama var",
      "Web sitesinde temel sabit menülü chatbot mevcut",
      "Doğal dil işleyen (NLP) YZ Chatbot 7/24 aktif"
    ]},
    { text: "Müşteri geçmişine ve eski tekliflere ne kadar sürede ulaşıyorsunuz?", options: [
      "Müşteri geçmişi kayıt altına alınmıyor",
      "Fiziki klasör/arşiv taranarak uzun sürede",
      "Excel dosyalarında arama yapılarak",
      "CRM ekranından müşteri profiline tıklayarak anında"
    ]},
    { text: "Mevcut müşterilere tekrar satış için otomasyon kurgularınız var mı?", options: [
      "Sistemsel bir takip yapılmıyor",
      "Hatırlandıkça manuel telefon aramaları",
      "Periyodik olarak manuel toplu duyurular",
      "CRM otomasyonu yaklaşan tarihlerde otomatik teklif çıkarıyor"
    ]}
  ]
};

const TOOLS = {
  ik: {
    baslangic: [
      { name: "ChatGPT / Claude İK Şablonları", why: "İş ilanı, mülakat soruları ve görev tanımlarını YZ ile üretir.", sourceUrl: "openai.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Google Forms + Sheets İK Otomasyonu", why: "Kodsuz formlarla başvuru toplayıp otomatik tablolandırır.", sourceUrl: "workspace.google.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Manatal AI Recruiting", why: "CV'leri yapay zeka ile ayrıştırır, puanlar ve en uygun adayları sıralar.", sourceUrl: "manatal.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Kolay İK Bulut Platformu", why: "İzin, puantaj ve özlük süreçlerini otomatikleştiren KVKK uyumlu yerli yazılım.", sourceUrl: "", verified: "Doğrulanmadı — kurul tekil ürün seçmeli", origin: "yerli" },
    ],
    ileri: [
      { name: "Bordro.io Entegre İK & Vardiya", why: "Bordro, dijital imza ve vardiya süreçlerini otomasyonla birleştirir.", sourceUrl: "bordro.io", verified: "Ağu 2026", origin: "yerli" },
      { name: "SAP SuccessFactors AI Suite", why: "Kurumsal ölçekte YZ destekli yetenek yönetimi ve performans analitiği.", sourceUrl: "sap.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  pazarlama: {
    baslangic: [
      { name: "Canva Magic Studio (YZ Tasarım)", why: "Yapay zeka ile saniyeler içinde sosyal medya görselleri üretir.", sourceUrl: "canva.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "ChatGPT / Gemini Pro Metin Asistanı", why: "Reklam metinleri ve e-posta taslaklarını otomatik hazırlar.", sourceUrl: "gemini.google.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Brevo (Sendinblue) AI Kampanya", why: "En uygun gönderim zamanını YZ ile belirleyen otomatik e-posta platformu.", sourceUrl: "brevo.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Meta & Google AI Ads Manager", why: "Akıllı Kampanyalar ile reklam bütçesini YZ algoritmalarına optimize ettirir.", sourceUrl: "ads.google.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    ileri: [
      { name: "Insider AI Omnichannel", why: "Çoklu kanalda kişiselleştirilmiş YZ pazarlama deneyimi sunan platform.", sourceUrl: "useinsider.com", verified: "Ağu 2026", origin: "yerli" },
      { name: "HubSpot Marketing Hub AI", why: "Inbound pazarlama ve müşteri skorlamayı YZ ile entegre eder.", sourceUrl: "hubspot.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  stok: {
    baslangic: [
      { name: "Excel AI Formülleri & Stok Şablonu", why: "Manuel sayım hatalarını azaltarak temel stok ve sipariş takibi yaptırır.", sourceUrl: "", verified: "N/A — tekil ürün değil", origin: "kategori örneği" },
      { name: "inFlow Inventory Akıllı Mobil", why: "Mobil kamera ile barkod okutarak anlık stok güncellemesi sağlar.", sourceUrl: "inflowinventory.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "Odoo ERP Akıllı Stok & Satın Alma", why: "Stok tükenme sürelerini hesaplayıp otomatik satın alma önerisi çıkarır.", sourceUrl: "odoo.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Mikro Run / Jump Otomasyon", why: "Yerli e-fatura ve mevzuata tam uyumlu stok ve sipariş otomasyonu.", sourceUrl: "mikro.com.tr", verified: "Ağu 2026", origin: "yerli" },
    ],
    ileri: [
      { name: "Logo Tiger 3 Enterprise MRP", why: "Gelişmiş üretim planlama ve tedarik zinciri otomasyonu.", sourceUrl: "logo.com.tr", verified: "Ağu 2026", origin: "yerli" },
      { name: "SAP Business One AI Supply Chain", why: "Tahminleme algoritmalarıyla çalışan depo ve üretim yazılımı.", sourceUrl: "sap.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
  musteri: {
    baslangic: [
      { name: "WhatsApp Business Otomatik Yanıtlar", why: "Müşterilere hazır hızlı yanıtlar ve katalog seçenekleri sunar.", sourceUrl: "business.whatsapp.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Notion AI Müşteri Veritabanı", why: "Müşteri görüşme notlarını YZ ile özetleyen aranabilir pano.", sourceUrl: "notion.so", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    gelisen: [
      { name: "HubSpot Free / Starter CRM", why: "Satış fırsatlarını ve teklif takibini otomatikleştiren CRM.", sourceUrl: "hubspot.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Zoho SalesIQ Akıllı Chatbot", why: "Web sitenize gelen ziyaretçileri karşılayan mesajlaşma botu.", sourceUrl: "zoho.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
    ileri: [
      { name: "Salesforce Einstein AI CRM", why: "Satış kapatma ihtimallerini YZ ile tahmin eden CRM altyapısı.", sourceUrl: "salesforce.com", verified: "Ağu 2026", origin: "uluslararası" },
      { name: "Zoho One Akıllı İş Süiti", why: "40+ entegre uygulama ile tüm müşteri süreçlerini otomatikleştiren platform.", sourceUrl: "zoho.com", verified: "Ağu 2026", origin: "uluslararası" },
    ],
  },
};

const LEVELS = {
  baslangic: { label: "Temel Seviye (Manuel Süreçler)", color: "#EF4444" },
  gelisen: { label: "Gelişen Seviye (Kısmi Otomasyon & YZ)", color: "#F59E0B" },
  ileri: { label: "İleri Seviye (Entegre YZ & Tam Otomasyon)", color: "#10B981" },
};

function levelFromScore(avg) {
  if (avg < 2) return "baslangic";
  if (avg < 3) return "gelisen";
  return "ileri";
}

function ScoreGauge({ score, level }) {
  const percentage = Math.min(Math.max(((score - 1) / 3) * 100, 0), 100);
  const strokeDasharray = 220;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <svg width="150" height="80" viewBox="0 0 150 80">
        <path d="M 15 70 A 60 60 0 0 1 135 70" fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 15 70 A 60 60 0 0 1 135 70"
          fill="none"
          stroke={LEVELS[level].color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      <div style={{ position: "absolute", bottom: "0px", textAlign: "center" }}>
        <span style={{ fontSize: "22px", fontWeight: "800", color: "#0F172A" }}>{score.toFixed(1)}</span>
        <span style={{ fontSize: "11px", color: "#64748B" }}> / 4.0</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN APPLICATION (RESPONSIVE FULL-SCREEN DASHBOARD)
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
      width: "100vw",
      height: "100vh",
      backgroundColor: "#F8FAFC",
      backgroundImage: `
        radial-gradient(circle at 8% 8%, rgba(37,99,235,0.07) 0%, transparent 40%),
        radial-gradient(circle at 95% 15%, rgba(37,99,235,0.05) 0%, transparent 35%),
        radial-gradient(circle at 50% 100%, rgba(37,99,235,0.05) 0%, transparent 45%),
        linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)
      `,
      color: "#0F172A",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      {/* İNCE NOKTA DOKUSU — arka planın düz kalmaması için */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(rgba(15,23,42,0.045) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        pointerEvents: "none",
        zIndex: 0
      }} />
      
      {/* HEADER */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0", height: "64px", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.png"
            alt="Çorlu TSO logosu"
            style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "contain", flexShrink: 0 }}
            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
          />
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "#2563EB", color: "#FFF", fontWeight: "900", fontSize: "18px", display: "none", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            Ç
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: "800", fontSize: "16px", color: "#0F172A" }}>ÇORLU TSO</span>
              <span style={{ backgroundColor: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>
                DİJİTAL DÖNÜŞÜM MERKEZİ
              </span>
            </div>
            <p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>KOBİ Yapay Zeka & Otomasyon Araç Rehberi</p>
          </div>
        </div>

        {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#F1F5F9", padding: "6px 14px", borderRadius: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748B" }}>İlerleme:</span>
            <div style={{ width: "120px", backgroundColor: "#CBD5E1", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#2563EB", height: "100%", width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563EB" }}>%{Math.round((stepIdx / (STEPS.length - 1)) * 100)}</span>
          </div>
        )}

        {step === "results" && (
          <button
            onClick={() => window.print()}
            style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "8px 18px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <FileDown size={14} /> Raporu İndir
          </button>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 32px 60px 32px", boxSizing: "border-box", overflowY: "auto", position: "relative", zIndex: 1 }}>
        
        {/* INTRO SCREEN */}
        {step === "intro" && (
          <div style={{ maxWidth: "960px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", padding: "6px 16px", borderRadius: "20px", color: "#2563EB", fontSize: "13px", fontWeight: "700", margin: "0 auto" }}>
              <Bot size={16} /> YAPAY ZEKA VE OTOMASYON ADAPTASYON REHBERİ
            </div>
            
            <h1 style={{ fontSize: "36px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1.25", color: "#0F172A", margin: 0 }}>
              Süreçleriniz Yapay Zekaya Ne Kadar Hazır?<br />
              <span style={{ color: "#2563EB" }}>İşletme Ölçeğinize Uyumlu YZ Araç Önerileri ve Adaptasyon Rehberi</span>
            </h1>

            <p style={{ fontSize: "15px", color: "#475569", lineHeight: "1.6", margin: 0, maxWidth: "800px", alignSelf: "center" }}>
              5 dakikalık hızlı analizle İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizde yapay zeka potansiyelinizi görün; 
              işletme ölçeğinize en uygun YZ ve otomasyon araç önerilerini anında edinin.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", margin: "12px 0" }}>
              {FUNCTIONS.map((f) => (
                <div key={f.id} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", padding: "18px", borderRadius: "12px", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <f.icon size={22} color="#2563EB" style={{ marginBottom: "8px" }} />
                  <div style={{ fontWeight: "800", fontSize: "14px", color: "#0F172A" }}>{f.label}</div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px", lineHeight: "1.4" }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {/* METODOLOJİ — akademik/uluslararası dayanak */}
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "22px 26px", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#2563EB", fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px", marginBottom: "10px" }}>
                <ShieldCheck size={14} /> METODOLOJİ VE BİLİMSEL DAYANAK
              </div>
              <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", margin: "0 0 14px 0" }}>
                Bu rehberin soru ve puanlama yapısı sıfırdan uydurulmamıştır; Avrupa Birliği'nin ve Türkiye'nin
                resmi dijital olgunluk değerlendirme çerçevelerinin boyutlarına haritalanmıştır. Sonuç bir
                ön taramadır ve KOSGEB başvurusu için gereken resmi DDX/SIRI raporunun yerine geçmez.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {[
                  { k: "DMAT", org: "AB Komisyonu JRC / EDIH Ağı", d: "6 boyutlu resmi AB dijital olgunluk çerçevesi." },
                  { k: "DDX / D3A", org: "TÜBİTAK TÜSSİDE + Boğaziçi Üni.", d: "KOSGEB'in tanıdığı 5 boyutlu ulusal model." },
                  { k: "SIRI", org: "MEXT / Smart Industry Readiness Index", d: "Singapur kökenli, 3 yapı taşlı uluslararası endeks." },
                ].map((m, i) => (
                  <div key={i} style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "800", color: "#2563EB" }}>{m.k}</div>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748B", margin: "2px 0 4px 0" }}>{m.org}</div>
                    <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.4" }}>{m.d}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "12px" }}>
                Kaynakça ve tam metodoloji, testi tamamladığınızda raporun sonunda ayrıntılı olarak yer alır.
              </div>
            </div>

            <button
              onClick={goNext}
              style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "16px 36px", borderRadius: "10px", fontSize: "16px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", margin: "0 auto", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)" }}
            >
              YZ Araç Rehberini Başlat <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 1: SECTOR (FULL EXPANDED RESPONSIVE GRID) */}
        {step === "sector" && (
          <StepContainer title="1 · Sektörünüz" subtitle="İşletmenizin ana faaliyet alanını seçin." onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "#94A3B8" }} />
                  <input
                    type="text"
                    value={sectorQuery}
                    onChange={(e) => setSectorQuery(e.target.value)}
                    placeholder="Sektör ara..."
                    style={{ width: "100%", padding: "10px 14px 10px 42px", backgroundColor: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#0F172A", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => setSectorGroup("all")}
                    style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === "all" ? "#2563EB" : "#E2E8F0", color: sectorGroup === "all" ? "#FFF" : "#475569" }}
                  >
                    Tümü
                  </button>
                  {SECTOR_GROUPS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSectorGroup(g.id)}
                      style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === g.id ? "#2563EB" : "#E2E8F0", color: sectorGroup === g.id ? "#FFF" : "#475569" }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid 4x4 - Fully Stretchable */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: "12px", flex: 1, overflow: "hidden" }}>
                {filteredSectors.slice(0, 16).map((s) => {
                  const isSelected = sector === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSector(s.id)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        textAlign: "left",
                        backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                        border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        boxSizing: "border-box",
                        boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.15)" : "none"
                      }}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: isSelected ? "#2563EB" : "#F1F5F9", color: isSelected ? "#FFF" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <s.icon size={18} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontWeight: "700", fontSize: "13px", color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
                        <div style={{ fontSize: "11px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>{s.note}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </StepContainer>
        )}

        {/* STEP 2: SIZE */}
        {step === "size" && (
          <StepContainer title="2 · İşletme Ölçeği" subtitle="Çalışan sayınıza uygun ölçeği seçin." onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", height: "100%", alignItems: "center" }}>
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    style={{
                      padding: "24px",
                      borderRadius: "14px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "220px",
                      boxSizing: "border-box",
                      boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.12)" : "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "800", backgroundColor: isSelected ? "#2563EB" : "#E2E8F0", color: isSelected ? "#FFF" : "#475569", padding: "4px 10px", borderRadius: "6px", display: "inline-block", marginBottom: "12px" }}>
                        {s.sub}
                      </span>
                      <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", margin: "0 0 8px 0" }}>{s.label}</h4>
                      <p style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.5", margin: 0 }}>{s.desc}</p>
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
            title={`${3 + fnStepIdx} · ${FUNCTIONS[fnStepIdx].label}`}
            subtitle="Mevcut durumunuzu en doğru yansıtan seçeneği işaretleyin."
            onBack={goBack}
            onNext={goNext}
            canProceed={canProceed}
            last={fnStepIdx === FUNCTIONS.length - 1}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", height: "100%", justifyContent: "space-evenly" }}>
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx} style={{ backgroundColor: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#EFF6FF", color: "#2563EB", fontSize: "11px", fontWeight: "800", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      {qIdx + 1}
                    </span>
                    {q.text}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[step][qIdx] === oIdx + 1;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setAnswer(step, qIdx, oIdx + 1)}
                          style={{
                            padding: "10px 12px",
                            borderRadius: "8px",
                            textAlign: "left",
                            fontSize: "11px",
                            backgroundColor: isSelected ? "#2563EB" : "#F8FAFC",
                            color: isSelected ? "#FFF" : "#334155",
                            border: isSelected ? "1px solid #2563EB" : "1px solid #E2E8F0",
                            cursor: "pointer",
                            lineHeight: "1.4",
                            boxShadow: isSelected ? "0 2px 6px rgba(37,99,235,0.2)" : "none"
                          }}
                        >
                          <span style={{ fontWeight: "800", opacity: 0.8 }}>{oIdx + 1}. </span>
                          {opt}
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
          <div style={{ width: "100%", maxWidth: "1300px", display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "20px" }}>

            {/* OVERVIEW BAR */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "16px 24px", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", color: "#2563EB", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", marginBottom: "4px" }}>
                  <Award size={14} /> YZ & OTOMASYON KARNESİ — RESMİ ÖN TARAMA RAPORU
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0F172A", margin: 0 }}>
                  Adaptasyon Seviyesi: <span style={{ color: LEVELS[overallLevel].color }}>{LEVELS[overallLevel].label}</span>
                </h2>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                  {selectedSectorObj?.label} · {selectedSizeObj?.label}
                </div>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "6px", fontFamily: "monospace" }}>
                  Rapor Tarihi: {METHODOLOGY_LAST_UPDATED} · Referans: ÇTSO-YZ-{(sector || "").toUpperCase().slice(0, 3)}-{(size || "").toUpperCase().slice(0, 3)}
                </div>
              </div>

              <ScoreGauge score={overallAvg} level={overallLevel} />
            </div>

            {/* 4 FUNCTION RESULT CARDS — HER BİRİ 3 KADEMELİ ARAÇ LİSTESİ */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
              {results.map((r) => (
                <div key={r.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", borderLeft: `4px solid ${LEVELS[r.level].color}`, padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <r.icon size={18} color="#2563EB" />
                      <span style={{ fontWeight: "800", fontSize: "15px", color: "#0F172A" }}>{r.label}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: LEVELS[r.level].color, backgroundColor: "#F8FAFC", padding: "2px 8px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                      {r.avg.toFixed(1)} / 4.0
                    </span>
                  </div>

                  <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "10px", lineHeight: "1.5" }}>
                    DMAT: {FRAMEWORK_ALIGNMENT[r.id].dmat} · DDX: {FRAMEWORK_ALIGNMENT[r.id].ddx} · SIRI: {FRAMEWORK_ALIGNMENT[r.id].siri}
                  </div>

                  <p style={{ fontSize: "12px", color: "#334155", margin: "0 0 14px 0", lineHeight: "1.5", backgroundColor: "#F8FAFC", padding: "8px 10px", borderRadius: "8px" }}>
                    {NEED_STATEMENTS[r.id]}
                  </p>

                  {TIER_ORDER.map((tierKey) => (
                    <div key={tierKey} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "10px", fontWeight: "800", color: "#475569", letterSpacing: "0.4px" }}>
                          {TIER_PRESENTATION[tierKey].heading.toUpperCase()}
                        </span>
                        {r.level === tierKey && (
                          <span style={{ fontSize: "9px", fontWeight: "800", color: "#FFF", backgroundColor: "#0F172A", padding: "1px 6px", borderRadius: "5px" }}>
                            SİZİN SEVİYENİZ
                          </span>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                        {TOOLS[r.id][tierKey].map((t, idx) => (
                          <div key={idx} style={{ backgroundColor: r.level === tierKey ? "#F8FAFC" : "#FCFCFD", border: "1px solid #E2E8F0", padding: "8px", borderRadius: "8px", opacity: r.level === tierKey ? 1 : 0.8 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px", marginBottom: "2px" }}>
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#2563EB" }}>{t.name}</span>
                              <span style={{ fontSize: "8px", fontWeight: "700", color: "#64748B", backgroundColor: "#EEF2F6", padding: "1px 5px", borderRadius: "4px", whiteSpace: "nowrap" }}>
                                {t.origin === "yerli" ? "Yerli" : t.origin === "uluslararası" ? "Uluslararası" : "Örnek"}
                              </span>
                            </div>
                            <div style={{ fontSize: "9px", color: "#64748B", lineHeight: "1.3", marginBottom: "3px" }}>{t.why}</div>
                            <div style={{ fontSize: "8px", color: t.sourceUrl ? "#94A3B8" : "#EF4444", fontFamily: "monospace" }}>
                              {t.sourceUrl || "belirlenmedi"} · {t.verified}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* METODOLOJİ VE KAYNAKÇA — TAM RAPOR */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "24px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#2563EB", fontSize: "12px", fontWeight: "800", letterSpacing: "0.5px", marginBottom: "14px" }}>
                <ShieldCheck size={15} /> METODOLOJİ VE KAYNAKÇA
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>Nasıl puanladık</div>
                <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", margin: 0 }}>{SCORING_METHOD_TEXT}</p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>Soru ve boyutlarımızı neye göre hazırladık</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <th style={{ textAlign: "left", padding: "6px 10px 6px 0", color: "#64748B" }}>Fonksiyon</th>
                        <th style={{ textAlign: "left", padding: "6px 10px", color: "#64748B" }}>DMAT boyutu</th>
                        <th style={{ textAlign: "left", padding: "6px 10px", color: "#64748B" }}>DDX/D3A boyutu</th>
                        <th style={{ textAlign: "left", padding: "6px 10px", color: "#64748B" }}>SIRI yapı taşı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FUNCTIONS.map((f) => (
                        <tr key={f.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "6px 10px 6px 0", fontWeight: "700", color: "#0F172A" }}>{f.label}</td>
                          <td style={{ padding: "6px 10px", color: "#334155" }}>{FRAMEWORK_ALIGNMENT[f.id].dmat}</td>
                          <td style={{ padding: "6px 10px", color: "#334155" }}>{FRAMEWORK_ALIGNMENT[f.id].ddx}</td>
                          <td style={{ padding: "6px 10px", color: "#334155" }}>{FRAMEWORK_ALIGNMENT[f.id].siri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>Araç önerileri için kaynak disiplini</div>
                <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                  Her önerilen uygulama için üreticinin resmi sitesi birincil kaynak olarak işaretlenir ve son doğrulama tarihi
                  kart üzerinde gösterilir. Somut bir ürüne bağlanmamış kategori örnekleri ayrıca belirtilir. Her maliyet
                  kademesinde en az iki alternatif sunulur ve kökeni (yerli/uluslararası) etiketlenir; Çorlu TSO hiçbir ürünü
                  resmi olarak onaylamaz. Liste 3 ayda bir kurul tarafından gözden geçirilir. Son güncelleme: {METHODOLOGY_LAST_UPDATED}.
                </p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A", marginBottom: "4px" }}>Sınırlamalar</div>
                <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", margin: 0 }}>
                  Bu araç bir <strong>ön tarama</strong>dır. KOSGEB Dijital Dönüşüm Destek Programı başvurusu için TÜBİTAK
                  TÜSSİDE, MEXT veya İHKİB Dijital Dönüşüm Merkezi tarafından yetkilendirilmiş bir danışmandan alınacak resmi
                  DDX veya SIRI raporunun yerine geçmez.
                </p>
              </div>

              <div>
                <div style={{ fontSize: "12px", fontWeight: "800", color: "#0F172A", marginBottom: "8px" }}>Kaynakça</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {SOURCES.map((s, i) => (
                    <div key={i} style={{ fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
                      <span style={{ fontWeight: "700", color: "#0F172A" }}>{s.org}</span> — {s.title}. {s.desc}{" "}
                      <span style={{ fontFamily: "monospace", color: "#94A3B8" }}>({s.url})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={restart} style={{ backgroundColor: "transparent", color: "#64748B", border: "1px solid #CBD5E1", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <RotateCcw size={14} /> Yeniden Başlat
              </button>
              <button onClick={() => window.print()} style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileDown size={16} /> YZ Önerilerini İndir / Yazdır
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

/* REUSABLE CONTAINER (RESPONSIVE EXPANDED VIEWPORT) */
function StepContainer({ title, subtitle, children, onBack, onNext, canProceed, last }) {
  return (
    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px 32px", width: "92vw", maxWidth: "1300px", height: "calc(100vh - 132px)", maxHeight: "820px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)" }}>
      <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "12px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>{subtitle}</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
        <button onClick={onBack} style={{ backgroundColor: "transparent", color: "#64748B", border: "1px solid #CBD5E1", padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={16} /> Geri
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            backgroundColor: canProceed ? "#2563EB" : "#94A3B8",
            color: "#FFF",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "800",
            cursor: canProceed ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>{last ? "Önerileri Gör" : "Devam Et"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
