'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LoadMoreButtonProps {
  nextPage: number;
}

export default function LoadMoreButton({ nextPage }: LoadMoreButtonProps) {
  const router = useRouter();

  useEffect(() => {
    // Restore scroll position after navigation and content render
    const restoreScroll = () => {
      const savedPosition = sessionStorage.getItem('load-more-position');
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
          sessionStorage.removeItem('load-more-position');
        });
      }
    };

    // Use setTimeout to ensure DOM is updated
    const timeoutId = setTimeout(restoreScroll, 0);
    return () => clearTimeout(timeoutId);
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Save current scroll position before navigation
    sessionStorage.setItem('load-more-position', String(window.scrollY));
    router.push(`/load-more?page=${nextPage}`);
  };

  return (
    <a
      href={`/load-more?page=${nextPage}`}
      onClick={handleClick}
      className="load-more-btn"
      style={{ marginTop: '2rem', display: 'inline-block' }}
    >
      Load More
    </a>
  );
}

