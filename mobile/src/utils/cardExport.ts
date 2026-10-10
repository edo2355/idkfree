import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import QRCode from 'qrcode';

/**
 * Convierte un payload en SVG string para el PDF.
 */
async function qrToSvg(payload: string, size: number = 200): Promise<string> {
  return await QRCode.toString(payload, {
    type: 'svg',
    margin: 1,
    width: size,
    color: { dark: '#050505', light: '#FFFFFF' },
  });
}

/**
 * Genera el HTML del carnet A6 para imprimir.
 */
export async function buildCardHtml(card: any): Promise<string> {
  const qrPanic = card.qrPayloads.panic ? await qrToSvg(card.qrPayloads.panic) : '<p>N/A</p>';
  const qrRestore = card.qrPayloads.restore ? await qrToSvg(card.qrPayloads.restore) : '<p>N/A</p>';
  const qrFenix = card.qrPayloads.fenix ? await qrToSvg(card.qrPayloads.fenix) : '<p>N/A</p>';

  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' · ');
  const name = (card.name ?? card.alias).toUpperCase();
  const initial = (card.name ?? card.alias).charAt(0).toUpperCase();
  const photoHtml = card.avatar_url
    ? `<img src="${card.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" />`
    : `<div style="font-family:'Playfair Display',serif;font-size:72px;font-style:italic;color:#FFFFFF;display:flex;align-items:center;justify-content:center;height:100%;">${initial}</div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: 105mm 148mm; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { margin: 0; padding: 0; background: #050505; font-family: -apple-system, 'Space Grotesk', sans-serif; }
    .card {
      width: 105mm; height: 148mm; background: #050505; color: #FFFFFF;
      padding: 8mm 7mm; display: flex; flex-direction: column;
    }
    .top-bar { display: flex; justify-content: space-between; align-items: center; font-size: 7pt; letter-spacing: 1.5px; margin-bottom: 3mm; }
    .top-bar .dot { color: #FFFFFF; }
    .top-bar .sys { color: #A3A3A3; }
    .divider { height: 1px; background: #262626; margin-bottom: 5mm; }
    .photo-wrap { position: relative; width: 55mm; height: 55mm; margin: 0 auto 4mm; }
    .corner { position: absolute; width: 5mm; height: 5mm; border-color: #FFFFFF; }
    .corner.tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
    .corner.tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
    .corner.bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
    .corner.br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }
    .rec { position: absolute; top: 1.5mm; right: 2mm; width: 1.5mm; height: 1.5mm; border-radius: 50%; background: #EF4444; z-index: 2; }
    .photo { margin: 1.5mm; height: calc(100% - 3mm); background: #0F0F0F; border-radius: 1mm; overflow: hidden; }
    .identity { text-align: center; margin-bottom: 4mm; }
    .name { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 14pt; letter-spacing: 0.5px; margin: 0 0 1mm; }
    .alias { font-size: 10pt; color: #FFFFFF; margin: 0 0 1mm; letter-spacing: 0.5px; }
    .cardid { font-size: 8pt; color: #666; letter-spacing: 2px; margin: 0; font-family: monospace; }
    .qr-row { display: flex; justify-content: space-between; gap: 2mm; margin-bottom: 3mm; }
    .qr-block { flex: 1; text-align: center; }
    .qr-index { font-size: 7pt; letter-spacing: 2px; color: #FFFFFF; margin: 0 0 1.5mm; font-family: monospace; }
    .qr-code { background: #FFFFFF; padding: 1.5mm; border-radius: 1.5mm; display: inline-block; }
    .qr-code svg { width: 26mm; height: 26mm; display: block; }
    .bottom-bar { display: flex; justify-content: space-between; align-items: center; font-size: 6pt; letter-spacing: 1px; margin-top: auto; padding-top: 3mm; border-top: 1px solid #262626; color: #A3A3A3; font-family: monospace; }
    .bottom-bar .active { color: #22C55E; }
    .tagline { text-align: center; font-size: 6pt; letter-spacing: 3px; color: #5F5F5F; margin-top: 3mm; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="top-bar">
      <span class="dot">● IDKFREE</span>
      <span class="sys">[SYS.OK]</span>
    </div>
    <div class="divider"></div>

    <div class="photo-wrap">
      <div class="corner tl"></div>
      <div class="corner tr"></div>
      <div class="corner bl"></div>
      <div class="corner br"></div>
      <div class="rec"></div>
      <div class="photo">${photoHtml}</div>
    </div>

    <div class="identity">
      <p class="name">${name}</p>
      <p class="alias">@${card.alias}</p>
      <p class="cardid">${card.cardIdShort}</p>
    </div>

    <div class="divider"></div>

    <div class="qr-row">
      <div class="qr-block">
        <p class="qr-index">[01] PÁNICO</p>
        <div class="qr-code">${qrPanic}</div>
      </div>
      <div class="qr-block">
        <p class="qr-index">[02] RESTAB.</p>
        <div class="qr-code">${qrRestore}</div>
      </div>
      <div class="qr-block">
        <p class="qr-index">[03] FÉNIX</p>
        <div class="qr-code">${qrFenix}</div>
      </div>
    </div>

    <div class="bottom-bar">
      <span>${timestamp}</span>
      <span class="active">▓▓▓▓▓▓▓▓▓░░░ ACTIVE</span>
    </div>
    <div class="tagline">"MÁS QUE UNA PREGUNTA"</div>
  </div>
</body>
</html>`;
}

/**
 * Exporta el carnet como PDF A6 y lo comparte.
 */
export async function exportCardAsPDF(card: any): Promise<void> {
  const html = await buildCardHtml(card);
  const { uri } = await Print.printToFileAsync({ html, width: 595, height: 842 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartir carnet IDKFREE',
      UTI: 'com.adobe.pdf',
    });
  }
}

/**
 * Guarda un archivo (por uri) en la galería.
 */
export async function saveImageToGallery(uri: string): Promise<void> {
  const perm = await MediaLibrary.requestPermissionsAsync();
  if (!perm.granted) throw new Error('PERMISSION_DENIED');
  await MediaLibrary.saveToLibraryAsync(uri);
}
