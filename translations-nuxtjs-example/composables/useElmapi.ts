import { createClient } from '@elmapicms/js-sdk';

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

export const useElmapi = () => {
  const config = useRuntimeConfig();
  
  // Lazy initialization of SDK client
  function getClient() {
    const apiUrl = config.public.elmapiApiUrl;
    const apiToken = config.elmapiApiKey || '';
    const projectId = config.public.elmapiProjectId;

    if (!projectId) {
      throw new Error('ELMAPI_PROJECT_ID environment variable is required');
    }

    return createClient(apiUrl, apiToken, projectId);
  }

  const getPosts = async (locale: string = 'en'): Promise<BlogPost[]> => {
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
  };

  const getPost = async (uuid: string, locale?: string): Promise<BlogPost | null> => {
    try {
      const client = getClient();
      const params = locale ? { locale } : undefined;
      // SDK returns response.body which contains { data: {...} }
      const entry = await client.getEntry('blog-posts', uuid, params) as any;
      const blogPost = (entry?.data || entry) as BlogPost;
      return blogPost || null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  };

  const getPostTranslation = async (uuid: string, targetLocale: string): Promise<BlogPost | null> => {
    try {
      const client = getClient();
      // SDK returns response.body which contains { data: {...} }
      const entry = await client.getEntry('blog-posts', uuid, {
        translation_locale: targetLocale,
      }) as any;
      const blogPost = (entry?.data || entry) as BlogPost;
      return blogPost || null;
    } catch (error) {
      console.error('Error fetching translation:', error);
      return null;
    }
  };

  return {
    getPosts,
    getPost,
    getPostTranslation,
  };
};

