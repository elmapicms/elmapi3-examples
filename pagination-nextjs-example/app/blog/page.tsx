import { getArticlesPage, getCategories } from '@/lib/api';
import Link from 'next/link';
import Filters from './filters';
import { generatePageNumbers } from '@/lib/pagination';

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
    per_page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const perPage = parseInt(params.per_page || '10', 10);
  const category = params.category || undefined;
  const search = params.search || undefined;
  const sort = params.sort || 'id:ASC';

  const [articlesResult, categories] = await Promise.all([
    getArticlesPage(currentPage, perPage, {
      category,
      search,
      sort,
      locale: 'en',
    }),
    getCategories('en'),
  ]);

  const { data: articles, page, perPage: itemsPerPage, total } = articlesResult;
  const hasMore = articles.length === itemsPerPage;
  const totalPages = total ? Math.ceil(total / itemsPerPage) : undefined;
  const pageNumbers = totalPages ? generatePageNumbers(page, totalPages) : [];

  // Helper function to build URL with all query params
  const buildPageUrl = (pageNum: number) => {
    return `/blog?${new URLSearchParams({
      ...(category && { category }),
      ...(search && { search }),
      ...(sort && { sort }),
      ...(itemsPerPage !== 10 && { per_page: String(itemsPerPage) }),
      page: String(pageNum),
    }).toString()}`;
  };

  return (
    <div className="container">
      <header>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Examples
        </Link>
        <h1>ElmapiCMS Blog</h1>
        <p>Advanced filtering, sorting, and pagination powered by ElmapiCMS</p>
      </header>

      <Filters categories={categories} currentFilters={{ category, search, sort, per_page: itemsPerPage }} />

      {articles.length === 0 ? (
        <div className="loading">
          <p>No articles found.</p>
          {(category || search) && (
            <p style={{ marginTop: '1rem' }}>
              Try adjusting your filters or{' '}
              <Link href="/blog" style={{ color: 'var(--primary)' }}>
                clear all filters
              </Link>
              .
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="articles-list">
            {articles.map((article) => (
              <article key={article.uuid} className="article-card">
                <div className="article-card-header">
                  <h2>
                    <Link href={`/blog/${article.uuid}`}>{article.fields.title}</Link>
                  </h2>
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
                <div className="article-card-footer">
                  <Link href={`/blog/${article.uuid}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            {page > 1 && (
              <Link href={buildPageUrl(page - 1)}>
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
                    <Link key={pageNumValue} href={buildPageUrl(pageNumValue)}>
                      <button className={pageNumValue === page ? 'active' : ''}>
                        {pageNumValue}
                      </button>
                    </Link>
                  );
                })}
              </>
            ) : (
              <span className="pagination-info">
                Page {page}
                {totalPages && ` of ${totalPages}`}
              </span>
            )}

            {hasMore && (
              <Link href={buildPageUrl(page + 1)}>
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
              {totalPages && (
                <div className="info-stat">
                  <span className="info-stat-label">Total Pages</span>
                  <span className="info-stat-value">{totalPages}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
