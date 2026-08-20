// Liste les concerts sans override (donc affichés en japonais faute de clé MT).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { scrapeUpcoming, scrapePast } from './scrape.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const overrides = JSON.parse(readFileSync(resolve(__dirname, 'overrides.json'), 'utf-8'));

const [upcoming, past] = await Promise.all([scrapeUpcoming(), scrapePast()]);
for (const [label, items] of [['À VENIR', upcoming], ['PASSÉS', past]]) {
  console.log(`\n===== ${label} =====`);
  for (const it of items) {
    if (overrides[it.id]) continue;
    console.log(`--- id ${it.id} | ${it.date}`);
    console.log(`    area : ${it.areaJa}`);
    console.log(`    hall : ${it.hallJa}`);
    console.log(`    start: ${it.startJa}`);
    console.log(`    title: ${it.titleJa}`);
  }
}
