/* ============================================================
   Conteúdo e design tokens dos cards do perfil.
   Edite aqui — depois rode `npm run build` para regerar os SVGs.
   ============================================================ */

export const PROFILE = {
  github: "richardstavares",
  name: "Richard Tavares",
  role: "Infraestrutura & Desenvolvimento Web",
  tagline: "Automatizo o que não deveria ser feito na mão.",
  available: true,
  availableLabel: "disponível para novos projetos",

  stack: [
    {
      group: "Desenvolvimento",
      items: ["TypeScript", "Next.js", "React", "Tailwind", "shadcn/ui", "Node.js", "HTML & CSS"],
    },
    {
      group: "Infra & Automação",
      items: ["PowerShell", "Python", "Docker", "Linux", "Windows Server", "Redes", "Git"],
    },
  ],
};

/* Paleta alinhada ao portfólio, mas com os fundos do próprio GitHub
   para o card encostar na página sem emendar. */
export const THEMES = {
  dark: {
    bg: "#0D1117",
    card: "#0D1117",
    cardAlt: "#161B22",
    border: "#30363D",
    text: "#E6EDF3",
    muted: "#8B949E",
    a1: "#8B6CFF",
    a2: "#22D3EE",
    a3: "#F472B6",
    gridOpacity: 0.5,
    blobOpacity: 0.22,
  },
  light: {
    bg: "#FFFFFF",
    card: "#FFFFFF",
    cardAlt: "#F6F8FA",
    border: "#D1D9E0",
    text: "#1F2328",
    muted: "#59636E",
    a1: "#6D3FFF",
    a2: "#0891B2",
    a3: "#DB2777",
    gridOpacity: 0.6,
    blobOpacity: 0.12,
  },
};

/* Cores oficiais do linguist, para o card de linguagens. */
export const LANG_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  PowerShell: "#012456",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dockerfile: "#384d54",
  Vue: "#41b883",
  Go: "#00ADD8",
  Java: "#b07219",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Rust: "#dea584",
  SCSS: "#c6538c",
};

export const FONT =
  "ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
export const MONO =
  "ui-monospace,'Cascadia Code','JetBrains Mono','SF Mono',Consolas,'Liberation Mono',monospace";

export const WIDTH = 860;
