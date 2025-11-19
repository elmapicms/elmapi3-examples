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
   - `ELMAPI_PROJECT_ID`: Your project UUID (get this from the project's API Access page in ElmapiCMS)
   - `ELMAPI_API_URL`: Your ElmapiCMS API URL
   - `ELMAPI_IMAGE_HOST`: Your image host domain

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️  **Local SSL note**: If you're running **ElmapiCMS** on `https://localhost` with a self-signed certificate, the `NODE_TLS_REJECT_UNAUTHORIZED=0` flag is already included in the dev script to bypass SSL verification for local development only. **Do not use this flag in production deployments** – it bypasses SSL validation entirely.

## Project Setup in ElmapiCMS

To create this project in your ElmapiCMS instance, you have two options:

### Option 1: Import JSON Template (Recommended)

1. Download the `translations-example.json` file from the [examples repository](../translations-example.json)
2. In your ElmapiCMS admin panel:
   - Go to **Dashboard** → **Create Project**
   - Select **"Import from file"** 
   - Upload the `translations-example.json` file
   - Create the project

This creates a "Translations Example" project with:
- Collection: `blog-posts`
- Locales: `en`, `fr`, `es`
- 3 blog posts with translations in all three languages

### Option 2: Use Seeder (Legacy)

If you prefer using seeders, you can still run:
```bash
php artisan db:seed --class=TranslationsExampleSeeder
```

**Getting Your Project ID:**

After creating the project, you'll need to get your Project ID:

1. Go to your ElmapiCMS admin panel
2. Navigate to the "Translations Example" project
3. Go to **Settings > API Access**
4. Copy the **Project ID** and paste it into your `.env` file

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

