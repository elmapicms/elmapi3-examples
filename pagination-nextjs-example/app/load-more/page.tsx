'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  uuid: string;
  locale: string;
  published_at: string | null;
  fields: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published_date: string | null;
    category?: string;
    views?: string;
  };
}

const ITEMS_PER_PAGE = 10;

export default function LoadMore() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/articles?type=page&page=${page + 1}&paginate=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setArticles((prev) => [...prev, ...data.data]);
        setHasMore(data.data.length === ITEMS_PER_PAGE);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/articles?type=page&page=1&paginate=${ITEMS_PER_PAGE}`
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setArticles(data.data);
          setHasMore(data.data.length === ITEMS_PER_PAGE);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  return (
    <div className="container">
      <header>
        <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Examples
        </Link>
        <h1>Load More Button</h1>
        <p>Manually load more content with a button click</p>
      </header>

      {articles.length === 0 && !loading ? (
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

          {hasMore && (
            <button
              className="load-more-btn"
              onClick={loadMore}
              disabled={loading}
              style={{ marginTop: '2rem' }}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}

          {!hasMore && articles.length > 0 && (
            <div className="loading" style={{ marginTop: '2rem' }}>No more articles to load.</div>
          )}
        </>
      )}
    </div>
  );
}

