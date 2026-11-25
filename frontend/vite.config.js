import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Forward API calls to the Spring Boot backend.
// The backend's CORS setting only allows http://localhost:3000, and browsers send an
// "Origin" header on POST/PUT/DELETE. Removing it makes the request look like a Postman
// call, so the backend accepts it.
const backend = {
  target: 'http://localhost:8080',
  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/quiz/api': backend,
      '/user/api': backend,
      '/question/api': backend,
      '/topic/api': backend,
      '/section/api': backend,
      '/attempt/api': backend,
    },
  },
})
