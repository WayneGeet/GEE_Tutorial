// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
  head: {
    title: process.env.PROJECT_NAME,
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    script: [
      {
        src: "https://accounts.google.com/gsi/client",
      },
      {
        src: "https://apis.google.com/js/platform.js",
        async: true,
        defer: true,
      },
      {
        src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAP_API_KEY}&callback=Function.prototype&libraries=marker,drawing`,

      },
      {
        src: "https://ajax.googleapis.com/ajax/libs/earthengine/0.1.343/earthengine-api.min.js",
        // https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
      },
      {
        src: "https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js"
      },
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min.js"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
},
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
  runtimeConfig:{
    public:{
      mapId:process.env.MAP_ID,
      apiKey:process.env.GOOGLE_MAP_API_KEY,
      projectPath:process.env.GEE_PROJECT_ASSET_PATH
    }
  }
  // debug:true,
   
  // serverMiddleware: [
  //   { path: "/ee-api", handler: "~/server-middleware/index.js" },
  // ],
})
