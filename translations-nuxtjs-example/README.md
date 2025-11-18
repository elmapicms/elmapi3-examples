# Translations Nuxt.js Example

A simple Nuxt.js example demonstrating ElmapiCMS translations feature with a language switcher.

## Features

- Home page with blog post list
- Post detail page
- Language switcher that navigates to translated versions
- Support for English, French, and Spanish

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your ElmapiCMS configuration:
   - `ELMAPI_PROJECT_ID`: Your project UUID
   - `ELMAPI_API_URL`: Your ElmapiCMS API URL
   - `ELMAPI_IMAGE_HOST`: Your image host domain

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️  **Local SSL note**: If you're running **ElmapiCMS** on `https://localhost` with a self-signed certificate, the `NODE_TLS_REJECT_UNAUTHORIZED=0` flag is already included in the dev script to bypass SSL verification for local development only. **Do not use this flag in production deployments** – it bypasses SSL validation entirely.

## Project Setup in ElmapiCMS

This example uses the "Translations Example" project created by the seeder:
- Project ID: `04d1f9f7-6a8c-496f-ab53-ec9fdf8a6068`
- Collection: `blog-posts`
- Locales: `en`, `fr`, `es`

To create this project in your ElmapiCMS instance, run:
```bash
php artisan db:seed --class=TranslationsExampleSeeder
```

## How It Works

1. The home page fetches all blog posts in the current locale
2. Each post can be clicked to view its detail page
3. The language switcher uses the `translation_locale` API parameter to fetch the translated version
4. When switching languages, the app navigates to the translated post's UUID

## API Usage

The app uses the [ElmapiCMS JavaScript SDK](https://www.npmjs.com/package/@elmapicms/js-sdk) to interact with the API:
- List posts: `client.getEntries('blog-posts', { locale })`
- Get a post: `client.getEntry('blog-posts', uuid)`
- Get translation: Server API route `/api/translations/[uuid]` that calls the API with `translation_locale` parameter

## Tech Stack

- **Nuxt 3**: Vue.js framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling (via @nuxtjs/tailwindcss)
- **ElmapiCMS JS SDK**: API client

