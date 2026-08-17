import React, { useState, useMemo, useEffect } from "react";
import {
  Shirt, Wheat, Cog, ShoppingCart, Users, Megaphone, Boxes, Headphones,
  FlaskConical, Car, Hammer, HardHat, Truck, Tractor, UtensilsCrossed,
  Laptop, Stethoscope, GraduationCap, Landmark, Recycle, Search,
  ArrowRight, ArrowLeft, Sparkles, RotateCcw, FileDown,
  Award, ShieldCheck, Info, Target, Bot, Cpu
} from "lucide-react";

/* ---------------------------------------------------------
   VERİ KATMANI — Yapay Zeka & Otomasyon Araç Veritabanı
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
  { id: "mikro", label: "Mikro İşletme", sub: "1–9 Çalışan", desc: "Hızlı devreye alınan, düşük bütçeli veya ücretsiz Yapay Zeka & bulut otomasyon araçlarına odaklı." },
  { id: "kucuk", label: "Küçük İşletme", sub: "10–49 Çalışan", desc: "Departmanlar arası veri akışını otomatikleştiren tak-çalıştır Yapay Zeka yazılımları." },
  { id: "orta", label: "Orta Ölçekli İşletme", sub: "50–249 Çalışan", desc: "Mevcut ERP/CRM altyapılarına entegre olabilen gelişmiş Yapay Zeka ve analitik platformları." },
  { id: "buyuk", label: "Büyük İşletme", sub: "250+ Çalışan", desc: "Kurumsal düzeyde özel Yapay Zeka modelleri, büyük veri analitiği ve tam entegre otomasyon mimarileri." },
];

const FUNCTIONS = [
  { id: "ik", label: "İnsan Kaynakları", icon: Users, desc: "Aday tarama, Yapay Zeka destekli mülakat, puantaj ve özlük otomasyonu." },
  { id: "pazarlama", label: "Pazarlama & Satış", icon: Megaphone, desc: "Görsel/metin Yapay Zeka üretimi, otomatik reklam ve müşteri segmentasyonu." },
  { id: "stok", label: "Stok & Üretim", icon: Boxes, desc: "Tahminleme algoritmaları, otomatik yeniden sipariş ve akıllı depo." },
  { id: "musteri", label: "Müşteri İlişkileri", icon: Headphones, desc: "Yapay Zeka Chatbotlar, sesli asistanlar, talep otomasyonu ve CRM entegrasyonu." },
];

const NEED_STATEMENTS = {
  ik: "Öncelikli Yapay Zeka Odağı: Başvuru ve CV değerlendirmede metin analiz Yapay Zeka araçları kullanmak, rutin puantaj ve izin onaylarını otomatikleştirmek.",
  pazarlama: "Öncelikli Yapay Zeka Odağı: İçerik ve tasarım süreçlerinde üretken Yapay Zeka (Generative AI) araçlarını devreye alarak pazarlama hunisini otomatikleştirmek.",
  stok: "Öncelikli Yapay Zeka Odağı: Stok ihtiyaçlarını ve satış tahminlerini yapay zeka modellerine bağlayarak reorder (sipariş) süreçlerini otomatik kılmak.",
  musteri: "Öncelikli Yapay Zeka Odağı: Müşteri taleplerini 7/24 karşılayan doğal dil işleme (NLP) destekli Yapay Zeka asistanları ve akıllı CRM kurguları oluşturmak.",
};

const METHODOLOGY_LAST_UPDATED = "14 Ağustos 2026";

const QUESTIONS = {
  ik: [
    { text: "İşe alımda yapay zeka veya otomasyon araçları kullanıyor musunuz?", options: [
      "Hayır, tamamen manuel yürütüyoruz",
      "Kısmen; e-posta ve Excel tabloları aktif",
      "Aday takip yazılımları (ATS) kullanıyoruz",
      "Yapay Zeka destekli otomatik aday eleme araçları aktif"
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
      "Dijital OKR/KPI platformu ve Yapay Zeka analitiği"
    ]}
  ],
  pazarlama: [
    { text: "İçerik/görsel üretiminde Yapay Zeka (ChatGPT, Canva AI vb.) kullanıyor musunuz?", options: [
      "Hayır, yapay zeka kullanılmıyor",
      "Çalışanlar bireysel olarak nadiren deniyor",
      "Düzenli içerik takvimi ve Yapay Zeka tasarım araçları aktif",
      "Tüm içerik ve reklam kurguları Yapay Zeka ile yönetiliyor"
    ]},
    { text: "Müşteri iletişim listelerine yönelik otomatik pazarlama kurgularınız var mı?", options: [
      "Toplu iletişim yapılmıyor",
      "Manuel notlar ve telefon rehberi üzerinden",
      "Toplu e-posta / WhatsApp araçları manuel",
      "Müşteri davranışına göre otomatik tetiklenen Yapay Zeka e-posta/SMS"
    ]},
    { text: "Pazarlama harcamalarınızın dönüşümü (ROI) otomasyonla izleniyor mu?", options: [
      "Ölçüm yapılmıyor",
      "Genel satış rakamlarına göre hissi",
      "Sosyal medya platformlarının temel analitiği",
      "Google/Meta Analytics ve Yapay Zeka panelleri ile anlık"
    ]}
  ],
  stok: [
    { text: "Stok ihtiyacını tahminlemede yapay zeka/yazılım kullanıyor musunuz?", options: [
      "Gözle kontrol ve tecrübeye dayalı",
      "Manuel Excel kayıtları ile izleniyor",
      "Stok yazılımındaki sabit uyarılara bakılıyor",
      "Gelecek ihtiyacı tahmin eden Yapay Zeka/ERP algoritmaları aktif"
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
    { text: "Müşteri sorularına yanıt veren Yapay Zeka Chatbot veya Asistanınız var mı?", options: [
      "Tüm sorulara insan çalışanlar manuel yanıt veriyor",
      "Sadece WhatsApp Business otomatik karşılama var",
      "Web sitesinde temel sabit menülü chatbot mevcut",
      "Doğal dil işleyen (NLP) Yapay Zeka Chatbot 7/24 aktif"
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
      { name: "ChatGPT / Claude İK Şablonları", why: "İş ilanı, mülakat soruları ve görev tanımlarını Yapay Zeka ile üretir." },
      { name: "Google Forms + Sheets İK Otomasyonu", why: "Kodsuz formlarla başvuru toplayıp otomatik tablolandırır." },
    ],
    gelisen: [
      { name: "Manatal AI Recruiting", why: "CV'leri yapay zeka ile ayrıştırır, puanlar ve en uygun adayları sıralar." },
      { name: "Kolay İK Bulut Platformu", why: "İzin, puantaj ve özlük süreçlerini otomatikleştiren KVKK uyumlu yerli yazılım." },
    ],
    ileri: [
      { name: "SAP SuccessFactors / Workday AI", why: "Kurumsal ölçekte Yapay Zeka destekli yetenek yönetimi ve performans analitiği." },
      { name: "Kurumsal Bordro & Vardiya Otomasyonu", why: "Bordro, dijital imza ve vardiya süreçlerini otomasyonla birleştirir." },
    ],
  },
  pazarlama: {
    baslangic: [
      { name: "Canva Magic Studio (Yapay Zeka Tasarım)", why: "Yapay zeka ile saniyeler içinde sosyal medya görselleri üretir." },
      { name: "ChatGPT / Gemini Pro Metin Asistanı", why: "Reklam metinleri ve e-posta taslaklarını otomatik hazırlar." },
    ],
    gelisen: [
      { name: "Brevo (Sendinblue) AI Kampanya", why: "En uygun gönderim zamanını Yapay Zeka ile belirleyen otomatik e-posta platformu." },
      { name: "Meta & Google AI Ads Manager", why: "Akıllı Kampanyalar ile reklam bütçesini Yapay Zeka algoritmalarına optimize ettirir." },
    ],
    ileri: [
      { name: "Insider AI Omnichannel & Salesforce Marketing Cloud", why: "Çoklu kanalda kişiselleştirilmiş kurumsal Yapay Zeka pazarlama deneyimi sunan platform." },
      { name: "HubSpot Marketing Hub Enterprise AI", why: "Inbound pazarlama ve müşteri skorlamayı Yapay Zeka ile kurumsal düzeyde entegre eder." },
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
      { name: "SAP S/4HANA AI Supply Chain & Logo Tiger 3 Enterprise", why: "Gelişmiş kurumsal üretim planlama, MRP ve yapay zeka destekli tedarik zinciri otomasyonu." },
      { name: "Dematic / Akıllı Otomasyon Depo Sistemleri", why: "Yapay zeka güdümlü otonom depo ve sevkiyat yönetimi." },
    ],
  },
  musteri: {
    baslangic: [
      { name: "WhatsApp Business Otomatik Yanıtlar", why: "Müşterilere hazır hızlı yanıtlar ve katalog seçenekleri sunar." },
      { name: "Notion AI Müşteri Veritabanı", why: "Müşteri görüşme notlarını Yapay Zeka ile özetleyen aranabilir pano." },
    ],
    gelisen: [
      { name: "HubSpot Free / Starter CRM", why: "Satış fırsatlarını ve teklif takibini otomatikleştiren CRM." },
      { name: "Zoho SalesIQ Akıllı Chatbot", why: "Web sitenize gelen ziyaretçileri karşılayan mesajlaşma botu." },
    ],
    ileri: [
      { name: "Salesforce Einstein AI CRM & Microsoft Dynamics 365", why: "Satış kapatma ihtimallerini Yapay Zeka ile tahmin eden kurumsal CRM altyapısı." },
      { name: "Enterprise Omnichannel AI Contact Center", why: "Büyük ölçekli çağrı merkezleri için NLP destekli akıllı sesli ve yazılı asistanlar." },
    ],
  },
};

const LEVELS = {
  baslangic: { label: "Temel Seviye (Manuel Süreçler)", color: "#EF4444" },
  gelisen: { label: "Gelişen Seviye (Kısmi Otomasyon & Yapay Zeka)", color: "#F59E0B" },
  ileri: { label: "İleri Seviye (Entegre Yapay Zeka & Tam Otomasyon)", color: "#10B981" },
};

function levelFromScore(avg) {
  if (avg < 2) return "baslangic";
  if (avg < 3) return "gelisen";
  return "ileri";
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

function ScoreGauge({ score, level, size = 150 }) {
  const percentage = Math.min(Math.max(((score - 1) / 3) * 100, 0), 100);
  const strokeDasharray = 220;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  const h = size * (80 / 150);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <svg width={size} height={h} viewBox="0 0 150 80">
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

const STEPS = ["intro", "sector", "size", "ik", "pazarlama", "stok", "musteri", "results"];

export default function App() {
  const isMobile = useIsMobile();
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

  const downloadReportPDF = async () => {
    if (!window.html2pdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    const pdfContainer = document.createElement("div");
    pdfContainer.style.width = "750px";
    pdfContainer.style.padding = "30px";
    pdfContainer.style.backgroundColor = "#FFFFFF";
    pdfContainer.style.color = "#0F172A";
    pdfContainer.style.fontFamily = "Arial, sans-serif";
    pdfContainer.innerHTML = `
      <div style="border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="/logo.jpg" alt="Çorlu TSO Logo" style="width: 55px; height: 55px; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div style="width: 44px; height: 44px; border-radius: 8px; background-color: #2563EB; color: #FFF; font-weight: 900; font-size: 20px; display: none; align-items: center; justify-content: center;">Ç</div>
          <div>
            <div style="font-size: 18px; font-weight: 900; color: #0F172A;">ÇORLU TİCARET VE SANAYİ ODASI</div>
            <div style="font-size: 12px; font-weight: 800; color: #2563EB; margin-top: 2px;">DİJİTAL DÖNÜŞÜM MERKEZİ — YAPAY ZEKA ADAPTASYON RAPORU</div>
          </div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748B;">
          <div><strong>Tarih:</strong> ${METHODOLOGY_LAST_UPDATED}</div>
          <div><strong>Referans:</strong> ÇTSO-YZ-${(sector || "KOBI").toUpperCase().slice(0, 3)}</div>
        </div>
      </div>
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; font-weight: 800; color: #2563EB; letter-spacing: 0.5px; margin-bottom: 4px;">DİJİTAL UYUM VE OTOMASYON KARNESİ</div>
          <div style="font-size: 20px; font-weight: 900; color: #0F172A;">
            Seviye: <span style="color: ${LEVELS[overallLevel].color}">${LEVELS[overallLevel].label}</span>
          </div>
          <div style="font-size: 12px; color: #64748B; margin-top: 4px;">
            Sektör: <strong>${selectedSectorObj?.label || "Belirtilmedi"}</strong> | Ölçek: <strong>${selectedSizeObj?.label || "Belirtilmedi"}</strong>
          </div>
        </div>
        <div style="text-align: center; background: #FFFFFF; padding: 10px 18px; border-radius: 8px; border: 1px solid #CBD5E1;">
          <div style="font-size: 24px; font-weight: 900; color: #0F172A;">${overallAvg.toFixed(1)} <span style="font-size: 12px; color: #64748B;">/ 4.0</span></div>
          <div style="font-size: 10px; font-weight: 800; color: #64748B;">GENEL SKOR</div>
        </div>
      </div>
      <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 14px;">DEPARTMAN BAZLI ANALİZ VE YAPAY ZEKA ARAÇ ÖNERİLERİ</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        ${results.map((r) => `
          <div style="border: 1px solid #E2E8F0; border-left: 4px solid ${LEVELS[r.level].color}; border-radius: 8px; padding: 12px; background-color: #FFFFFF; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 13px; color: #0F172A;">${r.label}</span>
              <span style="font-size: 10px; font-weight: 800; color: ${LEVELS[r.level].color}; background-color: #F8FAFC; padding: 2px 6px; border-radius: 4px; border: 1px solid #E2E8F0;">
                ${r.avg.toFixed(1)} / 4.0
              </span>
            </div>
            <p style="font-size: 10px; color: #334155; margin: 0 0 8px 0; background-color: #F8FAFC; padding: 6px; border-radius: 4px; line-height: 1.3;">
              ${NEED_STATEMENTS[r.id]}
            </p>
            <div style="font-size: 9px; font-weight: 800; color: #64748B; margin-bottom: 4px;">ÖNERİLEN YAPAY ZEKA ARAÇLARI:</div>
            ${TOOLS[r.id][r.level].map((t) => `
              <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; padding: 6px 8px; border-radius: 6px; margin-bottom: 4px;">
                <div style="font-size: 11px; font-weight: 800; color: #2563EB;">${t.name}</div>
                <div style="font-size: 9px; color: #475569; margin-top: 2px;">${t.why}</div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 9px; color: #94A3B8;">
        Çorlu Ticaret ve Sanayi Odası Dijital Dönüşüm Merkezi — İşletmenize özel bilgilendirme ve yönlendirme raporudur.
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `CTSO_Yapay_Zeka_Adaptasyon_Raporu_${(sector || "isletme")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(pdfContainer).save();
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#0F172A",
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      color: "#0F172A",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>
      {/* HEADER */}
      <header style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)", 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #E2E8F0",
        minHeight: "64px", padding: isMobile ? "10px 16px" : "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "8px", flexShrink: 0, position: "relative", zIndex: 1
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/logo.jpg"
            alt="Çorlu TSO Logo"
            style={{ width: isMobile ? "34px" : "42px", height: isMobile ? "34px" : "42px", objectFit: "contain", flexShrink: 0 }}
            onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
          />
          <div style={{ width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "#2563EB", color: "#FFF", fontWeight: "900", fontSize: "18px", display: "none", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            Ç
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontWeight: "800", fontSize: isMobile ? "14px" : "16px", color: "#0F172A" }}>ÇORLU TSO</span>
              {!isMobile && (
                <span style={{ backgroundColor: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "700" }}>
                  DİJİTAL DÖNÜŞÜM MERKEZİ
                </span>
              )}
            </div>
            {!isMobile && <p style={{ fontSize: "11px", color: "#64748B", margin: 0 }}>Yapay Zeka & Otomasyon Araç Rehberi</p>}
          </div>
        </div>

        {stepIdx > 0 && stepIdx < STEPS.length - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "12px", backgroundColor: "#F1F5F9", padding: "6px 12px", borderRadius: "8px" }}>
            {!isMobile && <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748B" }}>İlerleme:</span>}
            <div style={{ width: isMobile ? "70px" : "120px", backgroundColor: "#CBD5E1", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ backgroundColor: "#2563EB", height: "100%", width: `${(stepIdx / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563EB" }}>%{Math.round((stepIdx / (STEPS.length - 1)) * 100)}</span>
          </div>
        )}

        {step === "results" && (
          <button
            onClick={downloadReportPDF}
            style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <FileDown size={14} /> {isMobile ? "PDF" : "PDF Raporu İndir"}
          </button>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{
        flex: 1, display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center",
        padding: isMobile ? "16px 12px 32px 12px" : "16px 32px",
        boxSizing: "border-box", position: "relative", zIndex: 1
      }}>

        {/* INTRO SCREEN */}
        {step === "intro" && (
          <div style={{ 
            maxWidth: "960px", width: "100%", textAlign: "center", 
            display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "20px",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            padding: isMobile ? "24px" : "40px", borderRadius: "20px", backdropFilter: "blur(8px)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", padding: "6px 16px", borderRadius: "20px", color: "#2563EB", fontSize: "12px", fontWeight: "700", margin: "0 auto" }}>
              <Bot size={16} /> YAPAY ZEKA VE OTOMASYON ADAPTASYON REHBERİ
            </div>
            <h1 style={{ fontSize: isMobile ? "22px" : "32px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1.3", color: "#0F172A", margin: 0 }}>
              Süreçleriniz Yapay Zekaya Ne Kadar Hazır?<br />
              <span style={{ color: "#2563EB" }}>İşletme Ölçeğinize Uyumlu Yapay Zeka Araç Önerileri ve Adaptasyon Rehberi</span>
            </h1>
            <p style={{ fontSize: isMobile ? "13px" : "15px", color: "#475569", lineHeight: "1.6", margin: 0, maxWidth: "800px", alignSelf: "center" }}>
              5 dakikalık hızlı analizle İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizde yapay zeka potansiyelinizi görün;
              işletme ölçeğinize en uygun yapay zeka ve otomasyon araç önerilerini anında edinin.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? "10px" : "16px", margin: "8px 0" }}>
              {FUNCTIONS.map((f) => (
                <div key={f.id} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", padding: isMobile ? "12px" : "16px", borderRadius: "12px", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <f.icon size={20} color="#2563EB" style={{ marginBottom: "8px" }} />
                  <div style={{ fontWeight: "800", fontSize: "13px", color: "#0F172A" }}>{f.label}</div>
                  {!isMobile && <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px", lineHeight: "1.4" }}>{f.desc}</div>}
                </div>
              ))}
            </div>
            <button
              onClick={goNext}
              style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: isMobile ? "13px 28px" : "14px 36px", borderRadius: "10px", fontSize: isMobile ? "15px" : "16px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", margin: "0 auto", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)" }}
            >
              Yapay Zeka Araç Rehberini Başlat <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 1: SECTOR */}
        {step === "sector" && (
          <StepContainer title="1 · Sektörünüz" subtitle="İşletmenizin ana faaliyet alanını seçin." onBack={goBack} onNext={goNext} canProceed={canProceed} isMobile={isMobile}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: isMobile ? "100%" : "200px" }}>
                  <Search size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "#94A3B8" }} />
                  <input
                    type="text"
                    value={sectorQuery}
                    onChange={(e) => setSectorQuery(e.target.value)}
                    placeholder="Sektör ara..."
                    style={{ width: "100%", padding: "10px 14px 10px 42px", backgroundColor: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#0F172A", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", overflowX: isMobile ? "auto" : "visible" }}>
                  <button
                    onClick={() => setSectorGroup("all")}
                    style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === "all" ? "#2563EB" : "#E2E8F0", color: sectorGroup === "all" ? "#FFF" : "#475569", whiteSpace: "nowrap" }}
                  >
                    Tümü
                  </button>
                  {SECTOR_GROUPS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSectorGroup(g.id)}
                      style={{ padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", border: "none", cursor: "pointer", backgroundColor: sectorGroup === g.id ? "#2563EB" : "#E2E8F0", color: sectorGroup === g.id ? "#FFF" : "#475569", whiteSpace: "nowrap" }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
                gap: "10px", flex: 1, overflowY: "auto"
              }}>
                {filteredSectors.map((s) => {
                  const isSelected = sector === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSector(s.id)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textAlign: "left",
                        backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                        border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        boxSizing: "border-box"
                      }}
                    >
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: isSelected ? "#2563EB" : "#F1F5F9", color: isSelected ? "#FFF" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <s.icon size={16} />
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontWeight: "700", fontSize: "13px", color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
                        <div style={{ fontSize: "11px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.note}</div>
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
          <StepContainer title="2 · İşletme Ölçeği" subtitle="Çalışan sayınıza uygun ölçeği seçin." onBack={goBack} onNext={goNext} canProceed={canProceed} isMobile={isMobile}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 2fr)", gap: "12px", height: "100%", alignItems: isMobile ? "stretch" : "center", overflowY: "auto" }}>
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    style={{
                      padding: "16px",
                      borderRadius: "14px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      minHeight: isMobile ? "auto" : "150px",
                      boxSizing: "border-box"
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: "800", backgroundColor: isSelected ? "#2563EB" : "#E2E8F0", color: isSelected ? "#FFF" : "#475569", padding: "4px 10px", borderRadius: "6px", display: "inline-block", marginBottom: "8px", alignSelf: "flex-start" }}>
                      {s.sub}
                    </span>
                    <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: "0 0 4px 0" }}>{s.label}</h4>
                    <p style={{ fontSize: "12px", color: "#64748B", lineHeight: "1.4", margin: 0 }}>{s.desc}</p>
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
            isMobile={isMobile}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", justifyContent: "flex-start", overflowY: "auto" }}>
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx} style={{ backgroundColor: "#FFFFFF", padding: "12px 14px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: "800", color: "#0F172A", marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#EFF6FF", color: "#2563EB", fontSize: "12px", fontWeight: "900", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {qIdx + 1}
                    </span>
                    <span>{q.text}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "8px" }}>
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
                            fontSize: "13px",
                            fontWeight: isSelected ? "700" : "500",
                            backgroundColor: isSelected ? "#2563EB" : "#F8FAFC",
                            color: isSelected ? "#FFF" : "#1E293B",
                            border: isSelected ? "2px solid #2563EB" : "1px solid #CBD5E1",
                            cursor: "pointer",
                            lineHeight: "1.3",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px"
                          }}
                        >
                          <span style={{ fontWeight: "900", opacity: 0.8 }}>{oIdx + 1}.</span>
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
          <div style={{ width: "100%", maxWidth: "1300px", display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "24px" }}>
            {/* OVERVIEW BAR */}
            <div style={{ backgroundColor: "#FFFFFF", padding: isMobile ? "14px 16px" : "14px 24px", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", color: "#2563EB", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", marginBottom: "4px" }}>
                  <Award size={14} /> YAPAY ZEKA & OTOMASYON KARNESİ
                </div>
                <h2 style={{ fontSize: isMobile ? "17px" : "20px", fontWeight: "900", color: "#0F172A", margin: 0 }}>
                  Adaptasyon Seviyesi: <span style={{ color: LEVELS[overallLevel].color }}>{LEVELS[overallLevel].label}</span>
                </h2>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                  {selectedSectorObj?.label} · {selectedSizeObj?.label}
                </div>
              </div>
              <ScoreGauge score={overallAvg} level={overallLevel} size={isMobile ? 120 : 150} />
            </div>

            {/* 4 FUNCTION RESULT CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "12px" }}>
              {results.map((r) => {
                const toolsList = TOOLS[r.id][r.level];
                return (
                  <div key={r.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", borderLeft: `4px solid ${LEVELS[r.level].color}`, padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <r.icon size={18} color="#2563EB" />
                          <span style={{ fontWeight: "800", fontSize: "14px", color: "#0F172A" }}>{r.label}</span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: LEVELS[r.level].color, backgroundColor: "#F8FAFC", padding: "2px 8px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                          {r.avg.toFixed(1)} / 4.0
                        </span>
                      </div>
                      <p style={{ fontSize: "11px", color: "#475569", margin: 0, lineHeight: "1.4" }}>
                        {NEED_STATEMENTS[r.id]}
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748B", letterSpacing: "0.5px", marginBottom: "6px" }}>
                        ÖNERİLEN YAPAY ZEKA ARAÇLARI:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "8px" }}>
                        {toolsList.map((t, idx) => (
                          <div key={idx} style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", padding: "8px", borderRadius: "8px" }}>
                            <div style={{ fontSize: "11px", fontWeight: "700", color: "#2563EB", marginBottom: "2px" }}>{t.name}</div>
                            <div style={{ fontSize: "10px", color: "#64748B", lineHeight: "1.3" }}>{t.why}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <button onClick={restart} style={{ backgroundColor: "transparent", color: "#64748B", border: "1px solid #CBD5E1", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <RotateCcw size={14} /> Yeniden Başlat
              </button>
              <button onClick={downloadReportPDF} style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "10px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileDown size={16} /> PDF Raporu İndir
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* REUSABLE CONTAINER */
function StepContainer({ title, subtitle, children, onBack, onNext, canProceed, last, isMobile }) {
  return (
    <div style={{
      backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0",
      padding: isMobile ? "16px" : "20px 28px",
      width: isMobile ? "100%" : "94vw", maxWidth: "1250px",
      minHeight: isMobile ? "auto" : "calc(100vh - 100px)",
      maxHeight: isMobile ? "none" : "calc(100vh - 100px)",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      boxSizing: "border-box", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)"
    }}>
      <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "8px", marginBottom: "8px" }}>
        <h2 style={{ fontSize: isMobile ? "17px" : "20px", fontWeight: "900", color: "#0F172A", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>{subtitle}</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: isMobile ? "auto" : 0 }}>{children}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #F1F5F9", marginTop: "8px" }}>
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
