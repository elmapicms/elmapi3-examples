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

export interface Article {
  uuid: string;
  locale: string;
  published_at: string | null;
  fields: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published_date: string | null;
    category?: string;
    views?: string;
  };
}

export interface ArticleFilters {
  category?: string;
  search?: string;
  sort?: string;
  locale?: string;
}

/**
 * Get articles with page-based pagination and advanced filtering
 * Uses paginate and page parameters with optional filters
 */
export async function getArticlesPage(
  page: number = 1,
  perPage: number = 10,
  filters: ArticleFilters = {}
): Promise<{ data: Article[]; page: number; perPage: number; total?: number }> {
  try {
    const client = getClient();
    const { category, search, sort, locale = 'en' } = filters;

    // Build where clause for filtering
    // SDK expects where as an object, which will be serialized to where[field]=value format
    // Field names don't need 'fields.' prefix - API handles this internally
    const params: any = {
      paginate: perPage,
      page,
      locale,
    };

    // Build where clause object
    const where: any = {};
    
    // Add category filter
    if (category) {
      where.category = category;
    }

    // Add search filter using 'like' operator
    // Note: API uses 'like' operator (not '_like') for pattern matching
    // For OR conditions across multiple fields, we search in title (most common use case)
    // To search in content as well, you could make separate requests and combine results
    if (search) {
      where.title = {
        like: `%${search}%`,
      };
    }

    // Add where clause to params if it has any conditions
    if (Object.keys(where).length > 0) {
      params.where = where;
    }

    if (sort) {
      const normalizedSort = sort.split(':').map((part, index) => {
        if (index === 1) {
          return part.toUpperCase();
        }
        return part;
      }).join(':');
      params.sort = normalizedSort;
    }

    const response = await client.getEntries('articles', params);

    const articles = Array.isArray(response)
      ? (response as Article[])
      : (response as any)?.data || [];

    // Extract total from response - could be at response.total, response.meta.total, response.pagination.total, etc.
    let total: number | undefined = undefined;
    if (!Array.isArray(response)) {
      const resp = response as any;
      total = resp?.total ?? resp?.meta?.total ?? resp?.pagination?.total ?? resp?.count;
      // Log for debugging if total is not found
      if (total === undefined && process.env.NODE_ENV === 'development') {
        console.log('API Response structure:', Object.keys(resp));
      }
    }

    return {
      data: articles,
      page,
      perPage,
      total,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      data: [],
      page: 1,
      perPage: 10,
    };
  }
}

/**
 * Get articles with limit/offset pagination
 */
export async function getArticlesLimitOffset(
  limit: number = 10,
  offset: number = 0,
  locale: string = 'en'
): Promise<{ data: Article[]; limit: number; offset: number }> {
  try {
    const client = getClient();
    const response = await client.getEntries('articles', {
      limit,
      offset,
      locale,
    });

    // API may return array directly or wrapped in { data: [...] }
    const articles = Array.isArray(response)
      ? (response as Article[])
      : (response as any)?.data || [];

    return {
      data: articles,
      limit,
      offset,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      data: [],
      limit: 10,
      offset: 0,
    };
  }
}

/**
 * Get all articles (for client-side pagination)
 */
export async function getAllArticles(locale: string = 'en'): Promise<Article[]> {
  try {
    const client = getClient();
    const entries = await client.getEntries('articles', {
      locale,
    });

    return Array.isArray(entries) ? (entries as Article[]) : [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Get a single article by UUID
 */
export async function getArticle(uuid: string, locale?: string): Promise<Article | null> {
  try {
    const client = getClient();
    const params = locale ? { locale } : undefined;
    const entry = await (client.getEntry as any)('articles', uuid, params);
    const article = (entry?.data || entry) as Article;
    return article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

/**
 * Get unique categories from articles
 */
export async function getCategories(locale: string = 'en'): Promise<string[]> {
  try {
    const client = getClient();
    const entries = await client.getEntries('articles', {
      locale,
    });

    const articles = Array.isArray(entries) ? (entries as Article[]) : [];
    const categories = new Set<string>();

    articles.forEach((article) => {
      if (article.fields.category) {
        categories.add(article.fields.category);
      }
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

