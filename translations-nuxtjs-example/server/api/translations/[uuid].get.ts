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
    const apiUrl = config.public.elmapiApiUrl;
    const projectId = config.public.elmapiProjectId;
    const apiKey = config.elmapiApiKey;

    const headers: HeadersInit = {
      'Accept': 'application/json',
      'project-id': projectId,
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(
      `${apiUrl}/blog-posts/${uuid}?translation_locale=${locale}`,
      { headers }
    );

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: 'Translation not found',
      });
    }

    const data = await response.json();
    return data;
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

