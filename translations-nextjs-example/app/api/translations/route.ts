import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const uuid = searchParams.get('uuid');
  const locale = searchParams.get('locale');

  if (!uuid || !locale) {
    return NextResponse.json(
      { error: 'UUID and locale are required' },
      { status: 400 }
    );
  }

  try {
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
      `${apiUrl}/blog-posts/${uuid}?translation_locale=${locale}`,
      { headers }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Translation not found' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translation' },
      { status: 500 }
    );
  }
}

