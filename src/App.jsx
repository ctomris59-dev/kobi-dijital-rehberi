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

const QUESTIONS = {
  ik: [
    { text: "İşe alımda yapay zeka veya otomasyon araçları kullanıyor musunuz?", options: [
      "Hayır, tamamen manuel ve kağıt/sözlü takip ediyoruz",
      "Kısmen; e-posta ve Excel tabloları aktif",
      "Aday takip yazılımları (ATS) ve iş ilan siteleri kullanıyoruz",
      "YZ destekli otomatik CV tarama ve aday eleme araçları aktif"
    ]},
    { text: "Puantaj, izin ve özlük süreçleriniz otomasyona bağlı mı?", options: [
      "Sözlü onay veya kağıt imza defteri ile manuel yürütülüyor",
      "Excel üzerinde manuel kayıt takibi yapılıyor",
      "Muhasebe / ERP programının temel puantaj modülü aktif",
      "Bulut tabanlı, mobil onaylı özel İK ve izin yazılımı kullanılıyor"
    ]},
    { text: "Personel performans değerlendirme ve hedef takibi nasıl yapılıyor?", options: [
      "Performans takibi yapılmıyor",
      "Yılda bir kez sözlü veya kağıt üzerinden yapılıyor",
      "Excel KPI şablonları ile periyodik kontrol ediliyor",
      "Dijital OKR / KPI platformu ve YZ analitik raporları kullanılıyor"
    ]}
  ],
  pazarlama: [
    { text: "İçerik ve görsel üretiminde Yapay Zeka (ChatGPT, Canva AI vb.) kullanıyor musunuz?", options: [
      "Hayır, yapay zeka araçları hiç kullanılmıyor",
      "Çalışanlar bireysel olarak nadiren metin yazımı için deniyor",
      "Düzenli içerik takvimi ve YZ tasarım araçları aktif",
      "Tüm içerik, görsel ve reklam kurguları YZ araçlarıyla yönetiliyor"
    ]},
    { text: "Müşteri iletişim listelerine yönelik otomatik pazarlama kurgularınız var mı?", options: [
      "Toplu müşteri iletişimi ve duyurusu yapılmıyor",
      "Manuel notlar veya telefon rehberi üzerinden tek tek yapılıyor",
      "Toplu e-posta / WhatsApp araçlarıyla manuel gönderiliyor",
      "Müşteri davranışına göre otomatik tetiklenen YZ e-posta/SMS kurguları aktif"
    ]},
    { text: "Pazarlama harcamalarınızın dönüşümü (ROI) otomasyonla izleniyor mu?", options: [
      "Herhangi bir dönüşüm ölçümü yapılmıyor",
      "Genel satış rakamlarına göre tahmini yorumlanıyor",
      "Sosyal medya platformlarının kendi temel analitiği inceleniyor",
      "Google/Meta Analytics ve YZ panelleri ile anlık dönüşüm izleniyor"
    ]}
  ],
  stok: [
    { text: "Stok ihtiyacını tahminlemede yapay zeka veya yazılım kullanıyor musunuz?", options: [
      "Gözle kontrol ve geçmiş tecrübeye dayalı tahmin yapılıyor",
      "Manuel Excel kayıtları ve sayım defterleriyle izleniyor",
      "Stok yazılımındaki sabit kritik stok uyarısına bakılıyor",
      "Gelecek ihtiyacı tahmin eden YZ / ERP algoritmaları aktif"
    ]},
    { text: "Üretim ve sipariş planlamasında dijital otomasyon var mı?", options: [
      "Sipariş geldikçe anlık ve plansız müdahale ediliyor",
      "Haftalık kağıt / pano üzeri üretim planlaması yapılıyor",
      "Excel bazlı kapasite ve üretim takip dosyaları kullanılıyor",
      "MES / APS veya ERP entegreli otomatik üretim planlama aktif"
    ]},
    { text: "Tedarikçi sipariş süreçleri otomatikleştirilmiş mi?", options: [
      "Sözlü iletişim veya WhatsApp mesajları ile sipariş veriliyor",
      "Not defteri veya manuel satın alma fişleri kullanılıyor",
      "Excel sipariş takip dosyaları ile kontrol ediliyor",
      "Kritik stoğa düşen ürünü ERP sistemi otomatik sipariş geçiyor"
    ]}
  ],
  musteri: [
    { text: "Müşteri sorularına yanıt veren YZ Chatbot veya Asistanınız var mı?", options: [
      "Tüm sorulara insan çalışanlarımız manuel yanıt veriyor",
      "Sadece WhatsApp Business otomatik karşılama mesajı var",
      "Web sitesinde temel sabit menülü (kural tabanlı) chatbot mevcut",
      "Doğal dil işleyen (NLP) YZ Chatbot 7/24 müşteri yanıtlıyor"
    ]},
    { text: "Müşteri geçmişine ve eski tekliflere ne kadar sürede ulaşıyorsunuz?", options: [
      "Müşteri geçmişi ve iletişim detayları kayıt altına alınmıyor",
      "Fiziki klasör veya arşiv faturaları taranarak uzun sürede",
      "Excel arşiv dosyalarında arama yapılarak ulaşılıyor",
      "CRM ekranından müşteri profiline tıklanarak anında görüntüleniyor"
    ]},
    { text: "Mevcut müşterilere tekrar satış için otomasyon kurgularınız var mı?", options: [
      "Tekrar satış için sistemsel bir takip yapılmıyor",
      "Hatırlandıkça manuel telefon aramaları yapılıyor",
      "Periyodik olarak manuel toplu bilgilendirme mesajları gönderiliyor",
      "CRM otomasyonu yaklaşan tarihlerde otomatik teklif ve hatırlatma çıkarıyor"
    ]}
  ]
};

const TOOLS = {
  ik: {
    baslangic: [
      { name: "ChatGPT / Claude İK Şablonları", why: "İş ilanı, mülakat soruları ve görev tanımlarını YZ ile üretir." },
      { name: "Google Forms + Sheets İK Otomasyonu", why: "Kodsuz formlarla başvuru toplayıp otomatik tablolandırır." },
    ],
    gelisen: [
      { name: "Manatal AI Recruiting", why: "CV'leri yapay zeka ile ayrıştırır, puanlar ve en uygun adayları sıralar." },
      { name: "Kolay İK Bulut Platformu", why: "İzin, puantaj ve özlük süreçlerini otomatikleştiren KVKK uyumlu yerli yazılım." },
    ],
    ileri: [
      { name: "Bordro.io Entegre İK & Vardiya", why: "Bordro, dijital imza ve vardiya süreçlerini otomasyonla birleştirir." },
      { name: "SAP SuccessFactors AI Suite", why: "Kurumsal ölçekte YZ destekli yetenek yönetimi ve performans analitiği." },
    ],
  },
  pazarlama: {
    baslangic: [
      { name: "Canva Magic Studio (YZ Tasarım)", why: "Yapay zeka ile saniyeler içinde sosyal medya görselleri üretir." },
      { name: "ChatGPT / Gemini Pro Metin Asistanı", why: "Reklam metinleri ve e-posta taslaklarını otomatik hazırlar." },
    ],
    gelisen: [
      { name: "Brevo (Sendinblue) AI Kampanya", why: "En uygun gönderim zamanını YZ ile belirleyen otomatik e-posta platformu." },
      { name: "Meta & Google AI Ads Manager", why: "Akıllı Kampanyalar ile reklam bütçesini YZ algoritmalarına optimize ettirir." },
    ],
    ileri: [
      { name: "Insider AI Omnichannel", why: "Çoklu kanalda kişiselleştirilmiş YZ pazarlama deneyimi sunan platform." },
      { name: "HubSpot Marketing Hub AI", why: "Inbound pazarlama ve müşteri skorlamayı YZ ile entegre eder." },
    ],
  },
  stok: {
    baslangic: [
      { name: "Excel AI Formülleri & Stok Şablonu", why: "Manuel sayım hatalarını azaltarak temel stok ve sipariş takibi yaptırır." },
      { name: "inFlow Inventory Akıllı Mobil", why: "Mobil kamera ile barkod okutarak anlık stok güncellemesi sağlar." },
    ],
    gelisen: [
      { name: "Odoo ERP Akıllı Stok & Satın Alma", why: "Stok tükenme sürelerini hesaplayıp otomatik satın alma önerisi çıkarır." },
      { name: "Mikro Run / Jump Otomasyon", why: "Yerli e-fatura ve mevzuata tam uyumlu stok ve sipariş otomasyonu." },
    ],
    ileri: [
      { name: "Logo Tiger 3 Enterprise MRP", why: "Gelişmiş üretim planlama ve tedarik zinciri otomasyonu." },
      { name: "SAP Business One AI Supply Chain", why: "Tahminleme algoritmalarıyla çalışan depo ve üretim yazılımı." },
    ],
  },
  musteri: {
    baslangic: [
      { name: "WhatsApp Business Otomatik Yanıtlar", why: "Müşterilere hazır hızlı yanıtlar ve katalog seçenekleri sunar." },
      { name: "Notion AI Müşteri Veritabanı", why: "Müşteri görüşme notlarını YZ ile özetleyen aranabilir pano." },
    ],
    gelisen: [
      { name: "HubSpot Free / Starter CRM", why: "Satış fırsatlarını ve teklif takibini otomatikleştiren CRM." },
      { name: "Zoho SalesIQ Akıllı Chatbot", why: "Web sitenize gelen ziyaretçileri karşılayan mesajlaşma botu." },
    ],
    ileri: [
      { name: "Salesforce Einstein AI CRM", why: "Satış kapatma ihtimallerini YZ ile tahmin eden CRM altyapısı." },
      { name: "Zoho One Akıllı İş Süiti", why: "40+ entegre uygulama ile tüm müşteri süreçlerini otomatikleştiren platform." },
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
      <svg width="160" height="85" viewBox="0 0 160 85">
        <path d="M 15 75 A 65 65 0 0 1 145 75" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M 15 75 A 65 65 0 0 1 145 75"
          fill="none"
          stroke={LEVELS[level].color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      <div style={{ position: "absolute", bottom: "0px", textAlign: "center" }}>
        <span style={{ fontSize: "26px", fontWeight: "900", color: "#0F172A" }}>{score.toFixed(1)}</span>
        <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "700" }}> / 4.0</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN APPLICATION (ACCESSIBLE HIGH-CONTRAST LAYOUT)
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
      color: "#0F172A",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0", height: "70px", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#2563EB", color: "#FFF", fontWeight: "900", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Ç
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: "900", fontSize: "18px", color: "#0F172A" }}>ÇORLU TSO</span>
              <span style={{ backgroundColor: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "800" }}>
                DİJİTAL DÖNÜŞÜM MERKEZİ
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#64748B", margin: 0, fontWeight: "600" }}>KOBİ Yapay Zeka & Otomasyon Araç Rehberi</p>
          </div>
        </div>

        {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#F1F5F9", padding: "8px 16px", borderRadius: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#64748B" }}>İlerleme:</span>
            <div style={{ width: "140px", backgroundColor: "#CBD5E1", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#2563EB", height: "100%", width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <span style={{ fontSize: "14px", fontWeight: "900", color: "#2563EB" }}>%{Math.round((stepIdx / (STEPS.length - 1)) * 100)}</span>
          </div>
        )}

        {step === "results" && (
          <button
            onClick={() => window.print()}
            style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "800", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FileDown size={18} /> Raporu İndir / Yazdır
          </button>
        )}
      </header>

      {/* MAIN BODY AREA */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 32px", boxSizing: "border-box", overflow: "hidden" }}>
        
        {/* INTRO SCREEN */}
        {step === "intro" && (
          <div style={{ maxWidth: "1000px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", padding: "8px 20px", borderRadius: "30px", color: "#2563EB", fontSize: "14px", fontWeight: "800", margin: "0 auto" }}>
              <Bot size={18} /> YAPAY ZEKA VE OTOMASYON ADAPTASYON REHBERİ
            </div>
            
            <h1 style={{ fontSize: "40px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1.25", color: "#0F172A", margin: 0 }}>
              Süreçleriniz Yapay Zekaya Ne Kadar Hazır?<br />
              <span style={{ color: "#2563EB" }}>İşletme Ölçeğinize Uyumlu YZ Araç Önerileri ve Adaptasyon Rehberi</span>
            </h1>

            <p style={{ fontSize: "17px", color: "#475569", lineHeight: "1.6", margin: 0, maxWidth: "850px", alignSelf: "center", fontWeight: "500" }}>
              5 dakikalık hızlı analizle İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizde yapay zeka potansiyelinizi görün; 
              işletme ölçeğinize en uygun YZ ve otomasyon araç önerilerini anında edinin.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", margin: "12px 0" }}>
              {FUNCTIONS.map((f) => (
                <div key={f.id} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", padding: "20px", borderRadius: "14px", textAlign: "left", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                  <f.icon size={26} color="#2563EB" style={{ marginBottom: "10px" }} />
                  <div style={{ fontWeight: "800", fontSize: "16px", color: "#0F172A" }}>{f.label}</div>
                  <div style={{ fontSize: "13px", color: "#64748B", marginTop: "6px", lineHeight: "1.4" }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <button
              onClick={goNext}
              style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "18px 42px", borderRadius: "12px", fontSize: "18px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px", margin: "0 auto", boxShadow: "0 6px 18px rgba(37, 99, 235, 0.3)" }}
            >
              YZ Araç Rehberini Başlat <ArrowRight size={22} />
            </button>
          </div>
        )}

        {/* STEP 1: SECTOR */}
        {step === "sector" && (
          <StepContainer title="1 · Sektörünüz" subtitle="İşletmenizin ana faaliyet alanını seçin." onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", height: "100%" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={20} style={{ position: "absolute", left: "16px", top: "14px", color: "#94A3B8" }} />
                  <input
                    type="text"
                    value={sectorQuery}
                    onChange={(e) => setSectorQuery(e.target.value)}
                    placeholder="Sektörünüzü arayın (Tekstil, Metal, Gıda vb.)..."
                    style={{ width: "100%", padding: "12px 16px 12px 48px", backgroundColor: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "10px", color: "#0F172A", fontSize: "15px", fontWeight: "600", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setSectorGroup("all")}
                    style={{ padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "800", border: "none", cursor: "pointer", backgroundColor: sectorGroup === "all" ? "#2563EB" : "#E2E8F0", color: sectorGroup === "all" ? "#FFF" : "#475569" }}
                  >
                    Tümü
                  </button>
                  {SECTOR_GROUPS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSectorGroup(g.id)}
                      style={{ padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "800", border: "none", cursor: "pointer", backgroundColor: sectorGroup === g.id ? "#2563EB" : "#E2E8F0", color: sectorGroup === g.id ? "#FFF" : "#475569" }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid 2 Columns for Large Readable Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", flex: 1, overflowY: "auto", paddingRight: "6px" }}>
                {filteredSectors.map((s) => {
                  const isSelected = sector === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSector(s.id)}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "12px",
                        textAlign: "left",
                        backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                        border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        boxSizing: "border-box",
                        boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.12)" : "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                    >
                      <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: isSelected ? "#2563EB" : "#F1F5F9", color: isSelected ? "#FFF" : "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <s.icon size={22} />
                      </div>
                      <div>
                        <div style={{ fontWeight: "800", fontSize: "15px", color: "#0F172A" }}>{s.label}</div>
                        <div style={{ fontSize: "13px", color: "#64748B", marginTop: "2px", fontWeight: "500" }}>{s.note}</div>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", height: "100%", alignItems: "center" }}>
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    style={{
                      padding: "28px",
                      borderRadius: "16px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "240px",
                      boxSizing: "border-box",
                      boxShadow: isSelected ? "0 6px 16px rgba(37,99,235,0.15)" : "0 2px 6px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "800", backgroundColor: isSelected ? "#2563EB" : "#E2E8F0", color: isSelected ? "#FFF" : "#475569", padding: "5px 12px", borderRadius: "6px", display: "inline-block", marginBottom: "14px" }}>
                        {s.sub}
                      </span>
                      <h4 style={{ fontSize: "20px", fontWeight: "900", color: "#0F172A", margin: "0 0 10px 0" }}>{s.label}</h4>
                      <p style={{ fontSize: "14px", color: "#64748B", lineHeight: "1.5", margin: 0, fontWeight: "500" }}>{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </StepContainer>
        )}

        {/* STEPS 3-6: QUESTIONS (HIGH-READABILITY SINGLE SMT LAYOUT) */}
        {fnStepIdx >= 0 && (
          <StepContainer
            title={`${3 + fnStepIdx} · ${FUNCTIONS[fnStepIdx].label}`}
            subtitle="Mevcut durumunuzu en doğru yansıtan seçeneği işaretleyin."
            onBack={goBack}
            onNext={goNext}
            canProceed={canProceed}
            last={fnStepIdx === FUNCTIONS.length - 1}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%", overflowY: "auto", paddingRight: "8px" }}>
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx} style={{ backgroundColor: "#FFFFFF", padding: "20px 24px", borderRadius: "14px", border: "1px solid #E2E8F0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: "17px", fontWeight: "800", color: "#0F172A", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#EFF6FF", color: "#2563EB", fontSize: "13px", fontWeight: "900", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {qIdx + 1}
                    </span>
                    {q.text}
                  </div>

                  {/* 2x2 Grid for Easy Large Buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[step][qIdx] === oIdx + 1;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => setAnswer(step, qIdx, oIdx + 1)}
                          style={{
                            padding: "14px 18px",
                            borderRadius: "10px",
                            textAlign: "left",
                            fontSize: "14px",
                            fontWeight: isSelected ? "700" : "500",
                            backgroundColor: isSelected ? "#2563EB" : "#F8FAFC",
                            color: isSelected ? "#FFF" : "#1E293B",
                            border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                            cursor: "pointer",
                            lineHeight: "1.4",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            boxShadow: isSelected ? "0 4px 10px rgba(37,99,235,0.2)" : "none"
                          }}
                        >
                          <span style={{ fontWeight: "900", opacity: 0.8, fontSize: "13px" }}>{oIdx + 1}.</span>
                          <span>{opt}</span>
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
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* OVERVIEW BAR */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "20px 28px", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", color: "#2563EB", padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", marginBottom: "6px" }}>
                  <Award size={16} /> YAPAY ZEKA & OTOMASYON KARNESİ
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#0F172A", margin: 0 }}>
                  Adaptasyon Seviyesi: <span style={{ color: LEVELS[overallLevel].color }}>{LEVELS[overallLevel].label}</span>
                </h2>
                <div style={{ fontSize: "14px", color: "#64748B", marginTop: "4px", fontWeight: "600" }}>
                  {selectedSectorObj?.label} · {selectedSizeObj?.label}
                </div>
              </div>

              <ScoreGauge score={overallAvg} level={overallLevel} />
            </div>

            {/* 4 FUNCTION RESULT CARDS (2x2 GRID) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: "16px", flex: 1, overflowY: "auto" }}>
              {results.map((r) => {
                const toolsList = TOOLS[r.id][r.level];
                return (
                  <div key={r.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <r.icon size={22} color="#2563EB" />
                          <span style={{ fontWeight: "900", fontSize: "16px", color: "#0F172A" }}>{r.label}</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: LEVELS[r.level].color, backgroundColor: "#F8FAFC", padding: "4px 10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                          {r.avg.toFixed(1)} / 4.0
                        </span>
                      </div>

                      <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px 0", lineHeight: "1.5", fontWeight: "500" }}>
                        {NEED_STATEMENTS[r.id]}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "800", color: "#64748B", letterSpacing: "0.5px", marginBottom: "8px" }}>
                        ÖNERİLEN YAPAY ZEKA ARAÇLARI:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                        {toolsList.map((t, idx) => (
                          <div key={idx} style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", padding: "10px 12px", borderRadius: "10px" }}>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "#2563EB", marginBottom: "3px" }}>{t.name}</div>
                            <div style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.3", fontWeight: "500" }}>{t.why}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={restart} style={{ backgroundColor: "transparent", color: "#64748B", border: "1px solid #CBD5E1", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <RotateCcw size={16} /> Yeniden Başlat
              </button>
              <button onClick={() => window.print()} style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "12px 26px", borderRadius: "8px", fontSize: "14px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileDown size={18} /> YZ Önerilerini İndir / Yazdır
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
    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "28px 36px", width: "94vw", maxWidth: "1350px", height: "calc(100vh - 110px)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", boxShadow: "0 6px 24px rgba(0, 0, 0, 0.05)" }}>
      <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "14px", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#0F172A", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "14px", color: "#64748B", margin: "4px 0 0 0", fontWeight: "500" }}>{subtitle}</p>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
        <button onClick={onBack} style={{ backgroundColor: "transparent", color: "#64748B", border: "1px solid #CBD5E1", padding: "10px 22px", borderRadius: "8px", fontSize: "14px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <ArrowLeft size={18} /> Geri
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            backgroundColor: canProceed ? "#2563EB" : "#94A3B8",
            color: "#FFF",
            border: "none",
            padding: "12px 30px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "800",
            cursor: canProceed ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span>{last ? "Önerileri Gör" : "Devam Et"}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
