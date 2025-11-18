import { getArticlesPage } from '@/lib/api';
import Link from 'next/link';
import { generatePageNumbers } from '@/lib/pagination';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
  }>;
}

export default async function PageBasedPagination({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const perPage = parseInt(params.per_page || '10', 10);

  const { data: articles, page, perPage: itemsPerPage, total } = await getArticlesPage(
    currentPage,
    perPage,
    { locale: 'en' }
  );

  const hasMore = articles.length === itemsPerPage;
  const totalPages = total ? Math.ceil(total / itemsPerPage) : undefined;
  const pageNumbers = totalPages ? generatePageNumbers(page, totalPages) : [];

  return (
    <div className="container">
      <header>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Examples
        </Link>
        <h1>Page-Based Pagination</h1>
        <p>
          Uses <code>paginate</code> and <code>page</code> parameters
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
            {page > 1 && (
              <Link href={`/page-based?page=${page - 1}&per_page=${itemsPerPage}`}>
                <button>Previous</button>
              </Link>
            )}

            {pageNumbers.length > 0 ? (
              <>
                {pageNumbers.map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                        ...
                      </span>
                    );
                  }
                  const pageNumValue = pageNum as number;
                  return (
                    <Link
                      key={pageNumValue}
                      href={`/page-based?page=${pageNumValue}&per_page=${itemsPerPage}`}
                    >
                      <button className={pageNumValue === page ? 'active' : ''}>
                        {pageNumValue}
                      </button>
                    </Link>
                  );
                })}
              </>
            ) : (
              <span className="pagination-info">Page {page}</span>
            )}

            {hasMore && (
              <Link href={`/page-based?page=${page + 1}&per_page=${itemsPerPage}`}>
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
                <span className="info-stat-label">Current Page</span>
                <span className="info-stat-value">{page}</span>
              </div>
              <div className="info-stat">
                <span className="info-stat-label">Items Per Page</span>
                <span className="info-stat-value">{itemsPerPage}</span>
              </div>
              <div className="info-stat">
                <span className="info-stat-label">Items on This Page</span>
                <span className="info-stat-value">{articles.length}</span>
              </div>
              {total !== undefined && total !== null && typeof total === 'number' && (
                <div className="info-stat">
                  <span className="info-stat-label">Total Items</span>
                  <span className="info-stat-value">{total.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

