import { defineConfig ,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({mode})=>{
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: 'https://electro-shop-1xjm.onrender.com',
          changeOrigin: false,
          secure: false,
        },
        '/uploads': {
          target: 'https://electro-shop-1xjm.onrender.com' ,
          changeOrigin: false,
        },
      },
    },
  })
}
