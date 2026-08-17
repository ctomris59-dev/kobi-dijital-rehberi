import React, { useState } from 'react';
import { 
  Cpu, 
  Users, 
  TrendingUp, 
  Cog, 
  Headphones, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Factory, 
  Store, 
  Briefcase, 
  Sparkles, 
  RefreshCcw,
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('landing'); // landing, quiz, results
  const [companySize, setCompanySize] = useState('');
  const [sector, setSector] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [results, setResults] = useState(null);

  // Quiz verilerini işleme
  const handleStartQuiz = () => {
    setStep('quiz');
  };

  const handleQuizSubmit = () => {
    // Burada basit bir simülasyon ve sonuç üretimi yapılıyor
    setResults({
      readinessScore: 78,
      summary: "İşletmenizin dijital altyapısı yapay zeka entegrasyonu için oldukça uygun. Özellikle operasyonel verimlilik ve müşteri ilişkilerinde hızlı kazanımlar elde edebilirsiniz.",
      recommendations: [
        {
          area: "İnsan Kaynakları",
          title: "Yapay Zeka Destekli Aday Tarama ve Özlük Otomasyonu",
          description: "Özgeçmişleri otomatik filtreleyen ve mülakat süreçlerini optimize eden sistemler kullanabilirsiniz.",
          tools: ["Workable AI", "Lever", "Loom AI"]
        },
        {
          area: "Pazarlama & Satış",
          title: "Üretken Yapay Zeka ile Reklam ve İçerik Yönetimi",
          description: "Sosyal medya metinleri ve ürün görsellerini saniyeler içinde oluşturan araçlarla pazarlama maliyetlerinizi düşürün.",
          tools: ["Jasper.ai", "Midjourney", "HubSpot AI"]
        },
        {
          area: "Stok & Üretim",
          title: "Tahminleme Algoritmaları ile Akıllı Depo",
          description: "Talep tahminlemesi yaparak stok maliyetlerini optimize edin ve tedarik zinciri kesintilerini önleyin.",
          tools: ["Netstock", "SAP Integrated Business Planning"]
        },
        {
          area: "Müşteri İlişkileri",
          title: "Çok Dilli Yapay Zeka Destekli Asistanlar ve CRM Entegrasyonu",
          description: "7/24 müşteri taleplerini yanıtlayan akıllı sohbet botları ile müşteri memnuniyetini artırın.",
          tools: ["Zendesk AI", "Intercom Fin", "Freshdesk"]
        }
      ]
    });
    setStep('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Arka Plan Efektleri ve Görsel Katmanı */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.4),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 via-slate-900/5 to-transparent pointer-events-none"></div>
      
      {/* Üst Bilgi Çubuğu */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-lg">ÇORLU TSO</span>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">DİJİTAL DÖNÜŞÜM MERKEZİ</span>
              </div>
              <p className="text-xs text-slate-400">KOBİ Yapay Zeka & Otomasyon Araç Rehberi</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Güvenilir Analiz</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> 5 Dakikada Sonuç</span>
          </div>
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {step === 'landing' && (
          <div className="space-y-16">
            {/* Hero Bölümü */}
            <div className="text-center max-w-4xl mx-auto space-y-8 pt-8">
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yapay Zeka ve Otomasyon Adaptasyon Rehberi</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Süreçleriniz <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">Yapay Zekaya</span> Ne Kadar Hazır?
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                İşletme ölçeğinize uyumlu <span className="text-white font-medium">Yapay Zeka Araç Önerileri ve Adaptasyon Rehberi</span> ile rekabette bir adım öne geçin.
              </p>

              {/* Görsel Eklemesi */}
              <div className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/50 p-2">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" 
                  alt="Dijital Dönüşüm ve Yapay Zeka Analitiği" 
                  className="rounded-xl w-full h-64 sm:h-80 object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-6 z-20 text-left bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-800">
                  <p className="text-xs text-blue-400 font-medium">Endüstriyel Dönüşüm</p>
                  <p className="text-sm font-semibold text-white">Veri Odaklı Karar Mekizmaları</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5 text-base group"
                >
                  <span>Yapay Zeka Araç Rehberini Başlat</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                5 dakikalık hızlı analizle İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizde yapay zeka potansiyelinizi görün.
              </p>
            </div>

            {/* Özellik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {[
                { icon: Users, title: "İnsan Kaynakları", desc: "Aday tarama, yapay zeka destekli mülakat, puantaj ve özlük otomasyonu." },
                { icon: TrendingUp, title: "Pazarlama & Satış", desc: "Görsel/metin yapay zeka üretimi, otomatik reklam ve müşteri segmentasyonu." },
                { icon: Cog, title: "Stok & Üretim", desc: "Tahminleme algoritmaları, otomatik yeniden sipariş ve akıllı depo." },
                { icon: Headphones, title: "Müşteri İlişkileri", desc: "Yapay Zeka Chatbotlar, sesli asistanlar, talep otomasyonu ve CRM entegrasyonu." }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Adım 1 / 1</span>
              <h2 className="text-2xl font-bold text-white mt-1">İşletme Profili Analizi</h2>
              <p className="text-sm text-slate-400 mt-1">Size en uygun yapay zeka araçlarını önerebilmemiz için lütfen aşağıdaki bilgileri doldurun.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">İşletme Ölçeğiniz</label>
                <select 
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Seçiniz...</option>
                  <option value="micro">Mikro İşletçe (1-9 Çalışan)</option>
                  <option value="small">Küçük Ölçekli (10-49 Çalışan)</option>
                  <option value="medium">Orta Ölçekli (50-249 Çalışan)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Faaliyet Sektörünüz</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Seçiniz...</option>
                  <option value="manufacturing">İmalat / Sanayi</option>
                  <option value="textile">Tekstil / Hazır Giyim</option>
                  <option value="commerce">Ticaret / E-Ticaret</option>
                  <option value="services">Hizmet / Danışmanlık</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep('landing')}
                  className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2"
                >
                  Geri Dön
                </button>
                <button
                  onClick={handleQuizSubmit}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
                >
                  <span>Sonuçları Gör</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && results && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Analiz Tamamlandı
                </div>
                <h2 className="text-3xl font-bold text-white">Yapay Zeka Adaptasyon Raporunuz</h2>
                <p className="text-slate-300 mt-2 text-sm leading-relaxed max-w-xl">{results.summary}</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-center min-w-[180px]">
                <div className="text-4xl font-extrabold text-blue-400 mb-1">{results.readinessScore}%</div>
                <div className="text-xs text-slate-400 font-medium">Hazırlık Skoru</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Önerilen Yapay Zeka ve Otomasyon Çözümleri</h3>
              <div className="grid grid-cols-1 gap-4">
                {results.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">{rec.area}</span>
                        <h4 className="text-lg font-bold text-white mt-2">{rec.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.tools.map((tool, tIdx) => (
                          <span key={tIdx} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 font-medium">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStep('landing')}
                className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Yeni Analiz Yap</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Alt Bilgi */}
      <footer className="border-t border-slate-900 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© 2026 Çorlu Ticaret ve Sanayi Odası - Dijital Dönüşüm ve Yapay Zeka Araç Rehberi.</p>
      </footer>
    </div>
  );
}
