// Dictionnaires de traduction déterministes (japonais → français / anglais).
// Couvrent les champs « structurés » qui ne changent jamais : jours, préfectures,
// pays, libellés d'horaires, mention « complet ». Le texte libre (salles, titres)
// passe par la traduction automatique + la couche d'overrides manuels.

export const DOW = {
  月: ['lun.', 'Mon'],
  火: ['mar.', 'Tue'],
  水: ['mer.', 'Wed'],
  木: ['jeu.', 'Thu'],
  金: ['ven.', 'Fri'],
  土: ['sam.', 'Sat'],
  日: ['dim.', 'Sun'],
};

// 47 préfectures japonaises (romaji standard Hepburn).
export const PREFECTURES = {
  北海道: 'Hokkaido',
  青森: 'Aomori',
  岩手: 'Iwate',
  宮城: 'Miyagi',
  秋田: 'Akita',
  山形: 'Yamagata',
  福島: 'Fukushima',
  茨城: 'Ibaraki',
  栃木: 'Tochigi',
  群馬: 'Gunma',
  埼玉: 'Saitama',
  千葉: 'Chiba',
  東京: 'Tokyo',
  神奈川: 'Kanagawa',
  新潟: 'Niigata',
  富山: 'Toyama',
  石川: 'Ishikawa',
  福井: 'Fukui',
  山梨: 'Yamanashi',
  長野: 'Nagano',
  岐阜: 'Gifu',
  静岡: 'Shizuoka',
  愛知: 'Aichi',
  三重: 'Mie',
  滋賀: 'Shiga',
  京都: 'Kyoto',
  大阪: 'Osaka',
  兵庫: 'Hyōgo',
  奈良: 'Nara',
  和歌山: 'Wakayama',
  鳥取: 'Tottori',
  島根: 'Shimane',
  岡山: 'Okayama',
  広島: 'Hiroshima',
  山口: 'Yamaguchi',
  徳島: 'Tokushima',
  香川: 'Kagawa',
  愛媛: 'Ehime',
  高知: 'Kochi',
  福岡: 'Fukuoka',
  佐賀: 'Saga',
  長崎: 'Nagasaki',
  熊本: 'Kumamoto',
  大分: 'Oita',
  宮崎: 'Miyazaki',
  鹿児島: 'Kagoshima',
  沖縄: 'Okinawa',
};

// Pays (FR / EN). Ajoutez-en au besoin.
export const COUNTRIES = {
  日本: ['Japon', 'Japan'],
  フィンランド: ['Finlande', 'Finland'],
  フランス: ['France', 'France'],
  イタリア: ['Italie', 'Italy'],
  ポルトガル: ['Portugal', 'Portugal'],
  ドイツ: ['Allemagne', 'Germany'],
  オーストリア: ['Autriche', 'Austria'],
  スイス: ['Suisse', 'Switzerland'],
  ベルギー: ['Belgique', 'Belgium'],
  オランダ: ['Pays-Bas', 'Netherlands'],
  スペイン: ['Espagne', 'Spain'],
  イギリス: ['Royaume-Uni', 'United Kingdom'],
  '南アフリカ': ['Afrique du Sud', 'South Africa'],
  '南アフリカ共和国': ['Afrique du Sud', 'South Africa'],
  アメリカ: ['États-Unis', 'United States'],
  カナダ: ['Canada', 'Canada'],
  韓国: ['Corée du Sud', 'South Korea'],
  中国: ['Chine', 'China'],
  台湾: ['Taïwan', 'Taiwan'],
};

// Villes étrangères fréquentes (FR / EN). Le reste passe par la traduction auto.
export const CITIES = {
  ヘルシンキ: ['Helsinki', 'Helsinki'],
  サンリス: ['Senlis', 'Senlis'],
  パリ: ['Paris', 'Paris'],
  ロンドン: ['Londres', 'London'],
  ベルリン: ['Berlin', 'Berlin'],
  ウィーン: ['Vienne', 'Vienna'],
  ブリュッセル: ['Bruxelles', 'Brussels'],
  ヨハネスブルグ: ['Johannesburg', 'Johannesburg'],
  ヨハネスブルク: ['Johannesburg', 'Johannesburg'],
  ダーバン: ['Durban', 'Durban'],
  'マルケ州': ['Marches', 'Marche'],
};

// Étiquettes d'horaires.
export const TIME_LABELS = {
  開場: ['Ouverture', 'Doors'],
  開演: ['', ''], // l'heure de début s'affiche sans préfixe
};

export const SOLD_OUT = ['Complet', 'Sold out'];

// langIndex : 0 = FR, 1 = EN
export function translateDow(dowJa, langIndex) {
  const e = DOW[dowJa];
  return e ? e[langIndex] : '';
}

// Traduit le bloc « lieu » (.area). Renvoie { fr, en } ou null si inconnu.
export function translateArea(areaJa, { translateText } = {}) {
  const raw = (areaJa || '').trim();
  if (!raw) return { fr: '', en: '' };

  // Préfecture japonaise simple → « Romaji, Japon / Japan »
  if (PREFECTURES[raw]) {
    return { fr: `${PREFECTURES[raw]}, Japon`, en: `${PREFECTURES[raw]}, Japan` };
  }

  // Format « Ville、Pays » (séparateur idéographique 、 ou ，).
  const parts = raw.split(/[、，]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 2) {
    const [cityJa, countryJa] = parts;
    const city = CITIES[cityJa];
    const country = COUNTRIES[countryJa];
    const cityFr = city ? city[0] : translateText ? translateText(cityJa, 'fr') : cityJa;
    const cityEn = city ? city[1] : translateText ? translateText(cityJa, 'en') : cityJa;
    const countryFr = country ? country[0] : translateText ? translateText(countryJa, 'fr') : countryJa;
    const countryEn = country ? country[1] : translateText ? translateText(countryJa, 'en') : countryJa;
    return { fr: `${cityFr}, ${countryFr}`, en: `${cityEn}, ${countryEn}` };
  }

  // Pays seul (ex. ポルトガル).
  if (COUNTRIES[raw]) {
    return { fr: COUNTRIES[raw][0], en: COUNTRIES[raw][1] };
  }
  // Format « Région（Pays） » (ex. マルケ州（イタリア）).
  const paren = raw.match(/^(.+?)[（(](.+?)[）)]$/);
  if (paren) {
    const region = CITIES[paren[1].trim()] || null;
    const country = COUNTRIES[paren[2].trim()] || null;
    const regFr = region ? region[0] : translateText ? translateText(paren[1].trim(), 'fr') : paren[1].trim();
    const regEn = region ? region[1] : translateText ? translateText(paren[1].trim(), 'en') : paren[1].trim();
    const couFr = country ? country[0] : paren[2].trim();
    const couEn = country ? country[1] : paren[2].trim();
    return { fr: `${regFr}, ${couFr}`, en: `${regEn}, ${couEn}` };
  }

  // Inconnu → traduction auto si dispo, sinon texte brut.
  return {
    fr: translateText ? translateText(raw, 'fr') : raw,
    en: translateText ? translateText(raw, 'en') : raw,
  };
}

// Met en forme la chaîne d'horaires depuis .start (ex. « 18:30 開場19:00 開演 »).
export function formatTimes(startJa, langIndex) {
  const raw = (startJa || '').trim();
  if (!raw) return '';
  const out = [];
  const doors = raw.match(/(\d{1,2}:\d{2})\s*開場/);
  const start = raw.match(/(\d{1,2}:\d{2})\s*開演/);
  if (doors) out.push(`${TIME_LABELS['開場'][langIndex]} ${doors[1].replace(':', 'h')}`.trim());
  if (start) out.push(`${start[1].replace(':', 'h')}`);
  if (!doors && !start) {
    // Heure sans étiquette reconnue : on garde les heures détectées telles quelles.
    const times = raw.match(/\d{1,2}:\d{2}/g);
    if (times) out.push(times.map((t) => t.replace(':', 'h')).join(' · '));
  }
  return out.join(' · ');
}
