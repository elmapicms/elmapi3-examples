# Pagination Next.js Example

A Next.js example demonstrating advanced pagination strategies with ElmapiCMS.

## Features

- **Page-Based Pagination** (`/page-based`) - Traditional pagination with page numbers and Previous/Next buttons
- **Limit/Offset Pagination** (`/limit-offset`) - Offset-based pagination showing item ranges
- **Blog Page** (`/blog`) - Advanced pagination with filtering, sorting, and page numbers
- **Infinite Scroll** (`/infinite-scroll`) - Automatically loads more content as you scroll
- **Load More Button** (`/load-more`) - Manual "Load More" button for user-controlled pagination

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env.local
```

3. Update `.env.local` with your ElmapiCMS configuration:
   - `ELMAPI_PROJECT_ID`: Your project UUID (get this from the project's API Access page in ElmapiCMS)
   - `ELMAPI_API_URL`: Your ElmapiCMS API URL
   - `ELMAPI_IMAGE_HOST`: Your image host domain
   - `ELMAPI_API_KEY`: Optional, only if authentication is required

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️  **Local SSL note**: If you're running **ElmapiCMS** on `https://localhost` with a self-signed certificate, the `NODE_TLS_REJECT_UNAUTHORIZED=0` flag is already included in the dev script to bypass SSL verification for local development only. **Do not use this flag in production deployments** – it bypasses SSL validation entirely.

## Project Setup in ElmapiCMS

To create this project in your ElmapiCMS instance, you have two options:

### Option 1: Import JSON Template (Recommended)

1. Download the `pagination-example.json` file from the [examples repository](../pagination-example.json) 
2. In your ElmapiCMS admin panel:
   - Go to **Dashboard** → **Create Project**
   - Select **"Import from file"** 
   - Upload the `pagination-example.json` file
   - Create the project

This creates a "Pagination Example" project with:
- Collection: `articles`
- Fields: `title`, `slug`, `content`, `excerpt`, `published_date`, `category`, `views`
- Locale: `en`
- Sample articles 

### Option 2: Use Seeder (Legacy)

If you prefer using seeders, you can still run:
```bash
php artisan db:seed --class=PaginationExampleSeeder
```

**Getting Your Project ID:**

After creating the project, you'll need to get your Project ID:

1. Go to your ElmapiCMS admin panel
2. Navigate to the "Pagination Example" project
3. Go to **Settings > API Access**
4. Copy the **Project ID** and paste it into your `.env.local` file

## How It Works

All pagination examples use Next.js Server Components with the SDK:

1. The page component receives search parameters from the URL
2. It calls the SDK's `getEntries()` method with pagination parameters
3. The data is rendered on the server and sent to the client
4. Navigation updates the URL, triggering a new server-side fetch

**Infinite Scroll** and **Load More** use a hybrid approach:
- Server Components handle data fetching and rendering
- Small client components handle scroll detection and button clicks
- Scroll position is preserved when loading new content

## API Usage

The app uses the [ElmapiCMS JavaScript SDK](https://www.npmjs.com/package/@elmapicms/js-sdk) to interact with the API:

- **Page-based pagination**: `client.getEntries('articles', { paginate: 10, page: 1, locale: 'en' })`
- **Limit/offset pagination**: `client.getEntries('articles', { limit: 10, offset: 0, locale: 'en' })`
- **With filters**: `client.getEntries('articles', { paginate: 10, page: 1, where: { category: 'tech' }, sort: 'title:ASC', locale: 'en' })`
- **Search**: `client.getEntries('articles', { paginate: 10, page: 1, where: { title: { like: '%search%' } }, locale: 'en' })`
