/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#8B5CF6",
      },
      fontFamily: {
        sans: ["Inter var", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.5) rotate(-4deg)", opacity: "0" },
          "70%": { transform: "scale(1.1) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(28px)", opacity: "0" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
        wiggle: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-7deg) scale(1.1)" },
          "75%": { transform: "rotate(7deg) scale(1.1)" },
          "100%": { transform: "rotate(0deg) scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-8px)" },
          "30%": { transform: "translateX(8px)" },
          "45%": { transform: "translateX(-5px)" },
          "60%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-2px)" },
          "90%": { transform: "translateX(2px)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.35)", opacity: "1" },
          "80%": { transform: "scale(0.85)" },
          "100%": { transform: "scale(1)" },
        },
        "star-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.3)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "pop-in": "pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "slide-up": "slide-up 0.5s ease both",
        wiggle: "wiggle 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        shake: "shake 0.5s ease both",
        "bounce-in": "bounce-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "star-spin": "star-spin 6s linear infinite",
      },
    },
  },
  plugins: [],
};
