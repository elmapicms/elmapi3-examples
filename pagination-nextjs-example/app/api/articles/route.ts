import { NextRequest, NextResponse } from 'next/server';
import { getArticlesPage, getArticlesLimitOffset, getAllArticles } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'page';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const paginate = parseInt(searchParams.get('paginate') || '10', 10);
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : undefined;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset')!, 10)
      : undefined;
    const locale = searchParams.get('locale') || 'en';
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;

    let result;

    if (type === 'limit-offset' && limit !== undefined && offset !== undefined) {
      result = await getArticlesLimitOffset(limit, offset, locale);
    } else if (type === 'all') {
      const all = await getAllArticles(locale);
      result = { data: all };
    } else {
      // Default to page-based pagination with filters
      result = await getArticlesPage(page, paginate, {
        category,
        search,
        sort,
        locale,
      });
    }

    // Ensure result has data property
    if (!result.data) {
      result = { ...result, data: [] };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

