import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <div className="error" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article Not Found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          Back to Blog
        </Link>
      </div>
    </div>
  );
}

