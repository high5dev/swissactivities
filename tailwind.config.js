module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
    "./helpers/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        booking: "513px",
      },
      colors: {
        dark: "#eb002a",
        primary: "#ff385c",
        medium: "#ff859b",
        light: "#fff5f7",
        blue: "#002F49",
      },
      fontSize: {
        sm: [
          "14px",
          {
            lineHeight: "20px",
          },
        ],
      },
    },
    customForms: (theme) => ({
      default: {
        input: {
          "&:focus": {
            boxShadow: undefined,
            borderColor: undefined,
          },
        },
      },
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
  corePlugins: {
    preflight: false,
  },
};
