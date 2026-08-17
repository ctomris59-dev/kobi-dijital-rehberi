import React, { useState } from 'react';
import { Cpu, Users, TrendingUp, Cog, Headphones, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden flex flex-col selection:bg-blue-600 relative">
      
      {/* Arka Plan Efekti */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(30,58,138,0.2),rgba(0,0,0,0))] pointer-events-none"></div>
      
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-md h-16 flex items-center shrink-0">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo Alanı Geri Geldi */}
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
               <span className="text-blue-900 font-black text-xs text-center leading-none">ÇORLU<br/>TSO</span>
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-sm">DİJİTAL DÖNÜŞÜM MERKEZİ</h2>
              <p className="text-[10px] text-blue-400 uppercase font-semibold">KOBİ Yapay Zeka & Otomasyon Rehberi</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Güvenilir Analiz</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 5 Dakikada Sonuç</span>
          </div>
        </div>
      </header>

      {/* Ana İçerik - Tek Ekran */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-5xl w-full text-center space-y-8">
          
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-[10px] uppercase font-bold tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>Yapay Zeka ve Otomasyon Adaptasyon Rehberi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Süreçleriniz <span className="text-blue-500">Yapay Zekaya</span> Ne Kadar Hazır?
            </h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              5 dakikalık hızlı analizle İK, Pazarlama, Üretim/Stok ve Müşteri İlişkileri süreçlerinizde yapay zeka potansiyelinizi görün.
            </p>
          </div>

          {/* Özellik Kartları */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Users, title: "İnsan Kaynakları" },
              { icon: TrendingUp, title: "Pazarlama & Satış" },
              { icon: Cog, title: "Stok & Üretim" },
              { icon: Headphones, title: "Müşteri İlişkileri" }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition-colors">
                <item.icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <h3 className="text-xs font-bold">{item.title}</h3>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
            <span>Yapay Zeka Araç Rehberini Başlat</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center border-t border-slate-900 text-[10px] text-slate-600 shrink-0">
        © 2026 Çorlu Ticaret ve Sanayi Odası
      </footer>
    </div>
  );
}
