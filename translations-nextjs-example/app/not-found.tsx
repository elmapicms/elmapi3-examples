import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <h1>404 - Post Not Found</h1>
      <p>The post you're looking for doesn't exist or the translation is not available.</p>
      <Link href="/">← Back to Home</Link>
    </div>
  );
}

