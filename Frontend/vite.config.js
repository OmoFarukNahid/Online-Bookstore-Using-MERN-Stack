import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  
  
  plugins: [
    tailwindcss({
      config: {
        darkMode: "class", // 👈 this makes Tailwind watch for "dark" class
      },
    }),
  ],
})
