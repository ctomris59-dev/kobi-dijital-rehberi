-- Çorlu TSO KOBİ Dijital Hazırlık / Yapay Zeka Adaptasyon Rehberi — Başvuru Tablosu
-- Bu SQL'i Supabase Dashboard > SQL Editor içine yapıştırıp RUN'a basın.
-- Aynı Supabase projesini afet-is-surekliligi ile paylaşıyorsanız sorun değil;
-- bu tablo o projedekinden bağımsız, ayrı bir tablodur.

create table if not exists kobi_rehberi_basvurular (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Zorunlu iletişim bilgileri (6 ay sonraki takip için)
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,

  -- Seçilen sektör / ölçek
  sector text,
  sector_label text,
  business_size text,
  business_size_label text,

  -- Skorlar (1-4 arası ortalama, ilgili fonksiyon boyutunda)
  overall_avg numeric not null,
  overall_level text not null,
  ik_avg numeric,
  ik_level text,
  pazarlama_avg numeric,
  pazarlama_level text,
  stok_avg numeric,
  stok_level text,
  musteri_avg numeric,
  musteri_level text,

  -- Ham cevaplar (ileride yeniden analiz edebilmek için)
  answers jsonb,

  -- KVKK onayı
  kvkk_consent boolean not null default true,
  kvkk_consent_at timestamptz not null default now()
);

-- Row Level Security: herkes INSERT edebilsin, kimse dışarıdan SELECT/UPDATE/DELETE yapamasın.
-- Siz (Oda) verileri Supabase Dashboard'a kendi hesabınızla giriş yaparak göreceksiniz;
-- anon/public anahtarla dışarıdan okuma mümkün OLMAYACAK.
alter table kobi_rehberi_basvurular enable row level security;

create policy "Herkes basvuru ekleyebilir"
  on kobi_rehberi_basvurular
  for insert
  to anon
  with check (true);

-- Not: Bilerek bir SELECT policy eklemedik. Kayıtları sadece
-- Supabase Dashboard > Table Editor üzerinden (kendi giriş bilgilerinizle) göreceksiniz.
