'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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

export default function InfiniteScroll() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchArticles = useCallback(async (pageNum: number) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/articles?type=page&page=${pageNum}&paginate=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setArticles((prev) => [...prev, ...data.data]);
        setHasMore(data.data.length === ITEMS_PER_PAGE);
        setPage(pageNum);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchArticles(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchArticles(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page, fetchArticles]);

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

          <div ref={observerTarget} style={{ height: '20px', marginTop: '2rem' }}>
            {loading && <div className="loading">Loading more articles...</div>}
            {!hasMore && articles.length > 0 && (
              <div className="loading">No more articles to load.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

