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

const METHODOLOGY_LAST_UPDATED = "14 Ağustos 2026";

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

  // DOĞRUDAN .PDF DOSYASI İNDİRME İŞLEVİ (ÇORLU TSO LOGOLU)
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
            <div style="font-size: 12px; font-weight: 800; color: #2563EB; margin-top: 2px;">DİJİTAL DÖNÜŞÜM MERKEZİ — YZ ADAPTASYON RAPORU</div>
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

      <h3 style="font-size: 15px; font-weight: 800; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 14px;">DEPARTMAN BAZLI ANALİZ VE YZ ARAÇ ÖNERİLERİ</h3>

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
      margin:       10,
      filename:     `CTSO_YZ_Adaptasyon_Raporu_${(sector || "kobi")}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(pdfContainer).save();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#F8FAFC",
      // ŞIK VE DİNAMİK ARKA PLAN DEGRADE + DOKU
      backgroundImage: `
        radial-gradient(circle at 8% 8%, rgba(37,99,235,0.06) 0%, transparent 35%),
        radial-gradient(circle at 92% 12%, rgba(37,99,235,0.04) 0%, transparent 30%),
        radial-gradient(circle at 50% 95%, rgba(37,99,235,0.05) 0%, transparent 40%),
        linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)
      `,
      color: "#0F172A",
      fontFamily: "system-ui, -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      {/* İNCE MİKRO NOKTA DOKUSU (DOT GRID PATTERN) */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(rgba(15,23,42,0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        pointerEvents: "none",
        zIndex: 0
      }} />
      
      {/* HEADER */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0", height: "64px", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.jpg"
            alt="Çorlu TSO Logo"
            style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
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
            onClick={downloadReportPDF}
            style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "8px 18px", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <FileDown size={14} /> PDF Raporu İndir
          </button>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 32px", boxSizing: "border-box", overflow: "hidden", position: "relative", zIndex: 1 }}>
        
        {/* INTRO SCREEN */}
        {step === "intro" && (
          <div style={{ maxWidth: "960px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", padding: "6px 16px", borderRadius: "20px", color: "#2563EB", fontSize: "13px", fontWeight: "700", margin: "0 auto" }}>
              <Bot size={16} /> YAPAY ZEKA VE OTOMASYON ADAPTASYON REHBERİ
            </div>
            
            <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1.25", color: "#0F172A", margin: 0 }}>
              Süreçleriniz Yapay Zekaya Ne Kadar Hazır?<br />
              <span style={{ color: "#2563EB" }}>İşletme Ölçeğinize Uyumlu YZ Araç Önerileri ve Adaptasyon Rehberi</span>
            </h1>

            <p style={{ fontSize: "15px", color: "#475569", lineHeight: "1.6", margin: 0, maxWidth: "800px", alignSelf: "center" }}>
              5 dakikalık hızlı analizle İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizde yapay zeka potansiyelinizi görün; 
              işletme ölçeğinize en uygun YZ ve otomasyon araç önerilerini anında edinin.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", margin: "8px 0" }}>
              {FUNCTIONS.map((f) => (
                <div key={f.id} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", padding: "16px", borderRadius: "12px", textAlign: "left", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <f.icon size={22} color="#2563EB" style={{ marginBottom: "8px" }} />
                  <div style={{ fontWeight: "800", fontSize: "14px", color: "#0F172A" }}>{f.label}</div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px", lineHeight: "1.4" }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <button
              onClick={goNext}
              style={{ backgroundColor: "#2563EB", color: "#FFF", border: "none", padding: "14px 36px", borderRadius: "10px", fontSize: "16px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", margin: "0 auto", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)" }}
            >
              YZ Araç Rehberini Başlat <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* STEP 1: SECTOR */}
        {step === "sector" && (
          <StepContainer title="1 · Sektörünüz" subtitle="İşletmenizin ana faaliyet alanını seçin." onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
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

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: "10px", flex: 1, overflow: "hidden" }}>
                {filteredSectors.slice(0, 16).map((s) => {
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
          <StepContainer title="2 · İşletme Ölçeği" subtitle="Çalışan sayınıza uygun ölçeği seçin." onBack={goBack} onNext={goNext} canProceed={canProceed}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", height: "100%", alignItems: "center" }}>
              {SIZES.map((s) => {
                const isSelected = size === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      textAlign: "left",
                      backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                      border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "200px",
                      boxSizing: "border-box"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "800", backgroundColor: isSelected ? "#2563EB" : "#E2E8F0", color: isSelected ? "#FFF" : "#475569", padding: "4px 10px", borderRadius: "6px", display: "inline-block", marginBottom: "10px" }}>
                        {s.sub}
                      </span>
                      <h4 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", margin: "0 0 6px 0" }}>{s.label}</h4>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", justifyContent: "center" }}>
              {QUESTIONS[step].map((q, qIdx) => (
                <div key={qIdx} style={{ backgroundColor: "#FFFFFF", padding: "12px 16px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#EFF6FF", color: "#2563EB", fontSize: "12px", fontWeight: "900", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {qIdx + 1}
                    </span>
                    {q.text}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
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
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: "14px" }}>
            
            {/* OVERVIEW BAR */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "14px 24px", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#EFF6FF", color: "#2563EB", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", marginBottom: "4px" }}>
                  <Award size={14} /> YZ & OTOMASYON KARNESİ
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0F172A", margin: 0 }}>
                  Adaptasyon Seviyesi: <span style={{ color: LEVELS[overallLevel].color }}>{LEVELS[overallLevel].label}</span>
                </h2>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                  {selectedSectorObj?.label} · {selectedSizeObj?.label}
                </div>
              </div>

              <ScoreGauge score={overallAvg} level={overallLevel} />
            </div>

            {/* 4 FUNCTION RESULT CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: "12px", flex: 1 }}>
              {results.map((r) => {
                const toolsList = TOOLS[r.id][r.level];
                return (
                  <div key={r.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <r.icon size={18} color="#2563EB" />
                          <span style={{ fontWeight: "800", fontSize: "14px", color: "#0F172A" }}>{r.label}</span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: LEVELS[r.level].color, backgroundColor: "#F8FAFC", padding: "2px 8px", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                          {r.avg.toFixed(1)} / 4.0
                        </span>
                      </div>

                      <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                        {NEED_STATEMENTS[r.id]}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748B", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        ÖNERİLEN YAPAY ZEKA ARAÇLARI:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
function StepContainer({ title, subtitle, children, onBack, onNext, canProceed, last }) {
  return (
    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px 28px", width: "94vw", maxWidth: "1250px", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)" }}>
      <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "8px", marginBottom: "8px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0F172A", margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>{subtitle}</p>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #F1F5F9" }}>
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
