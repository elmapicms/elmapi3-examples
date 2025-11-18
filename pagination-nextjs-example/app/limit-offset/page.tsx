import { getArticlesLimitOffset } from '@/lib/api';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    limit?: string;
    offset?: string;
  }>;
}

const DEFAULT_LIMIT = 10;

export default async function LimitOffsetPagination({ searchParams }: PageProps) {
  const params = await searchParams;
  const limit = parseInt(params.limit || String(DEFAULT_LIMIT), 10);
  const offset = parseInt(params.offset || '0', 10);

  const { data: articles, limit: itemsLimit, offset: currentOffset } =
    await getArticlesLimitOffset(limit, offset, 'en');

  const hasMore = articles.length === itemsLimit;
  const hasPrevious = currentOffset > 0;

  return (
    <div className="container">
      <header>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Examples
        </Link>
        <h1>Limit/Offset Pagination</h1>
        <p>
          Uses <code>limit</code> and <code>offset</code> parameters
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="loading">No articles found.</div>
      ) : (
        <>
          <div className="articles-list">
            {articles.map((article) => (
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

          <div className="pagination">
            {hasPrevious && (
              <Link
                href={`/limit-offset?limit=${itemsLimit}&offset=${Math.max(
                  0,
                  currentOffset - itemsLimit
                )}`}
              >
                <button>Previous</button>
              </Link>
            )}

            <span className="pagination-info">
              Showing {currentOffset + 1} - {currentOffset + articles.length}
            </span>

            {hasMore && (
              <Link
                href={`/limit-offset?limit=${itemsLimit}&offset=${
                  currentOffset + itemsLimit
                }`}
              >
                <button>Next</button>
              </Link>
            )}
          </div>

          <div className="info-card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>
              Pagination Info
            </h3>
            <div className="info-stats">
              <div className="info-stat">
                <span className="info-stat-label">Current Offset</span>
                <span className="info-stat-value">{currentOffset}</span>
              </div>
              <div className="info-stat">
                <span className="info-stat-label">Limit</span>
                <span className="info-stat-value">{itemsLimit}</span>
              </div>
              <div className="info-stat">
                <span className="info-stat-label">Items Shown</span>
                <span className="info-stat-value">{articles.length}</span>
              </div>
              <div className="info-stat">
                <span className="info-stat-label">Range</span>
                <span className="info-stat-value" style={{ fontSize: '1rem' }}>
                  {currentOffset + 1} - {currentOffset + articles.length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

