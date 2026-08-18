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

/* Paleta neutral do shadcn — escala de cinza pura, sem matiz.
   Equivale aos tokens que o `shadcn init` gera com base color "neutral":
   background oklch(0.145 0 0), card oklch(0.205 0 0), muted-foreground oklch(0.708 0 0). */
export const THEMES = {
  dark: {
    bg: "#0A0A0A", // neutral-950
    card: "#0A0A0A",
    cardAlt: "#171717", // neutral-900
    border: "#262626", // neutral-800
    text: "#FAFAFA", // neutral-50
    muted: "#A3A3A3", // neutral-400
    gradFrom: "#FAFAFA",
    gradTo: "#A3A3A3",
    glow: "#FFFFFF",
    gridOpacity: 0.6,
    blobOpacity: 0.06,
    /* Rampa de cinzas para o gráfico de linguagens. */
    ramp: ["#FAFAFA", "#D4D4D4", "#A3A3A3", "#737373", "#525252", "#404040"],
  },
  light: {
    bg: "#FFFFFF",
    card: "#FFFFFF",
    cardAlt: "#F5F5F5", // neutral-100
    border: "#E5E5E5", // neutral-200
    text: "#0A0A0A",
    muted: "#737373", // neutral-500
    gradFrom: "#0A0A0A",
    gradTo: "#525252",
    glow: "#000000",
    gridOpacity: 0.9,
    blobOpacity: 0.05,
    ramp: ["#171717", "#404040", "#737373", "#A3A3A3", "#D4D4D4", "#E5E5E5"],
  },
};

export const FONT =
  "ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
export const MONO =
  "ui-monospace,'Cascadia Code','JetBrains Mono','SF Mono',Consolas,'Liberation Mono',monospace";

export const WIDTH = 860;
