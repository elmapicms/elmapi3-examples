'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

interface LanguageSwitcherProps {
  currentLocale: string;
  currentPostUuid?: string;
}

export default function LanguageSwitcher({ currentLocale, currentPostUuid }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<string | null>(null);

  const switchLanguage = async (targetLocale: string) => {
    if (targetLocale === currentLocale) return;

    // If we're on a post detail page, get the translation
    if (currentPostUuid && pathname.startsWith('/post/')) {
      setLoading(targetLocale);
      try {
        const response = await fetch(
          `/api/translations?uuid=${currentPostUuid}&locale=${targetLocale}`
        );
        if (response.ok) {
          const translation = await response.json();
          if (translation && translation.uuid) {
            router.push(`/post/${translation.uuid}?locale=${targetLocale}`);
          } else {
            router.push(`/?locale=${targetLocale}`);
          }
        } else {
          // Translation not available, just switch locale on home
          router.push(`/?locale=${targetLocale}`);
        }
      } catch (error) {
        console.error('Error fetching translation:', error);
        router.push(`/?locale=${targetLocale}`);
      } finally {
        setLoading(null);
      }
    } else {
      // On home page, just switch locale
      router.push(`/?locale=${targetLocale}`);
    }
  };

  return (
    <div className="language-switcher">
      {LOCALES.map((locale) => (
        <button
          key={locale.code}
          onClick={() => switchLanguage(locale.code)}
          disabled={loading === locale.code || currentLocale === locale.code}
          className={`lang-btn ${currentLocale === locale.code ? 'active' : ''} ${loading === locale.code ? 'loading' : ''}`}
        >
          {locale.label}
        </button>
      ))}
      <style jsx>{`
        .language-switcher {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
        }
        .lang-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .lang-btn:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: #999;
        }
        .lang-btn.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }
        .lang-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .lang-btn.loading {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

