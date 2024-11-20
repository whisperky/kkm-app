import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

function _presets() {
  const shapes = ["circle", "ellipse"];
  const pos = {
    c: "center",
    t: "top",
    b: "bottom",
    l: "left",
    r: "right",
    tl: "top left",
    tr: "top right",
    bl: "bottom left",
    br: "bottom right",
  };
  const result: Record<string, string> = {};
  for (const shape of shapes)
    for (const [posName, posValue] of Object.entries(pos))
      result[`${shape}-${posName}`] = `${shape} at ${posValue}`;

  return result;
}

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        "made-tommy": [
          "var(--font-made-tommy-soft)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
        ],
        "bumper-sticker": [
          "var(--font-bumper-sticker)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        dark: "#50220A",
        "copper-tan": "#C98F5D",
        wheat: "#F3E0C5",
        "golden-brown": "#5F3F57",
        "golden-bright": "#E6CDB1",
        sunshine: "#EDC499",
        copper: "#CD8258",
        green: "#24BE62",
        purple: "#A291FF",
        pink: "#FF5C97",
        "light-tan": "#E3BEAA",
        "light-orange": "#FCEAD0",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideAndSettle: {
          "0%": { transform: "translateY(6dvh)", opacity: "0" },
          "50%": { transform: "translateY(-3dvh)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-and-settle": "slideAndSettle 1.5s ease-out forwards",
        "fade-in-custom": "fadeIn 2s ease-in forwards",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "max-xs": { max: "474px" },
        "max-sm": { max: "639px" },
        "max-md": { max: "767px" },
        "max-lg": { max: "1023px" },
        "max-xl": { max: "1279px" },
        "max-2xl": { max: "1535px" },
        "sm-h": { raw: "(max-height: 700px)" },
        "md-h": { raw: "(max-height: 800px)" },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-custom": {
          textShadow: `1.5px 0 0 #224A6E, 
            1.5px 1.5px 0 #224A6E, 
            0 1.5px 0 #224A6E, 
            -1.5px 1.5px 0 #224A6E, 
            -1.5px 0 0 #224A6E, 
            -1.5px -1.5px 0 #224A6E, 
            0 -1.5px 0 #224A6E,
            1.5px -1.5px 0 #224A6E`,
        },
      });
    }),
    plugin(
      function ({ matchUtilities, theme }) {
        matchUtilities(
          {
            "bg-radient": (value) => ({
              "background-image": `radial-gradient(${value},var(--tw-gradient-stops))`,
            }),
          },
          { values: theme("radialGradients") }
        );
      },
      { theme: { radialGradients: _presets() } }
    ),
  ],
};

export default config;
