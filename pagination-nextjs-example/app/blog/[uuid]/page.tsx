import { getArticle } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: {
    uuid: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.uuid, 'en');

  if (!article) {
    notFound();
  }

  return (
    <div className="container">
      <header>
        <Link href="/blog" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Blog
        </Link>
      </header>

      <article className="article-detail">
        <h1>{article.fields.title}</h1>
        <div className="meta">
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
          <span>🌐 {article.locale.toUpperCase()}</span>
        </div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: article.fields.content }}
        />
      </article>
    </div>
  );
}

