import { getPost } from '@/lib/api';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    uuid: string;
  };
  searchParams: {
    locale?: string;
  };
}

export default async function PostPage({ params, searchParams }: PostPageProps) {
  const locale = searchParams.locale || 'en';
  const post = await getPost(params.uuid, locale);

  if (!post) {
    notFound();
  }

  return (
    <div className="container">
      <header>
        <Link href={`/?locale=${locale}`} className="back-link">
          ← Back to Posts
        </Link>
        <LanguageSwitcher currentLocale={locale} currentPostUuid={post.uuid} />
      </header>

      <article className="post-detail">
        <h1>{post.fields.title}</h1>
        <div className="meta">
          <span>
            {post.fields.published_date
              ? new Date(post.fields.published_date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'No date'}
          </span>
          <span style={{ marginLeft: '1rem', color: '#999' }}>
            ({post.locale.toUpperCase()})
          </span>
        </div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: post.fields.content }}
        />
      </article>
    </div>
  );
}

