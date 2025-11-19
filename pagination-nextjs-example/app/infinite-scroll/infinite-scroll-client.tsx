'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface InfiniteScrollClientProps {
  currentPage: number;
  hasMore: boolean;
}

export default function InfiniteScrollClient({
  currentPage,
  hasMore,
}: InfiniteScrollClientProps) {
  const router = useRouter();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Restore scroll position after navigation and content render
    const restoreScroll = () => {
      const savedPosition = sessionStorage.getItem('infinite-scroll-position');
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedPosition, 10));
          sessionStorage.removeItem('infinite-scroll-position');
        });
      }
    };

    // Use setTimeout to ensure DOM is updated
    const timeoutId = setTimeout(restoreScroll, 0);
    return () => clearTimeout(timeoutId);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Save scroll position before navigation
          sessionStorage.setItem('infinite-scroll-position', String(window.scrollY));
          router.push(`/infinite-scroll?page=${currentPage + 1}`);
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
  }, [hasMore, currentPage, router]);

  return (
    <div ref={observerTarget} style={{ height: '20px', marginTop: '2rem' }}>
      {hasMore ? (
        <div className="loading">Loading more articles...</div>
      ) : (
        <div className="loading">No more articles to load.</div>
      )}
    </div>
  );
}

