import { createClient } from '@elmapicms/js-sdk';

// Lazy initialization of SDK client
function getClient() {
  const apiUrl = process.env.ELMAPI_API_URL || 'http://localhost:8000/api';
  const apiToken = process.env.ELMAPI_API_KEY || '';
  const projectId = process.env.ELMAPI_PROJECT_ID || '';

  if (!projectId) {
    throw new Error('ELMAPI_PROJECT_ID environment variable is required');
  }

  return createClient(apiUrl, apiToken, projectId);
}

export interface BlogPost {
  uuid: string;
  locale: string;
  published_at: string | null;
  fields: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published_date: string | null;
  };
}

export async function getPosts(locale: string = 'en'): Promise<BlogPost[]> {
  try {
    const client = getClient();
    const entries = await client.getEntries('blog-posts', {
      locale,
    });
    // SDK returns array directly
    return Array.isArray(entries) ? entries as BlogPost[] : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPost(uuid: string, locale?: string): Promise<BlogPost | null> {
  try {
    // Use fetch directly for consistency and to support locale parameter
    const apiUrl = process.env.ELMAPI_API_URL || 'http://localhost:8000/api';
    const projectId = process.env.ELMAPI_PROJECT_ID || '';
    const apiKey = process.env.ELMAPI_API_KEY;

    const headers: HeadersInit = {
      'Accept': 'application/json',
      'project-id': projectId,
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Build URL with locale if provided
    let url = `${apiUrl}/blog-posts/${uuid}`;
    if (locale) {
      url += `?locale=${locale}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // API returns entry directly (ContentEntryResource), but might be wrapped
    const entry = (data?.data || data) as BlogPost;
    return entry || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostTranslation(uuid: string, targetLocale: string): Promise<BlogPost | null> {
  try {
    // SDK doesn't support translation_locale parameter yet
    // Use fetch directly for translation requests
    const apiUrl = process.env.ELMAPI_API_URL || 'http://localhost:8000/api';
    const projectId = process.env.ELMAPI_PROJECT_ID || '';
    const apiKey = process.env.ELMAPI_API_KEY;

    const headers: HeadersInit = {
      'Accept': 'application/json',
      'project-id': projectId,
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(
      `${apiUrl}/blog-posts/${uuid}?translation_locale=${targetLocale}`,
      { headers }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // API returns entry directly (ContentEntryResource), but might be wrapped
    const entry = (data?.data || data) as BlogPost;
    return entry || null;
  } catch (error) {
    console.error('Error fetching translation:', error);
    return null;
  }
}
