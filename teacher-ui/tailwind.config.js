/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "sidebar-bg": "#1E1E2E",
        "sidebar-text": "#A0A0B0",
        "sidebar-active": "#6366F1",
        "page-bg": "#F4F5FA",
        "card-bg": "#FFFFFF",
        "primary": "#6366F1",
        "primary-hover": "#4F46E5",
        "sent-bubble": "#6366F1",
        "received-bubble": "#FFFFFF",
        "online-dot": "#22C55E",
        "unread-badge": "#6366F1",
        "easy-badge-bg": "#22C55E",
        "medium-badge-bg": "#F59E0B",
        "hard-badge-bg": "#EF4444",
        "border-divider": "#E5E7EB",
        "shadow": "rgba(0,0,0,0.07)",
      },
    },
  },
  plugins: [],
};
