import jsPDF from "jspdf";

/* ---------------------------------------------------------------
   FONT VE LOGO YÜKLEME (Türkçe karakter desteği için DejaVuSans)
--------------------------------------------------------------- */
let fontsLoadedPromise = null;

async function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function loadLogoBase64() {
  try {
    const response = await fetch("/logo.jpg");
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
}

async function ensureFontsLoaded(doc) {
  if (!fontsLoadedPromise) {
    fontsLoadedPromise = Promise.all([
      fetch("/fonts/DejaVuSans-subset.ttf").then((r) => r.arrayBuffer()),
      fetch("/fonts/DejaVuSans-Bold-subset.ttf").then((r) => r.arrayBuffer()),
    ]).then(([regularBuf, boldBuf]) =>
      Promise.all([arrayBufferToBase64(regularBuf), arrayBufferToBase64(boldBuf)])
    );
  }
  const [regularB64, boldB64] = await fontsLoadedPromise;
  doc.addFileToVFS("DejaVuSans.ttf", regularB64);
  doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
  doc.addFileToVFS("DejaVuSans-Bold.ttf", boldB64);
  doc.addFont("DejaVuSans-Bold.ttf", "DejaVuSans", "bold");
}

/* ---------------------------------------------------------------
   RENK PALETİ (kobi-dijital-rehberi mavi teması)
--------------------------------------------------------------- */
const NAVY = [15, 23, 42];       // slate-900
const BLUE = [37, 99, 235];      // #2563EB
const STEEL = [100, 116, 139];
const GRID = [226, 232, 240];
const LIGHT_BG = [248, 250, 252];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}

function drawHeaderBanner(doc, logoBase64) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 20, "F");
  doc.setFillColor(...BLUE);
  doc.rect(0, 20, PAGE_W, 1, "F");

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "JPEG", MARGIN, 3, 14, 14);
    } catch (e) {
      /* logo yerleşmezse sessizce geç */
    }
  }
  const titleX = logoBase64 ? MARGIN + 18 : MARGIN;
  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(96, 165, 250);
  doc.text("ÇORLU TİCARET VE SANAYİ ODASI", titleX, 9);
  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Yapay Zeka & Otomasyon Adaptasyon Raporu", titleX, 15);
}

function footer(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...GRID);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
    doc.setFont("DejaVuSans", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...STEEL);
    doc.text("ÇORLU TİCARET VE SANAYİ ODASI · KOBİ YAPAY ZEKA & OTOMASYON REHBERİ", MARGIN, PAGE_H - 7);
    doc.text(`Sayfa ${i} / ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 7, { align: "right" });
  }
}

function paragraph(doc, text, y, opts = {}) {
  const { size = 8.5, color = [51, 65, 85], lineHeight = 4.2, width = CONTENT_W, x = MARGIN } = opts;
  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, width);
  lines.forEach((line, i) => doc.text(line, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

/* ---------------------------------------------------------------
   RADAR (4 fonksiyon, 1-4 skala)
--------------------------------------------------------------- */
function drawRadar(doc, results, cx, cy, maxR) {
  const n = results.length;
  const pointAt = (i, r) => {
    const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  [1, 2, 3, 4].forEach((ring) => {
    doc.setDrawColor(...GRID);
    doc.setLineWidth(ring === 4 ? 0.3 : 0.15);
    const pts = results.map((_, i) => pointAt(i, ((ring - 1) / 3) * maxR));
    for (let i = 0; i < n; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % n];
      doc.line(x1, y1, x2, y2);
    }
  });

  results.forEach((_, i) => {
    const [x, y] = pointAt(i, maxR);
    doc.line(cx, cy, x, y);
  });

  const dataPts = results.map((r, i) => pointAt(i, ((r.avg - 1) / 3) * maxR));
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(1);
  for (let i = 0; i < n; i++) {
    const [x1, y1] = dataPts[i];
    const [x2, y2] = dataPts[(i + 1) % n];
    doc.line(x1, y1, x2, y2);
  }
  dataPts.forEach(([x, y]) => {
    doc.setFillColor(...BLUE);
    doc.circle(x, y, 1.4, "F");
  });

  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...NAVY);
  results.forEach((r, i) => {
    const [x, y] = pointAt(i, maxR + 8);
    doc.text(r.label.toUpperCase(), x, y, { align: "center" });
  });
}

/* ---------------------------------------------------------------
   GAUGE (yarım daire, 1-4 skala)
--------------------------------------------------------------- */
function drawGauge(doc, value, cx, cy, r, colorRgb) {
  const startAngle = 180;
  const endAngle = 360;
  const pct = Math.max(0, Math.min(1, (value - 1) / 3));
  const needleAngle = startAngle + pct * (endAngle - startAngle);
  const polar = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };
  const steps = 40;
  doc.setDrawColor(...GRID);
  doc.setLineWidth(3.2);
  for (let i = 0; i < steps; i++) {
    const a0 = startAngle + (i / steps) * (endAngle - startAngle);
    const a1 = startAngle + ((i + 1) / steps) * (endAngle - startAngle);
    const [x0, y0] = polar(a0, r);
    const [x1, y1] = polar(a1, r);
    doc.line(x0, y0, x1, y1);
  }
  const filledSteps = Math.round(steps * pct);
  doc.setDrawColor(...colorRgb);
  for (let i = 0; i < filledSteps; i++) {
    const a0 = startAngle + (i / steps) * (endAngle - startAngle);
    const a1 = startAngle + ((i + 1) / steps) * (endAngle - startAngle);
    const [x0, y0] = polar(a0, r);
    const [x1, y1] = polar(a1, r);
    doc.line(x0, y0, x1, y1);
  }
  const [nx, ny] = polar(needleAngle, r - 4);
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(1);
  doc.line(cx, cy, nx, ny);
  doc.setFillColor(...NAVY);
  doc.circle(cx, cy, 1.6, "F");

  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text(value.toFixed(1), cx, cy - 10, { align: "center" });
  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...STEEL);
  doc.text("/ 4.0", cx, cy - 5, { align: "center" });
}

/* ---------------------------------------------------------------
   ANA RAPOR ÜRETİCİ
--------------------------------------------------------------- */
export async function generateKobiPdfReport({
  companyName,
  sectorLabel,
  sizeLabel,
  results,
  overallAvg,
  overallLevel,
  levels,
  needStatements,
  tools,
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  await ensureFontsLoaded(doc);
  const logo = await loadLogoBase64();
  const levelColor = hexToRgb(levels[overallLevel].color);

  /* ================= SAYFA 1: KAPAK + GAUGE + RADAR ================= */
  drawHeaderBanner(doc, logo);
  let y = 28;

  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...STEEL);
  const dateStr = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
  doc.text(`Rapor Tarihi: ${dateStr}`, MARGIN, y);
  if (companyName) doc.text(`Firma: ${companyName}`, PAGE_W - MARGIN, y, { align: "right" });
  y += 8;

  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text(`Adaptasyon Seviyesi: ${levels[overallLevel].label}`, MARGIN, y);
  y += 5;
  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...STEEL);
  doc.text(`${sectorLabel || "-"}  ·  ${sizeLabel || "-"}`, MARGIN, y);
  y += 10;

  drawGauge(doc, overallAvg, MARGIN + 42, y + 40, 32, levelColor);
  drawRadar(doc, results, MARGIN + 128, y + 40, 34);
  y += 90;

  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("Fonksiyon Bazlı Skorlar", MARGIN, y);
  y += 6;

  results.forEach((r) => {
    doc.setFont("DejaVuSans", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...NAVY);
    doc.text(r.label, MARGIN, y);
    doc.setTextColor(...BLUE);
    doc.text(`${r.avg.toFixed(1)} / 4.0`, PAGE_W - MARGIN, y, { align: "right" });
    y += 2.5;
    doc.setFillColor(...GRID);
    doc.roundedRect(MARGIN, y, CONTENT_W, 2.4, 1, 1, "F");
    doc.setFillColor(...BLUE);
    doc.roundedRect(MARGIN, y, (CONTENT_W * (r.avg - 1)) / 3, 2.4, 1, 1, "F");
    y += 6.5;
  });

  /* ================= SAYFA 2: FONKSİYON DETAYLARI + ARAÇ ÖNERİLERİ ================= */
  doc.addPage();
  drawHeaderBanner(doc, logo);
  y = 28;

  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.text("Fonksiyon Bazlı Detaylı Analiz ve Araç Önerileri", MARGIN, y);
  y += 10;

  results.forEach((r) => {
    const toolsList = tools[r.id][r.level] || [];
    const needLines = doc.splitTextToSize(needStatements[r.id] || "", CONTENT_W - 10);
    const toolLines = toolsList.map((t) => ({
      name: t.name,
      whyLines: doc.splitTextToSize(t.why, CONTENT_W - 16),
    }));
    const toolsH = toolLines.reduce((sum, t) => sum + 4 + t.whyLines.length * 3.4 + 2, 0);
    const cardH = 14 + needLines.length * 3.8 + 4 + toolsH + 6;

    if (y + cardH > PAGE_H - 20) {
      doc.addPage();
      drawHeaderBanner(doc, logo);
      y = 28;
    }

    doc.setFillColor(...LIGHT_BG);
    doc.setDrawColor(...GRID);
    doc.roundedRect(MARGIN, y, CONTENT_W, cardH, 2, 2, "FD");
    doc.setFillColor(...BLUE);
    doc.rect(MARGIN, y, 2.5, cardH, "F");

    let iy = y + 6;
    doc.setFont("DejaVuSans", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...BLUE);
    doc.text(`${r.label}  ·  ${levels[r.level].label}  ·  ${r.avg.toFixed(1)} / 4.0`, MARGIN + 6, iy);
    iy += 5.5;

    doc.setFont("DejaVuSans", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(needLines, MARGIN + 6, iy);
    iy += needLines.length * 3.8 + 3;

    doc.setFont("DejaVuSans", "bold");
    doc.setFontSize(7.3);
    doc.setTextColor(...STEEL);
    doc.text("ÖNERİLEN YAPAY ZEKA ARAÇLARI", MARGIN + 6, iy);
    iy += 4;

    toolLines.forEach((t) => {
      doc.setFont("DejaVuSans", "bold");
      doc.setFontSize(7.8);
      doc.setTextColor(...BLUE);
      doc.text(`• ${t.name}`, MARGIN + 8, iy);
      iy += 3.6;
      doc.setFont("DejaVuSans", "normal");
      doc.setFontSize(7.3);
      doc.setTextColor(...STEEL);
      doc.text(t.whyLines, MARGIN + 11, iy);
      iy += t.whyLines.length * 3.4 + 2;
    });

    y += cardH + 6;
  });

  y += 2;
  if (y > PAGE_H - 40) {
    doc.addPage();
    drawHeaderBanner(doc, logo);
    y = 28;
  }

  doc.setFillColor(...NAVY);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 2, 2, "F");
  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(9);
  doc.setTextColor(96, 165, 250);
  doc.text("ÇORLU TSO PROJE SERVİSİ İLE İLETİŞİME GEÇİN", MARGIN + 5, y + 6);
  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(255, 255, 255);
  const calloutLines = doc.splitTextToSize(
    "Yapay zeka ve otomasyon yol haritanızı birlikte detaylandırmak için Odamız uzmanlarıyla iletişime geçebilirsiniz.",
    CONTENT_W - 10
  );
  doc.text(calloutLines, MARGIN + 5, y + 11.5);

  y += 28;
  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...STEEL);
  const disclaimer =
    "Bu araç bir öz-değerlendirme ve yönlendirme aracıdır; resmi denetim, sertifikasyon veya danışmanlık hizmetinin yerine geçmez. " +
    "Telif Hakkı © Çorlu Ticaret ve Sanayi Odası.";
  doc.text(doc.splitTextToSize(disclaimer, CONTENT_W), MARGIN, y);

  footer(doc);

  const safeName = (companyName || "firma").replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\- ]/g, "").trim() || "firma";
  doc.save(`corlu-tso-kobi-yz-rehberi-${safeName}.pdf`);
}
