/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10233f",
        mist: "#f5f7fb",
        panel: "#ffffff",
        line: "#d9e2ef",
        accent: {
          DEFAULT: "#1565d8",
          soft: "#e7f0ff",
          deep: "#0b4eb5",
        },
        success: {
          DEFAULT: "#0f9f6e",
          soft: "#dff8ee",
        },
        warning: {
          DEFAULT: "#c87d10",
          soft: "#fff1db",
        },
        danger: {
          DEFAULT: "#d14343",
          soft: "#ffe5e5",
        },
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        panel: "0 18px 50px rgba(16, 35, 63, 0.08)",
        soft: "0 10px 30px rgba(16, 35, 63, 0.06)",
      },
      backgroundImage: {
        wash:
          "radial-gradient(circle at top left, rgba(21, 101, 216, 0.08), transparent 35%), radial-gradient(circle at top right, rgba(15, 159, 110, 0.08), transparent 30%), linear-gradient(180deg, #f8fbff 0%, #f3f6fb 55%, #eef3f9 100%)",
      },
    },
  },
  plugins: [],
};
