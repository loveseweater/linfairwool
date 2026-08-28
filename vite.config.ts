import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// 用本地预渲染的首页 HTML 替换 SPA 空壳（保证爬虫能看到首页正文）
function injectPrerenderedHome() {
  const file = path.resolve(__dirname, 'prerender-home.html')
  return {
    name: 'inject-prerendered-home',
    apply: 'build' as const,
    transformIndexHtml() {
      if (!fs.existsSync(file)) return undefined
      return fs.readFileSync(file, 'utf-8')
    },
  }
}

export default defineConfig({
  plugins: [react(), injectPrerenderedHome()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
    build: {
    rollupOptions: {
      output: {
        // 固定 asset 文件名（不带 hash），保证预渲染 HTML 中的引用始终有效
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
