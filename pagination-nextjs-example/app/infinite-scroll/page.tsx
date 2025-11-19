import { getArticlesPage } from '@/lib/api';
import Link from 'next/link';
import InfiniteScrollClient from './infinite-scroll-client';

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 10;

export default async function InfiniteScroll({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  // Fetch all pages up to current page
  const allArticles = [];
  let hasMore = true;

  for (let page = 1; page <= currentPage; page++) {
    const { data: articles } = await getArticlesPage(page, ITEMS_PER_PAGE, {
      locale: 'en',
    });

    if (articles.length > 0) {
      allArticles.push(...articles);
      if (articles.length < ITEMS_PER_PAGE) {
        hasMore = false;
        break;
      }
    } else {
      hasMore = false;
      break;
    }
  }

  // Check if there's more by fetching next page
  if (hasMore) {
    const { data: nextPageArticles } = await getArticlesPage(
      currentPage + 1,
      ITEMS_PER_PAGE,
      { locale: 'en' }
    );
    hasMore = nextPageArticles.length > 0;
  }

  return (
    <div className="container">
      <header>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Examples
        </Link>
        <h1>Infinite Scroll</h1>
        <p>
          Automatically loads more content as you scroll using Intersection Observer
        </p>
      </header>

      {allArticles.length === 0 ? (
        <div className="loading">No articles found.</div>
      ) : (
        <>
          <div className="articles-list">
            {allArticles.map((article) => (
              <article key={article.uuid} className="article-card">
                <div className="article-card-header">
                  <h2>{article.fields.title}</h2>
                  <div className="article-meta">
                    {article.fields.category && (
                      <span className="category-badge">{article.fields.category}</span>
                    )}
                    {article.fields.published_date && (
                      <span>
                        📅 {new Date(article.fields.published_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {article.fields.views && (
                      <span>👁️ {parseInt(article.fields.views).toLocaleString()} views</span>
                    )}
                  </div>
                  {article.fields.excerpt && (
                    <p className="excerpt">{article.fields.excerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <InfiniteScrollClient currentPage={currentPage} hasMore={hasMore} />
        </>
      )}
    </div>
  );
}

