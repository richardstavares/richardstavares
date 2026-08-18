/* ============================================================
   Gera os cards SVG do perfil (tema claro e escuro) em assets/.
   Uso: node scripts/generate.mjs
   ============================================================ */

import { mkdir, writeFile } from "node:fs/promises";
import { PROFILE, THEMES, LANG_COLORS, FONT, MONO, WIDTH } from "../profile.config.mjs";

const OUT = new URL("../assets/", import.meta.url);

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

/* Largura aproximada de um texto — suficiente para dimensionar chips e pílulas. */
const textWidth = (s, size, bold = false) => s.length * size * (bold ? 0.58 : 0.54);

/* ---------- Dados do GitHub (API pública, sem token) ---------- */
async function fetchStats(user) {
  const headers = { "User-Agent": "profile-card-generator" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [u, r] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, { headers }),
    ]);
    if (!u.ok || !r.ok) throw new Error(`GitHub respondeu ${u.status}/${r.status}`);

    const profile = await u.json();
    const repos = (await r.json()).filter((x) => !x.fork && !x.archived);

    const bytes = {};
    for (const repo of repos) {
      if (repo.language) bytes[repo.language] = (bytes[repo.language] || 0) + (repo.size || 1);
    }
    const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
    const langs = Object.entries(bytes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, size]) => ({ name, pct: (size / total) * 100 }));

    return {
      repos: profile.public_repos ?? repos.length,
      stars: repos.reduce((s, x) => s + (x.stargazers_count || 0), 0),
      followers: profile.followers ?? 0,
      langCount: new Set(repos.map((x) => x.language).filter(Boolean)).size,
      langs,
      ok: true,
    };
  } catch (err) {
    console.warn(`  ! API indisponível (${err.message}) — gerando com zeros`);
    return { repos: 0, stars: 0, followers: 0, langCount: 0, langs: [], ok: false };
  }
}

/* ---------- Peças reutilizáveis ---------- */

/* Moldura de card no estilo shadcn: borda de 1px, cantos arredondados. */
const card = (t, { x = 0.5, y = 0.5, w = WIDTH - 1, h, r = 12, fill = t.card }) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${t.border}"/>`;

/* Fundo decorativo do hero: grid + dois blobs, igual ao portfólio. */
const heroBackdrop = (t, w, h) => `
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="${t.border}" stroke-width="1" opacity="${t.gridOpacity}"/>
    </pattern>
    <radialGradient id="blobA" cx="50%" cy="50%">
      <stop offset="0%" stop-color="${t.a1}" stop-opacity="${t.blobOpacity}"/>
      <stop offset="100%" stop-color="${t.a1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blobB" cx="50%" cy="50%">
      <stop offset="0%" stop-color="${t.a2}" stop-opacity="${t.blobOpacity * 0.8}"/>
      <stop offset="100%" stop-color="${t.a2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.a3}"/>
      <stop offset="45%" stop-color="${t.a1}"/>
      <stop offset="100%" stop-color="${t.a2}"/>
    </linearGradient>
    <clipPath id="heroClip"><rect x="0.5" y="0.5" width="${w - 1}" height="${h}" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#heroClip)">
    <rect width="${w}" height="${h + 1}" fill="url(#grid)"/>
    <circle cx="${w - 90}" cy="20" r="190" fill="url(#blobA)"/>
    <circle cx="${w - 210}" cy="${h}" r="150" fill="url(#blobB)"/>
  </g>`;

/* Pílula estilo Badge do shadcn. */
function pill(t, { x, y, label, accent = false, mono = false, dot = null }) {
  const size = 12;
  const padX = 11;
  const dotW = dot ? 14 : 0;
  const w = textWidth(label, size) + padX * 2 + dotW;
  const h = 24;
  const fg = accent ? t.a2 : t.muted;
  const dotEl = dot
    ? `<circle cx="${x + padX + 4}" cy="${y + h / 2}" r="4" fill="${dot}">
         <animate attributeName="opacity" values="1;0.35;1" dur="2.4s" repeatCount="indefinite"/>
       </circle>`
    : "";
  return {
    w,
    svg: `<g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${t.cardAlt}" stroke="${t.border}"/>
      ${dotEl}
      <text x="${x + padX + dotW}" y="${y + 16.5}" font-family="${mono ? MONO : FONT}" font-size="${size}" fill="${fg}">${esc(label)}</text>
    </g>`,
  };
}

/* ---------- Cards ---------- */

function heroCard(t) {
  const h = 208;
  const pills = [];
  let px = 32;
  if (PROFILE.available) {
    const p = pill(t, { x: px, y: 150, label: PROFILE.availableLabel, dot: "#3FB950", mono: true });
    pills.push(p.svg);
    px += p.w + 8;
  }
  for (const label of ["Next.js", "shadcn/ui", "TypeScript"]) {
    const p = pill(t, { x: px, y: 150, label, accent: true });
    pills.push(p.svg);
    px += p.w + 8;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${h + 1}" viewBox="0 0 ${WIDTH} ${h + 1}" role="img" aria-label="${esc(PROFILE.name)} — ${esc(PROFILE.role)}">
  ${heroBackdrop(t, WIDTH, h)}
  ${card(t, { h, fill: "none" })}
  <text x="32" y="62" font-family="${MONO}" font-size="13" fill="${t.a2}" letter-spacing="1.6">${esc(PROFILE.role.toUpperCase())}</text>
  <text x="32" y="108" font-family="${FONT}" font-size="40" font-weight="700" fill="url(#brand)">${esc(PROFILE.name)}</text>
  <text x="32" y="134" font-family="${MONO}" font-size="14" fill="${t.muted}">${esc(PROFILE.tagline)}</text>
  ${pills.join("\n  ")}
</svg>`;
}

function statsCard(t, stats) {
  const h = 104;
  const tiles = [
    { label: "REPOSITÓRIOS", value: stats.repos },
    { label: "STARS", value: stats.stars },
    { label: "SEGUIDORES", value: stats.followers },
    { label: "LINGUAGENS", value: stats.langCount },
  ];
  const gap = 12;
  const tw = (WIDTH - gap * (tiles.length - 1)) / tiles.length;

  const body = tiles
    .map((tile, i) => {
      const x = i * (tw + gap);
      return `<g>
      <rect x="${x + 0.5}" y="0.5" width="${tw - 1}" height="${h}" rx="12" fill="${t.card}" stroke="${t.border}"/>
      <text x="${x + tw / 2}" y="52" text-anchor="middle" font-family="${MONO}" font-size="30" font-weight="600" fill="url(#brand2)">${tile.value}</text>
      <text x="${x + tw / 2}" y="76" text-anchor="middle" font-family="${FONT}" font-size="11" letter-spacing="1" fill="${t.muted}">${tile.label}</text>
    </g>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${h + 1}" viewBox="0 0 ${WIDTH} ${h + 1}" role="img" aria-label="Estatísticas do GitHub">
  <defs><linearGradient id="brand2" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${t.a1}"/><stop offset="100%" stop-color="${t.a2}"/>
  </linearGradient></defs>
  ${body}
</svg>`;
}

function stackCard(t) {
  const padX = 24;
  const rows = [];
  let y = 30;

  for (const group of PROFILE.stack) {
    rows.push(
      `<text x="${padX}" y="${y}" font-family="${MONO}" font-size="12" letter-spacing="1.2" fill="${t.a2}">${esc(group.group.toUpperCase())}</text>`,
    );
    y += 16;

    let x = padX;
    for (const item of group.items) {
      const p = pill(t, { x, y, label: item });
      if (x + p.w > WIDTH - padX) {
        x = padX;
        y += 32;
        rows.push(pill(t, { x, y, label: item }).svg);
        x += p.w + 8;
      } else {
        rows.push(p.svg);
        x += p.w + 8;
      }
    }
    y += 56;
  }

  const h = y - 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${h + 1}" viewBox="0 0 ${WIDTH} ${h + 1}" role="img" aria-label="Stack">
  ${card(t, { h })}
  ${rows.join("\n  ")}
</svg>`;
}

function langsCard(t, stats) {
  const padX = 24;
  const h = stats.langs.length ? 118 : 78;
  const barY = 52;
  const barW = WIDTH - padX * 2;

  if (!stats.langs.length) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${h + 1}" viewBox="0 0 ${WIDTH} ${h + 1}" role="img" aria-label="Linguagens">
  ${card(t, { h })}
  <text x="${padX}" y="32" font-family="${MONO}" font-size="12" letter-spacing="1.2" fill="${t.a2}">LINGUAGENS</text>
  <text x="${padX}" y="58" font-family="${FONT}" font-size="13" fill="${t.muted}">Sem repositórios públicos suficientes para calcular.</text>
</svg>`;
  }

  let offset = 0;
  const segments = stats.langs
    .map((l, i) => {
      const w = (l.pct / 100) * barW;
      const color = LANG_COLORS[l.name] || t.a1;
      const first = i === 0;
      const last = i === stats.langs.length - 1;
      const r = first || last ? 5 : 0;
      const seg = `<rect x="${padX + offset}" y="${barY}" width="${Math.max(w, 2)}" height="10" rx="${r}" fill="${color}"/>`;
      offset += w;
      return seg;
    })
    .join("\n  ");

  let lx = padX;
  const legend = stats.langs
    .map((l) => {
      const label = `${l.name} ${l.pct.toFixed(1)}%`;
      const color = LANG_COLORS[l.name] || t.a1;
      const item = `<g>
      <circle cx="${lx + 5}" cy="${barY + 40}" r="5" fill="${color}"/>
      <text x="${lx + 16}" y="${barY + 44}" font-family="${FONT}" font-size="12" fill="${t.muted}">${esc(label)}</text>
    </g>`;
      lx += textWidth(label, 12) + 34;
      return item;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${h + 1}" viewBox="0 0 ${WIDTH} ${h + 1}" role="img" aria-label="Linguagens mais usadas">
  ${card(t, { h })}
  <text x="${padX}" y="32" font-family="${MONO}" font-size="12" letter-spacing="1.2" fill="${t.a2}">LINGUAGENS</text>
  <rect x="${padX}" y="${barY}" width="${barW}" height="10" rx="5" fill="${t.cardAlt}"/>
  ${segments}
  ${legend}
</svg>`;
}

/* ---------- Execução ---------- */
const stats = await fetchStats(PROFILE.github);
await mkdir(OUT, { recursive: true });

const cards = { hero: heroCard, stats: (t) => statsCard(t, stats), stack: stackCard, langs: (t) => langsCard(t, stats) };

for (const [name, build] of Object.entries(cards)) {
  for (const [theme, tokens] of Object.entries(THEMES)) {
    const file = new URL(`${name}-${theme}.svg`, OUT);
    await writeFile(file, build(tokens), "utf8");
    console.log(`  ✓ assets/${name}-${theme}.svg`);
  }
}

console.log(
  `\nStats: ${stats.repos} repos · ${stats.stars} stars · ${stats.followers} seguidores · ${stats.langs.length} linguagens${stats.ok ? "" : " (API indisponível)"}`,
);
