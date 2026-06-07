// Récupère et analyse les concerts depuis le site japonais officiel (WordPress).
// Source unique de vérité : https://keigomukawa.com
//
// Deux pages :
//   - /concert/          → concerts à venir (page unique)
//   - /concert-archive/  → concerts passés (paginé : /concert-archive/page/N/)
//
// Le balisage WordPress est très régulier ; chaque concert est un <li> contenant :
//   .concert-databox  → .y-cnt (année) .md-cnt (MM/JJ) .week-cnt ((曜日))
//   .concert-detailbox → .area (lieu) .hall (salle) .start (horaires)
//                        .soldout (présent si complet)
//                        .concert-title > a[href=".../concert/<id>/"] (titre + ID stable)

const BASE = 'https://keigomukawa.com';
const UA =
  'Mozilla/5.0 (compatible; KeigoMukawaSiteBot/1.0; +https://keigomukawa.com/concert/)';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'ja' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  return res.text();
}

function stripTags(s) {
  return (s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pick(block, cls) {
  // Récupère le contenu textuel du premier <div class="cls">…</div>
  const re = new RegExp(`<div class="${cls}">([\\s\\S]*?)</div>`, 'i');
  const m = block.match(re);
  return m ? m[1] : '';
}

// Découpe la page en blocs <li>…</li> qui contiennent un concert.
function splitItems(html) {
  const items = [];
  const liRe = /<li>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = liRe.exec(html))) {
    if (/concert-databox/.test(m[1])) items.push(m[1]);
  }
  return items;
}

function parseItem(block) {
  const titleM = block.match(
    /<div class="concert-title">\s*<a href="[^"]*\/concert\/(\d+)\/?"[^>]*>([\s\S]*?)<\/a>/i
  );
  const id = titleM ? titleM[1] : null;
  const titleJa = titleM ? stripTags(titleM[2]) : '';

  const year = stripTags(pick(block, 'y-cnt'));
  const md = stripTags(pick(block, 'md-cnt')); // "MM/JJ"
  const weekRaw = stripTags(pick(block, 'week-cnt')); // "(曜日)"
  const dowJa = weekRaw.replace(/[()（）]/g, '').trim();
  const area = stripTags(pick(block, 'area'));
  const hall = stripTags(pick(block, 'hall'));
  const start = stripTags(pick(block, 'start'));
  const soldOut = /class="soldout"/i.test(block);

  const mdM = md.match(/(\d{1,2})\/(\d{1,2})/);
  if (!year || !mdM) return null;
  const mm = mdM[1].padStart(2, '0');
  const dd = mdM[2].padStart(2, '0');

  return {
    id, // ID WordPress stable, sert de clé d'override
    year,
    mm,
    dd,
    date: `${dd}.${mm}.${year}`, // format identique à concerts-data.js
    dayNum: dd,
    dowJa, // 月火水木金土日
    areaJa: area,
    hallJa: hall,
    startJa: start,
    titleJa,
    soldOut,
  };
}

async function scrapePage(url) {
  const html = await fetchHtml(url);
  return splitItems(html).map(parseItem).filter(Boolean);
}

export async function scrapeUpcoming() {
  return scrapePage(`${BASE}/concert/`);
}

export async function scrapePast({ maxPages = 30 } = {}) {
  const all = [];
  const seen = new Set();
  for (let page = 1; page <= maxPages; page++) {
    const url = page === 1 ? `${BASE}/concert-archive/` : `${BASE}/concert-archive/page/${page}/`;
    let items;
    try {
      items = await scrapePage(url);
    } catch (err) {
      // 404 = on a dépassé la dernière page → on s'arrête.
      if (/HTTP 404/.test(String(err))) break;
      throw err;
    }
    if (!items.length) break;
    let added = 0;
    for (const it of items) {
      const key = it.id || `${it.date}|${it.hallJa}`;
      if (seen.has(key)) continue;
      seen.add(key);
      all.push(it);
      added++;
    }
    // Si la page n'apporte aucun nouvel élément, on a bouclé : stop.
    if (added === 0) break;
  }
  return all;
}

export async function scrapeAll() {
  const [upcoming, past] = await Promise.all([scrapeUpcoming(), scrapePast()]);
  return { upcoming, past };
}
