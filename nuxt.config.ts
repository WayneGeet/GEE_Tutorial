// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/google-fonts', {
        families: {
          Roboto: true,
          Inter: [400, 700],
          'Josefin+Sans': true,
          Lato: [100, 300],
          Raleway: {
            wght: [100, 400],
            ital: [100]
          }
        }
    },
    
  ]],
  css: ['~/assets/css/main.css',
  ],
  // debug:true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },  
  // serverMiddleware: [
  //   { path: "/ee-api", handler: "~/server-middleware/index.js" },
  // ],
  
})
