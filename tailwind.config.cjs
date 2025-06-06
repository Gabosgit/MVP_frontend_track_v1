/** @type {import('tailwindcss').Config} */
console.log("Tailwind config is being loaded!"); // Add this line
module.exports = {
  darkMode: 'class', // Make sure this is set for manual dark mode toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Example purple start/end
        'custom-purple-start': '#8A2BE2', 
        'custom-purple-end': '#4B0082',
        //'custom-purple-start': '#667eea',
        //'custom-purple-end': '#764ba2',
        'dark-purple-end':  '#dbaaff',
        'dark-purple-start':  '#8a0bff',

        //Background Components
        'dark-card': '#000f32',
        //'dark-card': 'rgba(20, 20, 30, 0.9)', // Used for the form card

        //Background Start/End
        'light-bg-start': '#f8f9ff', 
        'light-bg-end': 'rgb(147,130,173)',
        'dark-bg-start': '#3d006a',
        'dark-bg-end': '#050009',
        //'dark-bg-start': '#334775',
        //'dark-bg-end': '#3b2551',

        // Specific dark mode colors
        'dark-text-secondary': '#A0A0A0',
        'dark-text': '#e0e0e0',
        'dark-text-secondary': '#a0a0a0',
        'dark-input-bg': 'rgba(30, 40, 60, 0.7)', // Dark input background
        'dark-input-border': 'rgba(70, 80, 100, 0.8)',
        'dark-nav': 'rgba(20, 20, 30, 0.9)',
        'dark-nav-border': 'rgba(255, 255, 255, 0.1)',
        'dark-footer-bg': 'rgba(15, 15, 25, 0.95)',
        // And potentially colors for your dark mode primary/secondary buttons if not using existing ones
        'indigo-300': '#A78BFA', // Example if not already in default Tailwind config
        'purple-400': '#C084FC', // Example if not already in default Tailwind config
        'indigo-400': '#818CF8',
        'purple-500': '#A78BFA',
      },
      animation: {
        // Ensure your custom animations are defined here
        slideInUp: 'slideInUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        // Define your custom keyframes here
        slideInUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
            '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
            '25%': { transform: 'translateY(-10px) translateX(10px) scale(1.02)' },
            '50%': { transform: 'translateY(-5px) translateX(-10px) scale(0.98)' },
            '75%': { transform: 'translateY(10px) translateX(5px) scale(1.01)' },
        },
      }
    },
  },
  plugins: [],
}