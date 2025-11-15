import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tbt003/', // GitHub Pagesのサブディレクトリに合わせてベースパスを設定
  server: {
    host: '0.0.0.0', // すべてのネットワークインターフェースでリッスン
    port: 5173, // デフォルトポート
  },
})
