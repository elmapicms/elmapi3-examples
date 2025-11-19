// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      elmapiProjectId: process.env.ELMAPI_PROJECT_ID || '',
      elmapiApiUrl: process.env.ELMAPI_API_URL || 'http://localhost:8000/api',
      elmapiImageHost: process.env.ELMAPI_IMAGE_HOST || 'localhost:8000',
    },
    elmapiApiKey: process.env.ELMAPI_API_KEY || '',
  },
})

