import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: base 用相对路径,本地预览与 GitHub Pages(<user>.github.io/<repo>/)均可直接工作,
// 无需按仓库名注入,配合 HashRouter 可彻底避免 Pages 404。
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { chunkSizeWarningLimit: 1200 },
})