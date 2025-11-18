import { getPosts } from '@/lib/api';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface HomeProps {
  searchParams: {
    locale?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const locale = searchParams.locale || 'en';
  const posts = await getPosts(locale);

  return (
    <div className="container">
      <header>
        <h1>Blog Posts</h1>
        <LanguageSwitcher currentLocale={locale} />
      </header>

      <div className="post-list">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <article key={post.uuid} className="post-card">
              <Link href={`/post/${post.uuid}?locale=${locale}`}>
                <h2>{post.fields.title}</h2>
              </Link>
              {post.fields.excerpt && (
                <p className="excerpt">{post.fields.excerpt}</p>
              )}
              {post.fields.published_date && (
                <p className="date">
                  {new Date(post.fields.published_date).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

