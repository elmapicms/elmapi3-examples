import { NextRequest, NextResponse } from 'next/server';
import { getPostTranslation } from '@/lib/api';

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
    const translation = await getPostTranslation(uuid, locale);
    
    if (!translation) {
      return NextResponse.json(
        { error: 'Translation not found' },
        { status: 404 }
      );
    }

    // Return translation directly (not wrapped in { data: ... }) 
    // to match what LanguageSwitcher expects (translation.uuid)
    return NextResponse.json(translation);
  } catch (error) {
    console.error('Error fetching translation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translation' },
      { status: 500 }
    );
  }
}

