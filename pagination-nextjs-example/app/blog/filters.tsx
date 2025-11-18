'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FiltersProps {
  categories: string[];
  currentFilters: {
    category?: string;
    search?: string;
    sort?: string;
    per_page?: number;
  };
}

export default function Filters({ categories, currentFilters }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when search changes (debounced)
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    
    params.set('page', '1'); // Reset to page 1 on search
    router.push(`/blog?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    params.set('page', '1'); // Reset to page 1 when filters change
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="filters">
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={currentFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort By</label>
          <select
            id="sort"
            value={currentFilters.sort || 'id:ASC'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <optgroup label="ID">
              <option value="id:ASC">ID ASC</option>
              <option value="id:DESC">ID DESC</option>
            </optgroup>
            <optgroup label="Title">
              <option value="title:ASC">Title A-Z</option>
              <option value="title:DESC">Title Z-A</option>
            </optgroup>
            <optgroup label="Views">
              <option value="views:DESC">Most Views</option>
              <option value="views:ASC">Least Views</option>
            </optgroup>
            <optgroup label="Published Date">
              <option value="published_date:DESC">Newest Published</option>
              <option value="published_date:ASC">Oldest Published</option>
            </optgroup>
            <optgroup label="Category">
              <option value="category:ASC">Category A-Z</option>
              <option value="category:DESC">Category Z-A</option>
            </optgroup>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="per_page">Items Per Page</label>
          <select
            id="per_page"
            value={currentFilters.per_page || 10}
            onChange={(e) => handleFilterChange('per_page', e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <Link href="/blog" className="btn btn-secondary">
          Clear Filters
        </Link>
      </div>
    </div>
  );
}

