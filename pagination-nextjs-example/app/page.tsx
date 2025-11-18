import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>ElmapiCMS Pagination Examples</h1>
        <p>Comprehensive examples demonstrating pagination strategies with ElmapiCMS</p>
        <nav>
          <Link href="/blog">📝 Blog with Filters</Link>
          <Link href="/page-based">📄 Page-Based</Link>
          <Link href="/limit-offset">🔢 Limit/Offset</Link>
          <Link href="/infinite-scroll">♾️ Infinite Scroll</Link>
          <Link href="/load-more">➕ Load More</Link>
        </nav>
      </header>

      <div className="info">
        <strong>About These Examples</strong>
        <p>
          This collection demonstrates different pagination strategies using the ElmapiCMS JavaScript SDK.
          All examples use only the SDK - no manual fetch calls required.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <strong>SDK Methods Used:</strong>
        </p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>
            <code>client.getEntries()</code> with <code>paginate</code> and{' '}
            <code>page</code> parameters
          </li>
          <li>
            <code>client.getEntries()</code> with <code>limit</code> and{' '}
            <code>offset</code> parameters
          </li>
          <li>
            <code>client.getEntries()</code> with <code>where</code> for advanced filtering
          </li>
          <li>
            <code>client.getEntries()</code> with <code>sort</code> for ordering
          </li>
          <li>
            <code>client.getEntry()</code> for single article retrieval
          </li>
        </ul>
      </div>
    </div>
  );
}

