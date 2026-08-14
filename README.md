# KOBİ Yapay Zeka Hazırlık & Otomasyon Rehberi

Çorlu TSO üyeleri için sektöre özel dijital olgunluk testi. Firma, sektörünü (16 seçenek,
4 grup), ölçeğini ve 4 fonksiyon (İK, Pazarlama, Stok/Üretim, Müşteri İlişkileri) için
12 soruyu yanıtlıyor; sonunda her fonksiyon için olgunluk seviyesi (gösterge/dial) ve
düşük maliyetli araç önerisi + yol haritası görüyor.

Vite + React + Tailwind ile kurulmuş, tek sayfalık bir istemci uygulaması. Şu an araç ve
soru verisi `src/App.jsx` içinde sabit (statik) — canlıya alırken bunu ayrı bir veri
katmanına (örn. Supabase tablosu) taşımanız önerilir, çünkü araç önerileri zamanla eskir.

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` açılır.

## Prodüksiyon build

```bash
npm run build
npm run preview
```

## GitHub'a yükleme

```bash
git init
git add .
git commit -m "İlk sürüm: KOBİ dijital hazırlık rehberi"
git branch -M main
git remote add origin <REPO_URL>
git push -u origin main
```

## Vercel'de yayınlama

1. [vercel.com](https://vercel.com) üzerinden "New Project" ile GitHub reponuzu içe aktarın.
2. Vercel, Vite projesini otomatik algılar:
   - **Build Command:** `npm run build` (veya `vite build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. Ek ortam değişkeni gerekmiyor (şu an harici bir API/DB bağlantısı yok).
4. "Deploy" butonuna basın — birkaç saniye içinde canlı bağlantı hazır olur.

Sonraki adımda araç/soru verisini Supabase'e taşırsanız, `VITE_SUPABASE_URL` ve
`VITE_SUPABASE_ANON_KEY` gibi ortam değişkenlerini hem yerel `.env` dosyanıza hem de
Vercel proje ayarlarındaki "Environment Variables" bölümüne eklemeniz gerekir.

## Klasör yapısı

```
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx      # React giriş noktası
    ├── index.css     # Tailwind direktifleri
    └── App.jsx       # Uygulamanın tamamı (soru/araç verisi + arayüz)
```
