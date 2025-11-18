import { createClient } from '@elmapicms/js-sdk';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const uuid = getRouterParam(event, 'uuid');
  const query = getQuery(event);
  const locale = query.locale as string;

  if (!uuid || !locale) {
    throw createError({
      statusCode: 400,
      message: 'UUID and locale are required',
    });
  }

  try {
    const client = createClient(
      config.public.elmapiApiUrl,
      config.elmapiApiKey || '',
      config.public.elmapiProjectId
    );

    const entry = await client.getEntry('blog-posts', uuid, {
      translation_locale: locale,
    }) as any;

    if (!entry) {
      throw createError({
        statusCode: 404,
        message: 'Translation not found',
      });
    }

    // Return translation directly (not wrapped in { data: ... })
    // to match what LanguageSwitcher expects
    return entry?.data || entry;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch translation',
    });
  }
});

